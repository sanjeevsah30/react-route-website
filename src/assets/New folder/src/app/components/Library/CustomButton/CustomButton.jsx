import React from "react";
import "./button.style.scss";
import { Button } from "antd";
import { UploadAltSvg } from "app/static/svg/indexSvg";

function CustomButton(props) {
    return (
        <Button
            type="primary"
            onClick={() => {}}
            className="libary_upload_btn flex alignCenter justifyCenter"
            style={{ height: "44px" }}
            {...props}
        >
            <UploadAltSvg outline="#ffffff" style={{ marginTop: "2.5px" }} />
            <span
                className="marginL8 bold600"
                style={{ marginTop: "2px", textTransform: "uppercase" }}
            >
                Upload
            </span>
        </Button>
    );
}

export default CustomButton;
