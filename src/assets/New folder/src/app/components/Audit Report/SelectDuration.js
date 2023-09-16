import Icon from "@presentational/reusables/Icon";
import {
    setReportCallDuration,
    setReportFilterCallDuration,
} from "@store/audit_report/actions";
import { uid } from "@tools/helpers";
import { Popover, Select, Slider } from "antd";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { ReportContext } from "./AuditReport";

function SelectDuration({ style = {} }) {
    const id = uid();
    const { filterCallDuration } = useContext(ReportContext);
    const [durationSlider, setDurationSlider] = useState(
        filterCallDuration?.options?.[filterCallDuration.active]?.value
    );

    const dispatch = useDispatch();
    const renderDurationPopup = () => (
        <>
            <div className="filter__duration--tagContainer">
                {Object.keys(filterCallDuration.options).map((key) => (
                    <span
                        className={`filter__duration--tag ${
                            key === filterCallDuration.active ||
                            +key === +filterCallDuration.active
                                ? "active"
                                : ""
                        }`}
                        key={key}
                        onClick={() => {
                            setDurationSlider(
                                filterCallDuration?.options?.[key]?.value
                            );
                            dispatch(setReportCallDuration(key));
                        }}
                    >
                        {filterCallDuration?.options?.[key]?.text}
                    </span>
                ))}
            </div>
            <p className="text-center font12 bold paddingTB10">
                OR SELECT CUSTOM RANGE
            </p>
            <Slider
                range
                max={120}
                className="filter__duration--slider"
                value={durationSlider}
                onChange={(value) => setDurationSlider(value)}
                onAfterChange={(values) =>
                    dispatch(setReportFilterCallDuration(values))
                }
            />
        </>
    );
    return (
        <div className="filter" id={id}>
            <Popover
                className="filter__duration--popup"
                placement="bottomRight"
                title={"Select duration range"}
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
                    className="marginR15 duration__select custom__select"
                    dropdownClassName={"duration__select__dropdown"}
                    // dropdownClassName={'account_select_dropdown'}
                    style={{ ...style }}
                    suffixIcon={
                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                    }
                ></Select>
            </Popover>
        </div>
    );
}

export default SelectDuration;
