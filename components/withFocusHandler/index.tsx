import React, { ComponentType, createRef, useCallback, useEffect, useState } from "react";
import { Subtract } from "utility-types";

export type withFocusHandlerProps = {
  hasFocus: boolean;
}

export function withFocusHandler<P extends withFocusHandlerProps> (Component: ComponentType<P>) {
  const WrappedWithFocusHandler = (props: Subtract<P, withFocusHandlerProps>) => {
    const [hasFocus, setHasFocus] = useState(false);
    const container = createRef<HTMLElement>();

    const handleFocus = useCallback((e: FocusEvent) => container.current && setHasFocus((e.target && container.current.contains(e.target as Node)) || false), [container]);

    const handleBlur = useCallback((e: FocusEvent) => container.current && setHasFocus((e.relatedTarget && container.current.contains(e.relatedTarget as Node)) || false), [container]);

    useEffect(() => {
      handleFocus({
        target: document.activeElement
      } as FocusEvent);
      document.body.addEventListener("focusin", handleFocus);
      document.body.addEventListener("focusout", handleBlur);

      return () => {
        document.body.removeEventListener("focusin", handleFocus);
        document.body.removeEventListener("focusout", handleBlur);
      };
    }, [handleFocus, handleBlur]);

    return (
      <Component
        {...props as P}
        ref={container}
        hasFocus={hasFocus}
      />
    );
  };

  WrappedWithFocusHandler.displayName = `withFocusHandler(${Component.displayName})`;

  return React.memo(WrappedWithFocusHandler);
}

