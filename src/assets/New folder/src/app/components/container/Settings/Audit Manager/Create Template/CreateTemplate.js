import React, { useContext, useEffect, useState } from "react";
import { Layout } from "antd";
import "./createTemplate.scss";
import "../auditManager.scss";
import GeneralSettings from "./GeneralSettings";
import TemplateLayout from "../Layout/TemplateLayout";
import { AuditContext } from "../AuditManager";
import { useDispatch, useSelector } from "react-redux";
import {
    createAuditTemplateRequest,
    getAuditTemplatesRequest,
} from "@store/call_audit/actions";
import { constructTags } from "@store/call_audit/util";
import Teams from "../Teams";
const { Sider } = Layout;

function CreateTemplate(props) {
    const { setActiveTab, VIEW_TEMAPLATES } = useContext(AuditContext);
    const [name, setName] = useState("");
    const [teams_id, setTeams_id] = useState([]);
    const [tags, setTags] = useState({
        red_alert: false,
        zero_tolerance: false,
    });
    const [callTags, setCallTags] = useState([]);
    const [callType, setCallType] = useState([]);
    const [meetingType, setMeetingType] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAuditTemplatesRequest());
    }, []);
    const versionData = useSelector((state) => state.common.versionData);
    const [notifyOnAudit, setNotifyOnAudit] = useState(true);
    const [isDefaultTemplate, setIsDefaultTemplate] = useState(true);

    return (
        <TemplateLayout
            save_text={"CREATE"}
            showFooter={true}
            name={
                versionData?.domain_type !== "b2c"
                    ? "CREATE A CALL SCORECARD  TEMPLATE"
                    : "CREATE A CALL AUDIT TEMPLATE"
            }
            save={() => {
                dispatch(
                    createAuditTemplateRequest({
                        name,
                        teams: teams_id,
                        tags: constructTags(tags),
                        parameters: {
                            call_tags: callTags.map(({ value, id }) => id),
                            call_types: callType.map(({ value, id }) => id),
                            ...(meetingType !== "None"
                                ? {
                                      meeting_type: meetingType?.toLowerCase(),
                                  }
                                : {}),
                        },
                        notify_on_audit: notifyOnAudit,
                        is_default: isDefaultTemplate,
                    })
                );
            }}
            goBack={() => setActiveTab(VIEW_TEMAPLATES)}
        >
            <GeneralSettings
                style={{
                    paddingTop: "30px",
                }}
                name={name}
                setName={setName}
                tags={tags}
                setTags={setTags}
            />
            <Sider
                className="create__template__teams overflowYscroll"
                breakpoint={"md"}
                theme="light"
                collapsedWidth={0}
                trigger={null}
                width={358}
            >
                <Teams
                    setTeams_id={setTeams_id}
                    teams_id={teams_id}
                    callTags={callTags}
                    setCallTags={setCallTags}
                    callType={callType}
                    setCallType={setCallType}
                    notifyOnAudit={notifyOnAudit}
                    isDefaultTemplate={isDefaultTemplate}
                    setIsDefaultTemplate={setIsDefaultTemplate}
                    setNotifyOnAudit={setNotifyOnAudit}
                    setMeetingType={setMeetingType}
                    meetingType={meetingType}
                />
            </Sider>
        </TemplateLayout>
    );
}

export default CreateTemplate;
