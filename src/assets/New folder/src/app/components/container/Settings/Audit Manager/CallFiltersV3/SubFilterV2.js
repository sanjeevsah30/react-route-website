import auditConfig from "@constants/Audit/index";
import { Col, Input, Row, Button, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import PharseFields from "./PharseFields";

function SubFilterV2({
    id,
    display_name,
    variable_name,
    phrase,
    spoken_by,
    search_sliding_window,
    search_start_seq,
    search_end_seq,
    search_start_time,
    search_end_time,
    edit,
    removeSubFilters,
    subfilters,
    setSubfilters,
    subFilterToEdit,
}) {
    const [displayName, setDisplayName] = useState(display_name);
    const [variableName, setVariableName] = useState(variable_name);
    const [qPhrase, setQphrase] = useState(phrase);
    const [qSpokenBy, setQSpokenBy] = useState(spoken_by);
    const [qWindow, setQWindow] = useState(search_sliding_window);
    const [startSeq, setStartSeq] = useState(search_start_seq);
    const [endSeq, setEndSeq] = useState(search_end_seq);
    const [startTime, setStartTime] = useState(search_start_time);
    const [endTime, setEndTime] = useState(search_end_time);

    useEffect(() => {
        let newFilters = subfilters.map((subfilter) => {
            if (subfilter.id === id)
                return {
                    ...subfilter,
                    display_name: displayName,
                    variable_name: variableName,
                    phrase: qPhrase,
                    spoken_by: qSpokenBy,
                    search_sliding_window: qWindow,
                    search_start_seq: startSeq,
                    search_end_seq: endSeq,
                    search_start_time: startTime,
                    search_end_time: endTime,
                };
            else return subfilter;
        });
        setSubfilters(newFilters);
    }, [
        displayName,
        variableName,
        qPhrase,
        qSpokenBy,
        qWindow,
        startSeq,
        endSeq,
        startTime,
        endTime,
    ]);

    return (
        <div className="criteria_card marginB20">
            <Row gutter={[12, 12]} className="alignCenter paddingB20">
                {typeof id === "number" ? (
                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                        <div className="colorFilterGrey paddingB8">ID</div>
                        <div className="font14">{id}</div>
                    </Col>
                ) : (
                    <></>
                )}

                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                    <div className="colorFilterGrey paddingB8">
                        Display Name
                    </div>
                    {edit ? (
                        <Input
                            required
                            value={displayName}
                            placeholder={auditConfig.DISPLAY_NAME_PLACEHOLDER}
                            onChange={(e) => {
                                setDisplayName(e.target.value);
                            }}
                        />
                    ) : (
                        <div>{displayName}</div>
                    )}
                </Col>
                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                    <div className="colorFilterGrey paddingB8">
                        Variable Name
                    </div>
                    {edit ? (
                        <Input
                            required
                            value={variableName}
                            placeholder={auditConfig.VARIABLE_NAME_PLACEHOLDER}
                            onChange={(e) => {
                                setVariableName(e.target.value);
                            }}
                        />
                    ) : (
                        <div>{variableName}</div>
                    )}
                </Col>
            </Row>
            <PharseFields
                phrase={qPhrase}
                setPhrase={setQphrase}
                spokenBy={qSpokenBy}
                setSpokenBy={setQSpokenBy}
                window={qWindow}
                setWindow={setQWindow}
                startAt={startSeq}
                setStartAt={setStartSeq}
                endAt={endSeq}
                setEndAt={setEndSeq}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                edit={edit}
            />

            <div className="marginTB10 flex row-reverse">
                <Popconfirm
                    title="Are you sure to delete this filter?"
                    onConfirm={() => {
                        removeSubFilters(id);
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger>Delete</Button>
                </Popconfirm>

                {!edit && (
                    <Button type="primary" onClick={() => subFilterToEdit(id)}>
                        Edit
                    </Button>
                )}
            </div>
        </div>
    );
}

export default SubFilterV2;
