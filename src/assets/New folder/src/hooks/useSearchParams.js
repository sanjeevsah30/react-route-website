import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function useSearchParams() {
    const [params, setParams] = useState({
        get: () => {},
    });
    const location = useLocation();
    useEffect(() => {
        const urlSearchParamsObj = new URLSearchParams(location.search);
        setParams(urlSearchParamsObj);
    }, [location]);
    return params;
}
