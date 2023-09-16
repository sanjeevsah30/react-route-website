import React from "react";
import AiSiderContext from "./AiSiderContext";
import AiSiderUI from "./AiSiderUI";

function AiSiderTab({ children, ...rest }) {
    const { Provider } = AiSiderContext;

    return (
        <Provider value={{ ...rest }}>
            <AiSiderUI />
        </Provider>
    );
}

export default AiSiderTab;
