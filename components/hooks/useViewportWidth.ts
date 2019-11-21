import ResizeSensor from "css-element-queries/src/ResizeSensor";
import {MutableRefObject, useEffect, useRef, useState} from "react";

export type ViewportDimensions = {width: number; height: number};

const useViewportWidth = (ref: MutableRefObject<Element | undefined>): ViewportDimensions | undefined => {
    const [dimensions, setDimensions] = useState<ViewportDimensions>();
    const resizeSensor = useRef<ResizeSensor>();

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const rect = ref.current.getBoundingClientRect();
        setDimensions({width: rect.width, height: rect.height});

        resizeSensor.current = new ResizeSensor(ref.current, d => setDimensions(d));

        return () => {
            resizeSensor.current && resizeSensor.current.detach();
        };
    }, [ref]);

    return dimensions;
};

export default useViewportWidth;
