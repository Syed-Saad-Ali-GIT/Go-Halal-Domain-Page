/**
 * BarcodeDetector API Polyfill
 * This provides a basic polyfill for browsers that don't support the BarcodeDetector API
 * It uses ZXing as a fallback for barcode detection
 */

import { BrowserMultiFormatReader, DecodeHintType, NotFoundException, BarcodeFormat } from "@zxing/library";

// Only create polyfill if BarcodeDetector doesn't exist
if (typeof window !== 'undefined' && !('BarcodeDetector' in window)) {
  class BarcodeDetectorPolyfill {
    constructor(options = {}) {
      // Configure supported formats
      this.formats = options.formats || ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'code_93', 'data_matrix', 'qr_code'];
      
      // Create ZXing reader
      const hints = new Map();
      
      // Convert web standard format names to ZXing format enum
      const formatMap = {
        'ean_13': BarcodeFormat.EAN_13,
        'ean_8': BarcodeFormat.EAN_8,
        'upc_a': BarcodeFormat.UPC_A,
        'upc_e': BarcodeFormat.UPC_E,
        'code_128': BarcodeFormat.CODE_128,
        'code_39': BarcodeFormat.CODE_39,
        'code_93': BarcodeFormat.CODE_93,
        'data_matrix': BarcodeFormat.DATA_MATRIX,
        'qr_code': BarcodeFormat.QR_CODE
      };
      
      const zxingFormats = this.formats
        .map(format => formatMap[format])
        .filter(Boolean);
      
      if (zxingFormats.length > 0) {
        hints.set(DecodeHintType.POSSIBLE_FORMATS, zxingFormats);
      }
      hints.set(DecodeHintType.TRY_HARDER, true);
      
      this.reader = new BrowserMultiFormatReader(hints);
    }

    async detect(image) {
      try {
        // For video elements, we need special handling
        if (image instanceof HTMLVideoElement) {
          // Check if video is valid
          if (!image.videoWidth || !image.videoHeight) {
            console.warn('Video element has no dimensions. Ensure it is properly loaded.');
            return [];
          }
          
          // Check if video is playing
          if (image.paused || image.ended) {
            console.warn('Video is paused or ended. It should be playing for barcode detection.');
            return [];
          }
          
          // Make sure the video is ready and playing
          if (image.readyState < 2) { // HAVE_CURRENT_DATA
            try {
              await new Promise((resolve, reject) => {
                const handler = () => {
                  image.removeEventListener('loadeddata', handler);
                  resolve();
                };
                
                const errorHandler = (error) => {
                  image.removeEventListener('loadeddata', handler);
                  image.removeEventListener('error', errorHandler);
                  reject(new Error('Video element encountered an error: ' + error));
                };
                
                // Set a timeout to avoid hanging indefinitely
                const timeout = setTimeout(() => {
                  image.removeEventListener('loadeddata', handler);
                  image.removeEventListener('error', errorHandler);
                  resolve(); // Resolve anyway and try to detect
                }, 3000);
                
                image.addEventListener('loadeddata', () => {
                  clearTimeout(timeout);
                  handler();
                });
                
                image.addEventListener('error', (error) => {
                  clearTimeout(timeout);
                  errorHandler(error);
                });
                
                // If video is already loaded, resolve immediately
                if (image.readyState >= 2) {
                  clearTimeout(timeout);
                  resolve();
                }
              });
            } catch (error) {
              console.error('Error waiting for video to be ready:', error);
              // Continue anyway and try to detect
            }
          }
          
          // Use canvas capture method as a more reliable approach
          try {
            // Create a canvas to draw the current video frame
            const canvas = document.createElement('canvas');
            canvas.width = image.videoWidth;
            canvas.height = image.videoHeight;
            
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            // Capture the current frame
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            
            // Decode from canvas
            try {
              const result = await this.reader.decodeFromCanvas(canvas);
              
              if (result) {
                return [{
                  boundingBox: null,
                  cornerPoints: [],
                  format: result.getBarcodeFormat().toString().toLowerCase().replace('_', '-'),
                  rawValue: result.getText()
                }];
              }
            } catch (error) {
              if (error instanceof NotFoundException) {
                return [];
              }
              console.error('Error during canvas decoding:', error);
              
              // Fall back to direct video method if canvas approach fails
              try {
                const result = await this.reader.decodeOnceFromVideoElement(image);
                if (result) {
                  return [{
                    boundingBox: null,
                    cornerPoints: [],
                    format: result.getBarcodeFormat().toString().toLowerCase().replace('_', '-'),
                    rawValue: result.getText()
                  }];
                }
              } catch (videoError) {
                if (videoError instanceof NotFoundException) {
                  return [];
                }
                // Both methods failed
                console.error('Fallback video decoding also failed:', videoError);
                return [];
              }
            }
          } catch (canvasError) {
            console.error('Error setting up canvas for video frame capture:', canvasError);
            
            // Try direct video method as fallback
            try {
              const result = await this.reader.decodeOnceFromVideoElement(image);
              if (result) {
                return [{
                  boundingBox: null,
                  cornerPoints: [],
                  format: result.getBarcodeFormat().toString().toLowerCase().replace('_', '-'),
                  rawValue: result.getText()
                }];
              }
            } catch (error) {
              if (error instanceof NotFoundException) {
                return [];
              }
              throw error;
            }
          }
          
          return [];
        }
        
        // For image elements, canvases, etc.
        let bitmap;
        if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement) {
          bitmap = image;
        } else {
          // For other input types, try to create an ImageBitmap
          try {
            bitmap = await createImageBitmap(image);
          } catch (error) {
            console.error('Failed to create bitmap from input:', error);
            return [];
          }
        }
        
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = bitmap.width || 300;
        canvas.height = bitmap.height || 200;
        
        try {
          ctx.drawImage(bitmap, 0, 0);
          
          // Decode from canvas
          const result = await this.reader.decodeFromCanvas(canvas);
          
          if (result) {
            return [{
              boundingBox: null,
              cornerPoints: [],
              format: result.getBarcodeFormat().toString().toLowerCase().replace('_', '-'),
              rawValue: result.getText()
            }];
          }
        } catch (error) {
          if (error instanceof NotFoundException) {
            return [];
          }
          console.error('Error during canvas decoding:', error);
        }
        
        return [];
      } catch (error) {
        // ZXing throws errors when no barcode is found, but we want to return an empty array
        if (error instanceof NotFoundException) {
          return [];
        }
        console.error('BarcodeDetector polyfill error:', error);
        return [];
      }
    }

    static async getSupportedFormats() {
      return [
        'ean_13',
        'ean_8',
        'upc_a',
        'upc_e',
        'code_128',
        'code_39',
        'code_93',
        'data_matrix',
        'qr_code'
      ];
    }
  }

  // Register the polyfill
  window.BarcodeDetector = BarcodeDetectorPolyfill;
  console.log('BarcodeDetector polyfill installed');
}

export default {}; 