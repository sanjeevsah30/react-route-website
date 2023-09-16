import React from "react";
import PropTypes from "prop-types";

const LinearGradient = (props) => {
    const { data } = props;
    const boxStyle = {
        width: 180,
        margin: "auto",
    };
    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${data.fromColor} , ${data.toColor})`,
        height: 20,
    };
    return (
        <div>
            <div style={boxStyle} className="flex">
                <span>{data.min}</span>
                <span className="flex1"></span>
                <span>{data.max}</span>
            </div>
            <div
                style={{ ...boxStyle, ...gradientStyle }}
                className="marginT8"
            ></div>
        </div>
    );
};

LinearGradient.propTypes = {
    data: PropTypes.object.isRequired,
};

export default LinearGradient;
