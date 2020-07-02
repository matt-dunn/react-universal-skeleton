import React, { ReactNode, useEffect, useRef, useState } from "react";

type DelayProps = {
    children: ReactNode | ReactNode[];
    delay?: number;
};

export const Component = ({ children, delay = 500 }: DelayProps) => {
  const [show, setShow] = useState(false);
  const t = useRef<number>();

  useEffect(() => {
    t.current = setTimeout(() => {
      setShow(true);
    }, delay) as unknown as number;

    return () => {
      clearTimeout(t.current);
    };
  }, [delay]);

  if (show) {
    return <>{children}</>;
  }

  return null;
};

export const Delay = React.memo(Component);
