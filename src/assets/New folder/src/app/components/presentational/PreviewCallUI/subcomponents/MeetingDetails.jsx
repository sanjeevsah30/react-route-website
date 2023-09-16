import React from "react";
import { Row, Col, Typography } from "antd";
import Label from "@presentational/reusables/Label";
import { secondsToTime } from "@tools/helpers";

const { Paragraph } = Typography;

const MeetingDetails = (props) => (
    <Row className={"preview_callinfo"} gutter={8}>
        <Col span={10}>
            <Label label="Call Name" />
            <Paragraph ellipsis>{props.meeting_json.title}</Paragraph>
        </Col>
        <Col span={8}>
            <Label label="Client" />
            {props.meeting_json.client ? (
                <Paragraph ellipsis>
                    {props.meeting_json.client.first_name ||
                        props.meeting_json.client.email ||
                        props.meeting_json.client.company}
                </Paragraph>
            ) : (
                <Paragraph ellipsis>-</Paragraph>
            )}
        </Col>
        <Col span={6}>
            <Label label="Call Duration" />
            <Paragraph ellipsis>
                {secondsToTime(props.mEndTime - props.mStartTime)}
            </Paragraph>
        </Col>
    </Row>
);

export default MeetingDetails;
