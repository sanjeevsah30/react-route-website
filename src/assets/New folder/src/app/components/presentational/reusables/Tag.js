// Reusable presentational component for tags.

import React from "react";
import { Tooltip } from "antd";

// A simple tag component with label and a className (Optional) as its props.

const Tag = (props) => {
    let label = props.label ? props.label : "";

    return (
        <Tooltip
            destroyTooltipOnHide
            title={props.tooltip || label}
            placement={props.position || "top"}
        >
            <div
                className={props.tagClass ? `${props.tagClass} tag` : "tag"}
                onClick={props.handleClick}
            >
                <span
                    className={
                        props.isEditable ? "tag-label edit" : "tag-label"
                    }
                >
                    {label}
                </span>
                {props.isEditable && (
                    <span
                        className="tag-close"
                        onClick={() => props.handleRemoveTag(props.tagId)}
                    >
                        {props.isDeleting ? (
                            <i className="fa fa-spinner fa-pulse fa-fw"></i>
                        ) : (
                            <i
                                className="fa fa-times-circle"
                                aria-hidden="true"
                            ></i>
                        )}
                    </span>
                )}
            </div>
        </Tooltip>
    );
};

export default Tag;
