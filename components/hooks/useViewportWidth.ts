import ResizeSensor from "css-element-queries/src/ResizeSensor";
import {MutableRefObject, useLayoutEffect, useRef, useState} from "react";

export type ViewportDimensions = {width: number; height: number};

const useViewportWidth = (ref: MutableRefObject<Element | undefined>): ViewportDimensions | undefined => {
    const [dimensions, setDimensions] = useState<ViewportDimensions>();
    const resizeSensor = useRef<ResizeSensor>();

    useLayoutEffect(() => {
        if (!ref.current) {
            return
        }

        resizeSensor.current = new ResizeSensor(ref.current, d => {
            if (!dimensions || dimensions.width !== d.width || dimensions.height !== d.height) {
                setDimensions(d)
            }
        });

        return () => {
            resizeSensor.current && resizeSensor.current.detach();
        }
    }, [dimensions, ref])

    return dimensions;
};

export default useViewportWidth;
