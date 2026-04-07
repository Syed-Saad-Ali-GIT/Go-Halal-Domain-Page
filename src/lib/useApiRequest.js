import React, { useEffect, useState, useRef } from 'react';
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat,
  NotFoundException,
  IllegalArgumentException
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
  [DecodeHintType.TRY_HARDER, true],
]);

const COOLDOWN_MS = 2000;
const FALLBACK_TIME_MS = 10000;

export default function BarcodeScannerComponent({ onScan, onError, onManualEntryRequest }) {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const mountedRef = useRef(true);

  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [torchCapable, setTorchCapable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [zoomCapable, setZoomCapable] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [initializing, setInitializing] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const lastRead = useRef({ value: null, time: 0 });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      readerRef.current?.reset();
      videoRef.current?.srcObject
        ?.getTracks()
        .forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader(hints);
readerRef.current
  .getVideoInputDevices()
  .then(devs => {
    if (!mountedRef.current) return [];
    if (devs.length === 0) throw new Error('No camera found');
    // explicit permission request
    return navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
        return devs;
      });
  })
  .then(devs => {
    if (!mountedRef.current || !devs.length) return;
    setDevices(devs);
    const back = devs.find(d => /rear|back|environment/i.test(d.label));
    setDeviceId(back ? back.deviceId : devs[0].deviceId);
  })
  .catch(err => {
    if (!mountedRef.current) return;
    console.error('Camera initialization error:', err);
    onError?.(err.message || 'Failed to initialize camera');
  });

const timer = setTimeout(() => {
      if (mountedRef.current) setShowUpload(true);
    }, FALLBACK_TIME_MS);

    return () => {
      clearTimeout(timer);
      readerRef.current.reset();
    };
  }, [onError]);

  useEffect(() => {
    if (!deviceId || !readerRef.current) return;

    readerRef.current.reset();
    setInitializing(true);

    const constraints = {
      video: {
        deviceId: { exact: deviceId },
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
      }
    };

    readerRef.current
      .decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result, err) => {
          if (!mountedRef.current) return;
          if (result) {
            const text = result.getText();
            const now = Date.now();
            if (
              text !== lastRead.current.value ||
              now - lastRead.current.time > COOLDOWN_MS
            ) {
              lastRead.current = { value: text, time: now };
              navigator.vibrate?.(100);
              try { new Audio('/scan-beep.mp3').play().catch(() => {}); } catch {}
              onScan(text);
            }
          } else if (
            err &&
            !(err instanceof NotFoundException) &&
            !(err instanceof IllegalArgumentException)
          ) {
            onError?.(err.message || 'Error scanning barcode');
          }
        },
        constraints
      )
      .then(() => {
        if (!mountedRef.current) return;
        setInitializing(false);
        const track = videoRef.current?.srcObject
          ?.getVideoTracks()[0];
        const caps = track?.getCapabilities?.() || {};
        if (caps.torch) setTorchCapable(true);
        if (caps.zoom) {
          setZoomCapable({
            min: caps.zoom.min,
            max: caps.zoom.max,
            step: caps.zoom.step || 0.1
          });
          setZoom(track.getSettings().zoom || caps.zoom.min || 1);
        }
      })
      .catch(err => {
        if (!mountedRef.current) return;
        onError?.(err.message || 'Could not access camera');
        setInitializing(false);
        setShowUpload(true);
      });

    return () => {
      readerRef.current.reset();
      videoRef.current?.srcObject
        ?.getTracks()
        .forEach(t => t.stop());
    };
  }, [deviceId, onScan, onError]);

  const switchCamera = () => {
    if (devices.length < 2) return;
    const idx = devices.findIndex(d => d.deviceId === deviceId);
    setDeviceId(devices[(idx + 1) % devices.length].deviceId);
  };

  const toggleTorch = () => {
    if (!torchCapable) return;
    const track = videoRef.current?.srcObject
      ?.getVideoTracks()[0];
    if (!track) return;
    track
      .applyConstraints({ advanced: [{ torch: !torchOn }] })
      .then(() => setTorchOn(v => !v))
      .catch(() => onError?.('Could not toggle torch'));
  };

  const handleZoom = e => {
    const z = parseFloat(e.target.value);
    const track = videoRef.current?.srcObject
      ?.getVideoTracks()[0];
    track
      ?.applyConstraints({ advanced: [{ zoom: z }] })
      .then(() => setZoom(z))
      .catch(() => onError?.('Could not set zoom'));
  };

  const handleUpload = async e => {
    const file = e.target.files[0];
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
      try { new Audio('/scan-beep.mp3').play().catch(() => {}); } catch {}
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
      {initializing && <div className="scanner-loading">Initializing…</div>}
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
      <div className="scanner-controls">
        {devices.length > 1 && <button onClick={switchCamera}>🔄</button>}
        {torchCapable && <button onClick={toggleTorch}>{torchOn ? '🔦' : '💡'}</button>}
        {zoomCapable && (
          <input
            type="range"
            min={zoomCapable.min}
            max={zoomCapable.max}
            step={zoomCapable.step}
            value={zoom}
            onChange={handleZoom}
          />
        )}
        {onManualEntryRequest && <button onClick={onManualEntryRequest}>⌨️</button>}
      </div>
      {showUpload && (
        <div className="scanner-upload-fallback">
          <p>Can't scan? Upload image:</p>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
      )}
    </div>
  );
}
