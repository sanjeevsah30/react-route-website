import React from "react";
import { Input } from "antd";

import "./styles.scss";
import CloseSvg from "app/static/svg/CloseSvg";
const { TextArea } = Input;

function DebounceTextArea({
    onChange,
    condition,
    value,
    placeholder,
    className,
    showClose,
    toggleClose,
    showFeedbackIcon,
    minRow = 4,
    maxRow = 4,
}) {
    return (
        <div id="audit_note" className={`posRel ${className}`}>
            <TextArea
                placeholder={placeholder}
                autoSize={{ minRows: minRow, maxRows: maxRow }}
                onChange={onChange}
                value={value}
            />
            {condition ? (
                <span className="feedback-writeNotesave auditWriteNote posAbs colorDanger">
                    ...SAVING
                </span>
            ) : (
                // <i
                //     className="fa fa-check-circle feedback-writeNotesave auditWriteNote posAbs
                //     colorSuccess"
                //     aria-hidden="true"
                // ></i>
                <></>
            )}
            {showClose && (
                <div className="close_icon" onClick={toggleClose}>
                    <CloseSvg
                        style={{
                            color: "#5C5C5C",
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default DebounceTextArea;
