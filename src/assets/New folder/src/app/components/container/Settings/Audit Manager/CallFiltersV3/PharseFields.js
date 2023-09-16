import "../../../../CallFilters/Template/template.scss";
import React from "react";

import auditConfig from "@constants/Audit";

import { Col, Input, Row, Select, Slider } from "antd";
import callFiltersConfig from "@constants/CallFilters/index";

const { TextArea } = Input;
const { Option } = Select;

function PharseFields({
    phrase,
    setPhrase,
    isPresent,
    setIsPresent,
    spokenBy,
    setSpokenBy,
    window,
    setWindow,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    edit,
}) {
    return (
        <Row gutter={[12, 12]} className="alignCenter">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <div className="colorFilterGrey paddingB8">Phrase</div>
                        {edit ? (
                            <TextArea
                                className="audit__input__bg resize_vertical"
                                placeholder={
                                    auditConfig.FILTER_PHRASE_PLACEHOLDER
                                }
                                autoSize={{
                                    minRows: 5,
                                }}
                                value={phrase}
                                onChange={(e) => {
                                    setPhrase(e.target.value);
                                }}
                            />
                        ) : (
                            <div
                                className="overflowYscroll"
                                style={{
                                    maxHeight: "120px",
                                }}
                            >
                                {phrase}
                            </div>
                        )}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Row gutter={[12, 12]} className="paddingB20">
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="colorFilterGrey paddingB8">
                                    Spoken By
                                </div>
                                {edit ? (
                                    <Select
                                        name="client"
                                        optionFilterProp="children"
                                        className="font14"
                                        value={spokenBy.length}
                                        onChange={(value) => {
                                            setSpokenBy(
                                                value === 1
                                                    ? ["owner"]
                                                    : value === 2
                                                    ? ["client", "participant"]
                                                    : [
                                                          "owner",
                                                          "client",
                                                          "participant",
                                                      ]
                                            );
                                        }}
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <Option value={1}>
                                            {auditConfig.SAID_BY_REP}
                                        </Option>
                                        <Option value={2}>
                                            {auditConfig.SAID_BY_OTHERS}
                                        </Option>
                                        <Option value={3}>
                                            {auditConfig.SAID_BY_BOTH}
                                        </Option>
                                    </Select>
                                ) : (
                                    <div>
                                        {spokenBy?.length === 1
                                            ? callFiltersConfig.SAID_BY_REP
                                            : spokenBy?.length === 2
                                            ? callFiltersConfig.SAID_BY_OTHERS
                                            : callFiltersConfig.SAID_BY_BOTH}
                                    </div>
                                )}
                            </Col>
                        </Row>
                        <Row gutter={[12, 12]} className="paddingB20">
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="paddingB8">
                                    <span className="colorFilterGrey">
                                        Window -
                                    </span>
                                    <span className="bold marginL5">
                                        {window}
                                    </span>
                                </div>
                                {edit && (
                                    <Slider
                                        onChange={(val) => {
                                            setWindow(val);
                                        }}
                                        value={window}
                                        min={1}
                                        max={12}
                                    />
                                )}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row gutter={[12, 12]} className="alignCenter">
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Row gutter={[12, 12]} className="alignCenter">
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div className="colorFilterGrey paddingB8">
                                    Start Time
                                </div>
                                {edit ? (
                                    <Input
                                        required
                                        value={startTime}
                                        placeholder={
                                            auditConfig.START_TIME_PLACEHOLDER
                                        }
                                        onChange={(e) => {
                                            setStartTime(e.target.value);
                                        }}
                                    />
                                ) : (
                                    startTime
                                )}
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div className="colorFilterGrey paddingB8">
                                    End Time
                                </div>
                                {edit ? (
                                    <Input
                                        required
                                        value={endTime}
                                        placeholder={
                                            auditConfig.END_TIME_PLACEHOLDER
                                        }
                                        onChange={(e) => {
                                            setEndTime(e.target.value);
                                        }}
                                    />
                                ) : (
                                    <div>{endTime}</div>
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Row gutter={[12, 12]} className="alignCenter">
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div className="colorFilterGrey paddingB8">
                                    Search Start
                                </div>
                                {edit ? (
                                    <Input
                                        required
                                        value={startAt}
                                        placeholder={
                                            auditConfig.SEARCH_START_PLACEHOLDER
                                        }
                                        onChange={(e) => {
                                            setStartAt(e.target.value);
                                        }}
                                    />
                                ) : (
                                    <div>{startAt}</div>
                                )}
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div className="colorFilterGrey paddingB8">
                                    Search End
                                </div>
                                {edit ? (
                                    <Input
                                        required
                                        value={endAt}
                                        placeholder={
                                            auditConfig.SEARCH_END_PLACEHOLDER
                                        }
                                        onChange={(e) => {
                                            setEndAt(e.target.value);
                                        }}
                                    />
                                ) : (
                                    <div>{endAt}</div>
                                )}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default PharseFields;
