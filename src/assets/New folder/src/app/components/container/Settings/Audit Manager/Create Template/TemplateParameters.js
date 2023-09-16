import { Checkbox, Col, Row, Select, Tooltip } from "antd";
import React from "react";
import { useSelector } from "react-redux";

function TemplateParameters({
    callTags,
    callType,
    setCallTags,
    setCallType,
    notifyOnAudit,
    setNotifyOnAudit,
    setMeetingType,
    meetingType,
    isDefaultTemplate,
    setIsDefaultTemplate,
}) {
    const { tags, call_types } = useSelector((state) => state.common);

    const handlers = {
        addTag: (_, data) => {
            setCallTags([...callTags, data]);
        },
        removeTag: (_, data) => {
            setCallTags(callTags.filter(({ id }) => id !== data.id));
        },
        addType: (_, data) => {
            setCallType([...callType, data]);
        },
        removeType: (_, data) => {
            setCallType(callType.filter(({ id }) => id !== data.id));
        },
        addMeetingType: (_, data) => {
            setMeetingType([...meetingType, data]);
        },
        removeMeetingType: (_, data) => {
            setMeetingType(meetingType.filter(({ id }) => id !== data.id));
        },
    };

    const optionsTags = tags.map((tag) => {
        return {
            id: tag.id,
            value: tag.tag_name,
        };
    });

    const optionsType = call_types.map((item) => {
        return {
            id: item.id,
            value: item.type,
        };
    });
    return (
        <div className="paddingTB16">
            <div className="bold font16 marginB10">Applicable Parameters</div>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <div className="marginB10  auditColorGrey">Call Tags</div>
                    <TagTypeSelect
                        placeholder={"Choose Call Tags"}
                        value={
                            callTags?.length > 0
                                ? callTags?.map((tag, idx) => {
                                      return tag.value;
                                  })
                                : []
                        }
                        options={optionsTags}
                        onDeselect={handlers.removeTag}
                        onSelect={handlers.addTag}
                    />
                </Col>
                <Col span={24}>
                    <div className="marginB10  auditColorGrey">Call Types</div>
                    <TagTypeSelect
                        placeholder={"Choose Call Type"}
                        value={
                            callType?.length > 0
                                ? callType?.map((tag, idx) => {
                                      return tag.value;
                                  })
                                : []
                        }
                        options={optionsType}
                        onDeselect={handlers.removeType}
                        onSelect={handlers.addType}
                    />
                </Col>
                <Col span={24}>
                    <div className="marginB10  auditColorGrey">
                        Meeting Types
                    </div>
                    <Select
                        placeholder={"CHOOSE MEETING TYPE"}
                        // value={}
                        options={[
                            { id: 1, value: "None" },
                            { id: 2, value: "Call" },
                            { id: 3, value: "Chat" },
                            { id: 4, value: "Email" },
                        ]}
                        value={meetingType}
                        onChange={(value) => setMeetingType(value)}
                        style={{
                            width: "100%",
                            textTransform: "initial",
                            fontSize: 12,
                        }}
                    />
                </Col>
                <Col span={24}>
                    <Checkbox
                        checked={notifyOnAudit}
                        onChange={(e) => setNotifyOnAudit(e.target.checked)}
                    >
                        <span className="dove_gray_cl">Notify on Audit</span>
                    </Checkbox>
                    <Checkbox
                        checked={isDefaultTemplate}
                        onChange={(e) => setIsDefaultTemplate(e.target.checked)}
                    >
                        <span className="dove_gray_cl">Make Default</span>
                    </Checkbox>
                </Col>
            </Row>
        </div>
    );
}

const TagTypeSelect = ({
    value,
    options,
    onDeselect,
    onSelect,
    placeholder,
    selectType,
}) => {
    const getString = (omittedValues) => {
        return omittedValues
            .map((data) => data?.label?.toLowerCase())
            .join(", ");
    };

    return (
        <Select
            mode={selectType ? selectType : "tags"}
            className="width100p"
            placeholder={placeholder}
            value={value}
            options={options}
            onDeselect={onDeselect}
            onSelect={onSelect}
            maxTagCount={2}
            maxTagPlaceholder={(omittedValues) => (
                <Tooltip
                    destroyTooltipOnHide
                    title={getString(omittedValues)}
                    placement={"top"}
                >
                    <span>+{omittedValues.length}</span>
                </Tooltip>
            )}
        />
    );
};
export default TemplateParameters;
