import React, { useEffect, useState } from "react";

type RelativeTimeStyle = "short" | "narrow" | "long";

type RelativeTimeProps = {
  timestamp: number;
  autoUpdate?: boolean;
  style?: RelativeTimeStyle;
}

const value = (seconds: number) => {
  if (Math.abs(seconds) >= 60 * 60 * 24 * 365) {
    return Math.floor(seconds / (60 * 60 * 24 * 365));
  } else if (Math.abs(seconds) >= 60 * 60 * 24 * 30) {
    return Math.floor(seconds / (60 * 60 * 24 * 30));
  } else if (Math.abs(seconds) >= 60 * 60 * 24) {
    return Math.floor(seconds / (60 * 60 * 24));
  } else if (Math.abs(seconds) >= 60 * 60) {
    return Math.floor(seconds / (60 * 60));
  } else if (Math.abs(seconds) >= 60) {
    return Math.floor(seconds / (60));
  }

  return 0;
};

const format = (seconds: number) => {
  if (Math.abs(seconds) >= 60 * 60 * 24 * 365) {
    return "year";
  } else if (Math.abs(seconds) >= 60 * 60 * 24 * 30) {
    return "month";
  } else if (Math.abs(seconds) >= 60 * 60 * 24) {
    return "day";
  } else if (Math.abs(seconds) >= 60 * 60) {
    return "hour";
  } else if (Math.abs(seconds) >= 60) {
    return "minute";
  }

  return "second";
};

const formattedTimestamp = (timestamp: number, style: RelativeTimeStyle): string => {
  if (typeof Intl !== "undefined" && (Intl as any).RelativeTimeFormat) {
    const offset = Date.now();
    const seconds = Math.round((timestamp - offset) / 1000);
    const rtf = new (Intl as any).RelativeTimeFormat("en", {
      localeMatcher: "best fit",
      numeric: "auto",
      style
    });

    return rtf.format(value(seconds), format(seconds));
  } else {
    return "";
  }
};

const RelativeTime = ({ timestamp, autoUpdate = true, style = "short" }: RelativeTimeProps) => {
  const [formatted, setFormatted] = useState(formattedTimestamp(timestamp, style));

  useEffect(() => {
    const i = autoUpdate && setInterval(() => {
      setFormatted(formattedTimestamp(timestamp, style));
    }, 1000 * 60);

    return () => {
      i && clearInterval(i);
    };
  }, [autoUpdate, timestamp, style]);

  useEffect(() => {
    setFormatted(formattedTimestamp(timestamp, style));
  }, [timestamp, style]);

  return (
    <>{formatted}</>
  );
};

const RelativeTimeMemo = React.memo(RelativeTime);

export { RelativeTimeMemo as RelativeTime };
