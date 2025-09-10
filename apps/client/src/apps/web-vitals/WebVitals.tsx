import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export default function WebVitals() {
  return import.meta.env.DEV ? <WebVitalsLogger /> : null;
}

function WebVitalsLogger() {
  useEffect(() => {
    onCLS(console.log);
    onFCP(console.log);
    onINP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  }, []);

  return null;
}
