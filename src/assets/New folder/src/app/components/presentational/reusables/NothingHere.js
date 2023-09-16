import React from "react";
import { Button } from "antd";
import Icon from "./Icon";

const style = {
    maxWidth: "574px",
    width: "574px",
    height: "422px",
    backgroundColor: "#F7F9FC",
    borderRadius: "24px",
    paddingTop: "76px",
};

function NothingHere({ Svg, heading, text, button_text, onClick }) {
    return (
        <div style={style} className="text-center">
            <div>
                <div className="marginB10">
                    <Svg />
                </div>
                <div className="marginB25">
                    <div className="bold font22">{heading}</div>
                    <div>{text}</div>
                </div>
                <Button
                    style={{
                        height: "44px",
                    }}
                    type="primary"
                    onClick={onClick}
                >
                    {button_text}
                    <Icon
                        style={{
                            marginLeft: "10px",
                        }}
                        className={"fa-angle-right"}
                    />
                </Button>
            </div>
        </div>
    );
}

export default NothingHere;
