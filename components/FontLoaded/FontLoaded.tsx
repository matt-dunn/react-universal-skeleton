import React, { ReactNode, useState } from "react";
import webfontloader, { Config } from "webfontloader";

type FontLoadedProps = {
  children: ReactNode;
  config: Config;
}

export const Component = ({ config, children }: FontLoadedProps) => {
  const [loaded, setLoaded] = useState(() => {
    webfontloader.load({
      ...config,
      fontactive: () => setLoaded(true),
      fontinactive: () => setLoaded(true)
    });

    return false;
  });

  return <>{(loaded && children) || null}</>;
};

export const FontLoaded = React.memo(Component);
