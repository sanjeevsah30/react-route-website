import React from "react";
import ErrorCollector from "app/components/ErrorCollector/ErrorCollector";

const withErrorCollector = (Component) => (props) => {
    return (
        <ErrorCollector module={props.module}>
            <Component {...props} />
        </ErrorCollector>
    );
};

export default withErrorCollector;
