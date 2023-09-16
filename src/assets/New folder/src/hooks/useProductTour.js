import { useEffect, useState } from "react";
import commonConfig from "@constants/common/index";
import { updateTourJson } from "@tools/helpers";

export default function useProductTour(tourKey) {
    const [runTour] = useState(false);

    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        return () => {
            updateTourJson(tourKey, false);
        };
    }, []);

    return [runTour, stepIndex, setStepIndex];
}
