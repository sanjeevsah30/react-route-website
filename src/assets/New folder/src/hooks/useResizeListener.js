import { useEffect, useState } from "react";

function useResizeListener(initWidth) {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const resizeListener = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener("resize", resizeListener);

        return () => window.removeEventListener("resize", resizeListener);
    }, []);

    return [width];
}

export default useResizeListener;
