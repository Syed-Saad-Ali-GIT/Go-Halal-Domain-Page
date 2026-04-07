import React, { useEffect, useState, useRef } from 'react';
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat,
  NotFoundException
} from '@zxing/library';
import '../App.css';

const hints = new Map([
  [DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.CODE_128,
    BarcodeFormat.QR_CODE,
  ]],
]);

const COOLDOWN_MS = 2000;
const FALLBACK_TIME_MS = 10000;

export default function BarcodeScannerComponent({ onScan, onError, onManualEntryRequest }) {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const mountedRef = useRef(true);
  const lastRead = useRef({ value: null, time: 0 });

  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [torchCapable, setTorchCapable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [zoomCapable, setZoomCapable] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [initializing, setInitializing] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      readerRef.current?.reset();
      videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Initialize: request permission then enumerate devices
  useEffect(() => {
    const reader = new BrowserMultiFormatReader(hints);
    readerRef.current = reader;

    // request camera permission first
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        stream.getTracks().forEach(t => t.stop());
        return reader.getVideoInputDevices();
      })
      .then(devs => {
        if (!mountedRef.current) return;
        if (!devs.length) throw new Error('No camera found');
        setDevices(devs);
        const back = devs.find(d => /rear|back|environment/i.test(d.label));
        setDeviceId(back ? back.deviceId : devs[0].deviceId);
      })
      .catch(err => {
        if (!mountedRef.current) return;
        console.error('Initialization error:', err);
        onError?.(err.message || 'Failed to initialize camera');
        setShowUpload(true);
      });

    const timer = setTimeout(() => {
      if (mountedRef.current) setShowUpload(true);
    }, FALLBACK_TIME_MS);

    return () => {
      clearTimeout(timer);
      reader.reset();
    };
  }, [onError]);

  // Start scanning
  useEffect(() => {
    if (!deviceId) return;
    const reader = readerRef.current;
    reader.reset();
    setInitializing(true);

    reader.decodeFromVideoDevice(
      deviceId,
      videoRef.current,
      (result, err) => {
        if (!mountedRef.current) return;
        if (result) {
          const text = result.getText();
          const now = Date.now();
          if (text !== lastRead.current.value || now - lastRead.current.time > COOLDOWN_MS) {
            lastRead.current = { value: text, time: now };
            navigator.vibrate?.(100);
            try { new Audio('/scan-beep.mp3').play(); } catch {}
            onScan(text);
            // optionally reset reader to stop continuous scanning
            // reader.reset();
          }
        } else if (err && !(err instanceof NotFoundException)) {
          onError?.(err.message || 'Error scanning barcode');
        }
      }
    )
    .then(() => {
      if (!mountedRef.current) return;
      setInitializing(false);
      const track = videoRef.current.srcObject?.getVideoTracks()[0];
      const caps = track?.getCapabilities?.() || {};
      if (caps.torch) setTorchCapable(true);
      if (caps.zoom) {
        setZoomCapable({ min: caps.zoom.min, max: caps.zoom.max, step: caps.zoom.step || 0.1 });
        setZoom(track.getSettings().zoom || caps.zoom.min || 1);
      }
    })
    .catch(err => {
      if (!mountedRef.current) return;
      console.error('Scan start error:', err);
      onError?.(err.message || 'Could not access camera');
      setInitializing(false);
      setShowUpload(true);
    });

    return () => {
      reader.reset();
      videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
    };
  }, [deviceId, onScan, onError]);

  const switchCamera = () => {
    if (devices.length < 2) return;
    const idx = devices.findIndex(d => d.deviceId === deviceId);
    setDeviceId(devices[(idx + 1) % devices.length].deviceId);
  };

  const toggleTorch = () => {
    if (!torchCapable) return;
    const track = videoRef.current.srcObject?.getVideoTracks()[0];
    track?.applyConstraints({ advanced: [{ torch: !torchOn }] })
      .then(() => setTorchOn(v => !v))
      .catch(() => onError?.('Could not toggle torch'));
  };

  const handleZoomChange = e => {
    const z = parseFloat(e.target.value);
    const track = videoRef.current.srcObject?.getVideoTracks()[0];
    track?.applyConstraints({ advanced: [{ zoom: z }] })
      .then(() => setZoom(z))
      .catch(() => onError?.('Could not set zoom'));
  };

  const handleUpload = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      setTimeout(rej, 5000);
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    try {
      const result = await readerRef.current.decodeFromCanvas(canvas);
      navigator.vibrate?.(100);
      try { new Audio('/scan-beep.mp3').play(); } catch {}
      onScan(result.getText());
    } catch {
      onError?.('No barcode found in image');
    } finally {
      URL.revokeObjectURL(url);
      e.target.value = '';
    }
  };

  return (
    <div className="scanner-container">
      {initializing && <div className="scanner-loading">Initializing camera…</div>}

      <div className="scanner-focus-area">
        <div className="scanner-targeting-box">
          <div className="scanner-corner top-left" />
          <div className="scanner-corner top-right" />
          <div className="scanner-corner bottom-left" />
          <div className="scanner-corner bottom-right" />
          <div className="scanner-scan-line" />
        </div>
        <div className="scanner-instruction">Center barcode in box</div>
      </div>

      <video
        ref={videoRef}
        className="scanner-video"
        playsInline
        muted
        autoPlay
      />

      {/* Camera Swap Button - Top Left */}
      {devices.length > 1 && (
        <button 
          onClick={switchCamera} 
          className="scanner-control-button"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          🔄
        </button>
      )}

      {/* Torch Button - Top Right */}
      {torchCapable && (
        <button 
          onClick={toggleTorch} 
          className="scanner-control-button"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {torchOn ? '🔦' : '💡'}
        </button>
      )}

      {showUpload && (
        <div className="scanner-upload-fallback">
          <p>Can't scan? Upload image:</p>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
      )}
    </div>
  );
}
