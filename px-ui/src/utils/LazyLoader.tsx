import { FC, ReactNode, useEffect, useState } from "react";

interface LazyLoaderProps {
  delay?: number;
  children: ReactNode;
}

const LazyLoader: FC<LazyLoaderProps> = ({ delay = 250, children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  return show ? children : null;
};

export { LazyLoader as default };
