/**
 * Camera utilities for handling permissions and mobile-specific functionality
 */

// Check if device is mobile
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if device is iOS
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Check if device is Android
export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

// Check if browser supports camera
export const isCameraSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// Check camera permission status
export const getCameraPermissionStatus = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'camera' });
    return result.state; // 'granted', 'denied', or 'prompt'
  } catch (error) {
    return 'unknown';
  }
};

// Request camera permission with proper constraints for mobile
export const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    return stream;
  } catch (error) {
    throw new Error(`Camera access denied: ${error.message}`);
  }
};

// Get available video devices
export const getVideoDevices = async () => {
  if (!isCameraSupported()) {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.warn('Could not enumerate devices:', error);
    return [];
  }
};

// Find back camera device
export const findBackCamera = (devices) => {
  return devices.find(device => 
    /rear|back|environment/i.test(device.label) || 
    /back/i.test(device.deviceId)
  );
};

// Find front camera device
export const findFrontCamera = (devices) => {
  return devices.find(device => 
    /front|user|selfie/i.test(device.label) || 
    /front/i.test(device.deviceId)
  );
};

// Check if device has multiple cameras
export const hasMultipleCameras = async () => {
  const devices = await getVideoDevices();
  return devices.length > 1;
};

// Get camera capabilities
export const getCameraCapabilities = (stream) => {
  if (!stream) return {};
  
  const track = stream.getVideoTracks()[0];
  if (!track) return {};
  
  const capabilities = track.getCapabilities?.() || {};
  const settings = track.getSettings?.() || {};
  
  return {
    torch: !!capabilities.torch,
    zoom: capabilities.zoom ? {
      min: capabilities.zoom.min,
      max: capabilities.zoom.max,
      step: capabilities.zoom.step || 0.1,
      current: settings.zoom || capabilities.zoom.min || 1
    } : null,
    focusMode: capabilities.focusMode || [],
    exposureMode: capabilities.exposureMode || [],
    whiteBalanceMode: capabilities.whiteBalanceMode || []
  };
};

// Apply camera constraints
export const applyCameraConstraints = async (stream, constraints) => {
  if (!stream) return false;
  
  const track = stream.getVideoTracks()[0];
  if (!track) return false;
  
  try {
    await track.applyConstraints({ advanced: [constraints] });
    return true;
  } catch (error) {
    console.warn('Could not apply camera constraints:', error);
    return false;
  }
};

// Stop camera stream
export const stopCameraStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => {
      try {
        track.stop();
      } catch (error) {
        console.warn('Error stopping camera track:', error);
      }
    });
  }
};

// Get user-friendly error message
export const getCameraErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Camera access failed. Please check permissions.';
};

// Check if running on HTTPS (required for camera on most browsers)
export const isSecureContext = () => {
  return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

// Provide feedback (vibration + sound)
export const provideScanFeedback = () => {
  // Vibration feedback
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
  
  // Audio feedback
  try {
    const audio = new Audio('/scan-beep.mp3');
    audio.volume = 0.3; // Lower volume to not be jarring
    audio.play().catch(error => {
      console.warn('Could not play scan sound:', error);
    });
  } catch (error) {
    console.warn('Could not create audio for scan feedback:', error);
  }
};

// Wake lock to prevent screen from turning off during scanning
export const requestWakeLock = async () => {
  try {
    if ('wakeLock' in navigator) {
      const wakeLock = await navigator.wakeLock.request('screen');
      return wakeLock;
    }
    return null;
  } catch (error) {
    console.warn('Wake lock not supported or failed:', error);
    return null;
  }
};

// Release wake lock
export const releaseWakeLock = (wakeLock) => {
  if (wakeLock && typeof wakeLock.release === 'function') {
    wakeLock.release().catch(console.warn);
  }
}; 