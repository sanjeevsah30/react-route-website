import { Col, InputNumber, Row, Button, Input, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomMultipleSelect } from "app/components/Resuable/index";
import { ReasonSection } from "./QuestionSettings";

function CustomResponse({
    name,
    mandate_notes = false,
    id,
    weight,
    customResponse,
    setCustomResponce,
    removeCustom,
    index,
    appliedViolations,
    default_response,
    reasons,
    handleAddReason,
    removeReason,
    setReasonText,
    valType,
}) {
    const [resName, setResName] = useState(name);
    const [resWeight, setResWeight] = useState(weight);
    const [resMandateNotes, setResMandateNotes] = useState(mandate_notes);
    const { violations } = useSelector((state) => state.violation_manager);
    const [violation_ids, setViolation_ids] = useState(appliedViolations || []);

    useEffect(() => {
        let newCustomResponce = customResponse.map((res) => {
            if (res.id === id)
                return {
                    ...res,
                    name: resName,
                    weight: resWeight,
                    appliedViolations: violation_ids,
                    mandate_notes: resMandateNotes,
                };
            else return res;
        });

        setCustomResponce(newCustomResponce);
    }, [resName, resWeight, violation_ids, resMandateNotes]);

    useEffect(() => {
        let newCustomResponce = customResponse.map((res) => {
            if (res.id === default_response)
                return {
                    ...res,
                    default: true,
                    mandate_notes: false,
                };
            else
                return {
                    ...res,
                    default: false,
                };
        });
        if (default_response === id) {
            setResMandateNotes(false);
        }
        setCustomResponce(newCustomResponce);
    }, [default_response]);

    return (
        <div
            style={{
                border: "1px solid #99999933",
            }}
            className="marginB24 borderRadius8 padding8"
        >
            <Row gutter={[12, 0]} className="marginB10">
                <Col lg={6} md={6} sm={6} xs={6}>
                    {index === 0 && (
                        <div className="dove_gray_cl font12">Name</div>
                    )}
                    <Input
                        className=""
                        onChange={(e) => {
                            setResName(e.target.value);
                        }}
                        value={resName}
                        disabled={resName === "NA" && typeof id === "number"}
                        placeholder="Enter Name"
                    />
                </Col>

                <Col lg={4} md={4} sm={4} xs={4}>
                    {index === 0 && (
                        <div className="dove_gray_cl font12">
                            {valType === "percentage" ? "Deductions" : "Weight"}
                        </div>
                    )}
                    <InputNumber
                        className="audit__input__bg"
                        onChange={(e) => {
                            setResWeight(e);
                        }}
                        value={resWeight}
                        placeholder={"Enter weightage"}
                        disabled={resName === "NA" && typeof id === "number"}
                    />
                </Col>
                {resName !== "NA" && (
                    <Col lg={6} md={6} sm={6} xs={6}>
                        {index === 0 && (
                            <div className="dove_gray_cl font12">Violation</div>
                        )}
                        {/* <Select
                            name="tags"
                            mode="multiple"
                            placeholder={'Select Violation'}
                            onChange={(ids) => {
                                setViolation_ids(ids);
                            }}
                            value={violation_ids}
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            dropdownClassName={'account_select_dropdown'}
                            style={{
                                width: '100%',
                            }}
                        >
                            {violations.data.map((item) => (
                                <Select.Option key={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select> */}

                        <CustomMultipleSelect
                            data={violations.data}
                            className=" multiple__select"
                            option_name="name"
                            select_placeholder={"Select Violation"}
                            placeholder={"Select Violation"}
                            style={{
                                width: "100%",
                                height: "auto",
                                padding: "0",
                            }}
                            value={violation_ids?.map(String)}
                            onChange={(ids) => {
                                setViolation_ids(ids?.map?.(String));
                            }}
                        />
                    </Col>
                )}

                {(resName.toLowerCase() === "na" && typeof id !== "number") ||
                resName.toLowerCase() !== "na" ? (
                    <Col lg={4} md={4} sm={4} xs={4}>
                        {index === 0 && (
                            <div className="dove_gray_cl font12">Action</div>
                        )}
                        <Button onClick={() => removeCustom(id)} danger>
                            Delete
                        </Button>
                    </Col>
                ) : (
                    <></>
                )}
                <Col lg={4} md={4} sm={4} xs={4} className="flex alignCenter">
                    <Checkbox
                        onChange={(e) =>
                            setResMandateNotes(
                                default_response !== id
                                    ? e.target.checked
                                    : false
                            )
                        }
                        checked={resMandateNotes}
                        className="font14"
                    >
                        Notes Must
                    </Checkbox>
                </Col>
            </Row>
            {resName.toLowerCase() === "na" && typeof id !== "number" && (
                <span className="colorDanger">Please enter an other name</span>
            )}

            <ReasonSection
                option_id={id}
                reasons={reasons}
                handleAddReason={handleAddReason}
                removeReason={removeReason}
                setReasonText={setReasonText}
                default_response={default_response}
                dissable_id={id}
            />
        </div>
    );
}

export default CustomResponse;
