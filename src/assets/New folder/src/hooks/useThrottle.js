import { useEffect, useRef, useState } from "react";

export const useThrottle = (value, delay) => {
    const lastRan = useRef(Date.now());
    const [throttleValue, setThrottleValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(function () {
            if (Date.now() - lastRan.current >= delay) {
                setThrottleValue(value);
                lastRan.current = Date.now();
            }
        }, delay - (Date.now() - lastRan.current));

        return () => {
            clearTimeout(handler);
        };
    }, [value]);
    return throttleValue;
};

export default useThrottle;
