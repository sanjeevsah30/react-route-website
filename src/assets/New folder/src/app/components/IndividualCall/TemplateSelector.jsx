import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CallContext } from "./IndividualCall";
import { Select, Tooltip } from "antd";
import {
    createMeetingScoreObjects,
    getMeetingAiScoreStatus,
    getMeetingManualScoreStatus,
    setMeetingAuditTemplate,
} from "@store/auditSlice/auditSlice";
const { Option } = Select;

function TemplateSelector({ callId, template, callApi }) {
    const { activeCategories, setActiveCategories, setAuditStartTime } =
        useContext(CallContext);

    const { audit_template, meeting_templates } = useSelector(
        (state) => state.auditSlice
    );

    const dispatch = useDispatch();

    const onTemplateChange = (templateId) => {
        const temp = meeting_templates?.data?.find(
            ({ template: { id } }) => templateId === id
        );

        setAuditStartTime(null);
        dispatch(setMeetingAuditTemplate(temp?.template));
        setActiveCategories(temp?.categories);

        const params = {
            id: callId,
            payload: { template_id: templateId },
        };

        dispatch(getMeetingAiScoreStatus(params));
        dispatch(getMeetingManualScoreStatus(params)).then((res) => {
            dispatch(
                createMeetingScoreObjects({
                    id: callId,
                    template_id: templateId,
                })
            );
        });
    };

    useEffect(() => {
        if (
            audit_template &&
            meeting_templates.data &&
            !activeCategories?.length
        ) {
            const temp = meeting_templates.data.find(
                ({ template: { id } }) => audit_template?.id === id
            );
            setActiveCategories(temp?.categories);
        }
    }, [meeting_templates?.data?.length]);

    return (
        <>
            <Tooltip
                destroyTooltipOnHide
                title={audit_template?.name}
                placement="right"
            >
                <Select
                    value={audit_template?.id}
                    style={{
                        width: 175,
                        textTransform: "inherit",
                        padding: 0,
                        fontSize: "1rem",
                        fontWeight: 600,
                    }}
                    onChange={onTemplateChange}
                    bordered={false}
                    dropdownClassName="template_option"
                    // showArrow={allAuditTemplate?.length > 1 ? true : false}
                    // suffixIcon={
                    // <Icon className="fas fa-chevron-down dove_gray_cl" />
                    // <ChevronDownSvg />
                    // }
                >
                    {meeting_templates?.data?.length ? (
                        meeting_templates?.data?.map((item, idx) => (
                            <Option value={item?.template?.id} key={idx}>
                                {item?.template?.name}
                            </Option>
                        ))
                    ) : template ? (
                        [template]?.map((item, idx) => (
                            <Option value={item?.id} key={idx}>
                                {item?.name}
                            </Option>
                        ))
                    ) : (
                        <></>
                    )}
                </Select>
            </Tooltip>
        </>
    );
}

export default TemplateSelector;
