import { getTags } from "@store/common/actions";
import { Button, Popover } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThreeDotSvg from "app/static/svg/ThreeDotSvg";
import { CallCardTags, CardCallType } from "../MyMeetings/CompletedCallCard";
import CustomTypeSelector from "../Resuable/Select/CustomTypeSelector";

export default function MoreOptions({
    showUserOptions,
    callType,
    handleNewType,
    allCallTypes,
    call,
    callId,
    updateCall,
    ...rest
}) {
    const content = (
        <>
            <p className="font12 dvGrey">Add Type</p>
            <CardCallType
                call_id={callId}
                showOwnerActions={showUserOptions}
                MAX_TAGS_COMPLETED={5}
                callType={call.call_types}
                updateCall={updateCall}
            />
            <p className="font12 dvGrey marginT12">Add Tags</p>
            <CallCardTags
                call_id={callId}
                showOwnerActions={showUserOptions}
                MAX_TAGS_COMPLETED={5}
                callTags={call.tags}
                updateCall={updateCall}
            />
        </>
    );
    return (
        <Popover
            overlayClassName="invdl__left--moreOptionsContent"
            title="More Options"
            placement="bottom"
            content={content}
            trigger="click"
        >
            <Button className="invdl__left--moreOptionsBtn">
                <ThreeDotSvg />
            </Button>
        </Popover>
    );
}
