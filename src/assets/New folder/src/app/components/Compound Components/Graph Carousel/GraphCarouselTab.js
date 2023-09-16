import React from "react";
import GraphCarouselContext from "./GraphCarouselContext";

import GraphCarouselUI from "./GraphCarouselUI";

function GraphCarouselTab({ children, ...rest }) {
    const { Provider } = GraphCarouselContext;

    return (
        <Provider value={{ ...rest }}>
            <GraphCarouselUI />
        </Provider>
    );
}

export default GraphCarouselTab;
