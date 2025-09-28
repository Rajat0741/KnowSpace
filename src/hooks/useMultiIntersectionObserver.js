import { useEffect, useRef, useState, useCallback } from "react";

const useMultiIntersectionObserver = (observerOptions = {}) => {
  const [entries, setEntries] = useState([]);
  const observer = useRef(null);

  const observe = useCallback((node) => {
    if (!node) return;
    if (observer.current) {
      observer.current.observe(node);
    }
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    observer.current = new IntersectionObserver((intersectionEntries) => {
      setEntries(intersectionEntries);
    }, observerOptions);

    return () => {
      observer.current.disconnect();
    };
  }, [observerOptions]);

  return [observe, entries];
};

export default useMultiIntersectionObserver;
