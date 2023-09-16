import { useEffect, useState } from "react";

function useResizeWidth(initWidth) {
    const [width, setWidth] = useState(initWidth);
    useEffect(() => {
        const resizeListener = () => {
            if (window.innerWidth < 600) {
                setWidth(window.innerWidth);
            } else {
                setWidth(initWidth);
            }
        };
        window.addEventListener("resize", resizeListener);

        return () => window.removeEventListener("resize", resizeListener);
    }, []);

    return [width];
}

export default useResizeWidth;
