import { Popover } from "antd";
import React from "react";
import CloseSvg from "app/static/svg/CloseSvg";

function FiltersUI({ data, removeFilter, clearAll, blockWidth, maxCount }) {
    const MAX_COUNT = maxCount || 5;
    const rest = [...data].splice(MAX_COUNT, data.length);
    const content = (
        <div
            style={{
                height: "500px",
            }}
        >
            {rest.map(({ id, name, type }) => (
                <Block
                    key={`${type}_${id}`}
                    name={name}
                    remove={() => removeFilter({ id, type })}
                    className="marginB10"
                    blockWidth={blockWidth || 100}
                    type={type}
                    style={{
                        width: "150px",
                    }}
                />
            ))}
        </div>
    );

    return (
        <>
            <div className="filters_applied flex flex1 marginR10 alignCenter ">
                {data.slice(0, MAX_COUNT).map(({ id, name, type }) => (
                    <Block
                        key={`${type}_${id}`}
                        name={name}
                        remove={() => removeFilter({ id, type })}
                        blockWidth={blockWidth || 100}
                        type={type}
                        style={{}}
                    />
                ))}
                {!!rest.length && (
                    <Popover
                        overlayClassName="extra_filters_popover"
                        content={content}
                    >
                        <div className="curPoint bold">{rest.length}+ more</div>
                    </Popover>
                )}
                {!!data.length && (
                    <div
                        className="curPoint underline marginL10 dove_gray_cl"
                        style={{ fontSize: "12px" }}
                        onClick={clearAll}
                    >
                        Clear all
                    </div>
                )}
            </div>
        </>
    );
}

const Block = ({
    className = "",
    name,
    id,
    remove,
    blockWidth,
    type,
    style,
}) => (
    <div
        className={`${className} filter_block `}
        style={{
            ...style,
        }}
    >
        <div className={`flex1 text_ellipsis`}>
            <div
                className="font10 marginB4"
                style={{
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "capitalize",
                    height: "10px",
                }}
            >
                {type}
            </div>
            <div
                style={{
                    height: "18px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
                className="font12 bold600"
            >
                {name}
            </div>
        </div>

        <div
            className="curPoint"
            style={{
                display: "flex",
                flexShrink: "0",
            }}
            onClick={remove}
        >
            <CloseSvg
                style={{
                    transform: "scale(0.6)",
                    marginLeft: "0.875rem",
                }}
            />
        </div>
    </div>
);

export default FiltersUI;
