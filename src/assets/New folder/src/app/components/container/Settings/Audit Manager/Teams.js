import React, { useContext } from "react";
import { Checkbox } from "antd";
import { checkArray } from "@tools/helpers";
import { AuditContext } from "./AuditManager";
import TemplateParameters from "./Create Template/TemplateParameters";
import { CustomMultipleSelect } from "app/components/Resuable/index";
import CustomTreeMultipleSelect from "app/components/Resuable/Select/CustomTreeMultipleSelect";
function Teams({
    setTeams_id,
    teams_id,

    callTags,
    setCallTags,
    callType,
    setCallType,
    notifyOnAudit,
    setNotifyOnAudit,
    setMeetingType,
    meetingType,
    isDefaultTemplate,
    setIsDefaultTemplate,
}) {
    const { teams } = useContext(AuditContext);

    return (
        <div>
            <div className="paddingLR30 paddingT30">
                <div className="bold font16 marginB10">Applicable Teams</div>
                {/* <CustomMultipleSelect
                    data={teams}
                    value={teams_id.map((id) => String(id))}
                    onChange={(values) => {
                        setTeams_id([...values]);
                    }}
                    placeholder="Select Teams"
                    select_placeholder="Select Teams"
                    style={{
                        width: '100%',

                        height: 'auto',
                        padding: '0',
                    }}
                    className=" multiple__select"
                    option_name="name"
                    type="team"
                /> */}
                <CustomTreeMultipleSelect
                    data={teams}
                    value={teams_id}
                    onChange={(values) => {
                        setTeams_id([...values]);
                    }}
                    placeholder="Select Teams"
                    select_placeholder="Select Teams"
                    style={{
                        width: "100%",

                        height: "auto",
                        padding: "0",
                    }}
                    className=" multiple__select"
                    fieldNames={{
                        label: "name",
                        value: "id",
                        children: "subteams",
                    }}
                    option_name="name"
                    type="team"
                    treeNodeFilterProp="name"
                />
                {/*                 
                <Checkbox.Group
                    className="flex row"
                    onChange={(values) => {
                        setTeams_id([...values]);
                    }}
                    value={teams_id}
                >
                    {checkArray(teams).map(({ id, name }) => {
                        return (
                            <div
                                key={id}
                                className="col-24 paddingB8 capitalize"
                            >
                                <Checkbox value={Number(id)}>{name}</Checkbox>
                            </div>
                        );
                    })}
                </Checkbox.Group> */}
            </div>
            <div className="paddingLR30 marginT10">
                <TemplateParameters
                    callTags={callTags}
                    setCallTags={setCallTags}
                    callType={callType}
                    setCallType={setCallType}
                    notifyOnAudit={notifyOnAudit}
                    setNotifyOnAudit={setNotifyOnAudit}
                    isDefaultTemplate={isDefaultTemplate}
                    setIsDefaultTemplate={setIsDefaultTemplate}
                    setMeetingType={setMeetingType}
                    meetingType={meetingType}
                />
            </div>
        </div>
    );
}

Teams.defaultProps = {
    teams: [],
    teams_id: [],
    setTeams_id: () => {},
};

export default Teams;
