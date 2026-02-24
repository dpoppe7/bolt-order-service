import { useState, useEffect } from 'react';

export function useScrollPosition(threshold = 100) {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > threshold) {
          setIsFixed(true);
        }
        else {
          setIsFixed(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      // cleanup: this removes the listener when user leaves CustomerView
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return isFixed;
}