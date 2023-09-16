import Icon from "@presentational/reusables/Icon";

import {
    setAccountCallDuration,
    setAccountFilterCallDuration,
} from "@store/accounts/actions";
import { InputNumber, Popover, Select, Button } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AccountsContext } from "../../../Accounts";

function SelectAccountCallDuration({
    style = {},
    className = "",
    dropdownClassName = "",
}) {
    const id = "account__call__duration";
    const { filterCallDuration } = useContext(AccountsContext);

    const dispatch = useDispatch();

    const [durationSlider, setDurationSlider] = useState(
        filterCallDuration.active !== "0" || filterCallDuration.active !== "1"
            ? filterCallDuration?.options?.[filterCallDuration.active]?.value[0]
            : null
    );

    useEffect(() => {
        setDurationSlider(
            filterCallDuration.active !== "0" &&
                filterCallDuration.active !== "1"
                ? filterCallDuration?.options?.[filterCallDuration.active]
                      ?.value[0]
                : null
        );
    }, [filterCallDuration.active]);
    const renderDurationPopup = () => (
        <>
            <div className="filter__duration--tagContainer">
                {Object.keys(filterCallDuration.options).map((key) => (
                    <span
                        className={`filter__duration--tag  ${
                            key === filterCallDuration.active ||
                            +key === +filterCallDuration.active
                                ? "active"
                                : ""
                        }`}
                        key={key}
                        onClick={() => {
                            dispatch(setAccountCallDuration(key));
                        }}
                        style={{
                            fontWeight: "600 !important",
                        }}
                    >
                        {filterCallDuration?.options?.[key]?.text}
                    </span>
                ))}
            </div>
            <p className="text-center font12 bold600 paddingTB10">
                OR ENTER MINIMUM ACCOUNT LEVEL TALK TIME
            </p>
            <div className="flex justifyCenter">
                <InputNumber
                    style={{
                        width: "40%",
                        fontWeight: "600",
                    }}
                    className="borderRadius6"
                    onPressEnter={(e) => {
                        setDurationSlider(e.target.value || 5);

                        dispatch(
                            setAccountFilterCallDuration([
                                e.target.value || 5,
                                null,
                            ])
                        );
                    }}
                    onChange={(value) => {
                        setDurationSlider(value);
                    }}
                    min={0}
                    value={durationSlider}
                />
                <Button
                    type="primary"
                    className="footer_button"
                    onClick={() => {
                        dispatch(
                            setAccountFilterCallDuration([
                                durationSlider || 5,
                                null,
                            ])
                        );
                    }}
                >
                    Go
                </Button>
            </div>
            {/* <Slider
                range
                max={120}
                className="filter__duration--slider"
                value={durationSlider}
                onChange={(value) => setDurationSlider(value)}
                onAfterChange={(values) =>
                    dispatch(setAccountFilterCallDuration(values))
                }
            /> */}
        </>
    );
    return (
        <div className="filter flex alignCenter" id={id}>
            <Popover
                className="filter__duration--popup"
                placement="bottomRight"
                title={
                    <span className="bold600">
                        Select account level talk time
                    </span>
                }
                content={renderDurationPopup()}
                trigger="click"
                getPopupContainer={() => {
                    return document.getElementById(id);
                }}
            >
                <Select
                    value={
                        filterCallDuration?.options?.[filterCallDuration.active]
                            ?.text
                    }
                    className={`${className}`}
                    dropdownClassName={dropdownClassName}
                    style={{ ...style }}
                    suffixIcon={
                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                    }
                ></Select>
            </Popover>
        </div>
    );
}

export default SelectAccountCallDuration;
