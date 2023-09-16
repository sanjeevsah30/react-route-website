import React from "react";

export default function Button(props) {
    let btnClass = props.btnClass ? `cta ${props.btnClass}` : "cta ";
    btnClass = props.faicon ? `withicon ${btnClass}` : btnClass;
    btnClass = props.isLoading ? `${btnClass} isloading` : btnClass;
    return (
        <button
            name={props.btnName || ""}
            onClick={props.handleClick}
            className={btnClass}
            title={props.btnTitle}
            type={props.btnType}
        >
            <span>
                {props.isLoading ? (
                    <p className="loading">
                        Please wait<span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </p>
                ) : (
                    props.btnLabel
                )}
            </span>
            <i
                className={`fa ${props.faicon ? props.faicon : ""}`}
                aria-hidden="true"
            ></i>
        </button>
    );
}
