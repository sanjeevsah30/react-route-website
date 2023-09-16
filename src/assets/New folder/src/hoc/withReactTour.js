import React from "react";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import useProductTour from "hooks/useProductTour";
import { updateTourJson } from "@tools/helpers";

const withReactTour = (Component) => (props) => {
    const { tourKey, tourSteps, callback } = props;
    const [runTour, stepIndex, setStepIndex] = useProductTour(tourKey);

    const handleJoyrideCallback = (data) => {
        const { action, index, type, status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            updateTourJson(tourKey, false);
        } else if (
            [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)
        ) {
            setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
        }
        if (callback) {
            callback(data);
        }
    };

    return (
        <>
            <Joyride
                run={runTour}
                stepIndex={stepIndex}
                steps={tourSteps}
                continuous={true}
                scrollToFirstStep={true}
                showProgress={false}
                showSkipButton={true}
                disableScrollParentFix={true}
                disableOverlayClose={true}
                styles={{
                    options: {
                        primaryColor: "#1A62F2",
                        overlayColor: "rgba(0, 0, 0, 0.7)",
                    },
                    buttonClose: {
                        display: "none",
                    },
                }}
                locale={{
                    last: "Done",
                }}
                callback={handleJoyrideCallback}
            />
            <Component {...props} />
        </>
    );
};

export default withReactTour;
