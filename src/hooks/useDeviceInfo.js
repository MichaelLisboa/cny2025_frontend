import { useState, useEffect } from 'react';

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    OS: 'unknown',
    deviceType: 'desktop',
    browser: 'unknown',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const OS = (() => {
        switch (true) {
          case /iPhone|iPad|iPod/i.test(userAgent):
            return 'iOS';
          case /Android/i.test(userAgent):
            return 'Android';
          case /Windows NT/i.test(userAgent):
            return 'Windows';
          case /Macintosh/i.test(userAgent):
            return 'macOS';
          case /Linux/i.test(userAgent):
            return 'Linux';
          default:
            return 'unknown';
        }
      })();
      const deviceType = (() => {
        if (!isMobile) return 'desktop';
        switch (true) {
          case /iPhone/i.test(userAgent):
            return 'iPhone';
          case /iPad/i.test(userAgent):
            return 'iPad';
          case /iPod/i.test(userAgent):
            return 'iPod';
          case /Android/i.test(userAgent):
            return 'Android';
          default:
            return 'unknown';
        }
      })();
      const browser = (() => {
        switch (true) {
          case /Chrome/i.test(userAgent):
            return 'Chrome';
          case /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent):
            return 'Safari';
          case /Firefox/i.test(userAgent):
            return 'Firefox';
          case /MSIE|Trident/i.test(userAgent):
            return 'Internet Explorer';
          case /Edge/i.test(userAgent):
            return 'Edge';
          default:
            return 'unknown';
        }
      })();

      setDeviceInfo({ isMobile, OS, deviceType, browser });
    }
  }, []);

  return deviceInfo;
};

export default useDeviceInfo;
