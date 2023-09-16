import Sharer from "@container/Sharer/Sharer";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ActiveCallContext } from "../ActiveCallView";
import { getDurationInSeconds } from "@tools/helpers";
import {
    fetchCallComments,
    getTranscript,
    initializeIndividualCall,
} from "@store/individualcall/actions";
import { getAllUsers } from "@store/common/actions";
import { resetCallAudit } from "@store/call_audit/actions";
import { QMSActiveCallContext } from "./QmsView";

const QmsShare = ({
    isShareVisible,
    showShare,
    setShowShare,
    setShowUpdateShareModal,
    showUpdateShareModal,
}) => {
    const domain = useSelector((state) => state.common.domain);
    const { id: callId } = useParams();
    const [shareDuration, setShareDuration] = useState(null);
    const [callerOverview, setcallerOverview] = useState({});
    const [callDetails, setcallDetails] = useState({});
    const { activeCall } = useContext(QMSActiveCallContext);
    const dispatch = useDispatch();
    const allUsers = useSelector((state) => state.common.users);

    useEffect(() => {
        if (!showShare && shareDuration) {
            setShareDuration(null);
        }
    }, [showShare]);

    const monologues = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].monologues
            : {}
    );

    useEffect(() => {
        // Make an API Call to get the Caller Overview.
        setcallerOverview({
            recpName: callDetails.owner && callDetails.owner.first_name,
            totalLength: getDurationInSeconds(
                callDetails.start_time,
                callDetails.end_time
            ),
            mainLabel: `${
                callDetails.stats && callDetails.stats.owner_question_count
            } Questions`,
            talkratio: `${
                callDetails.stats &&
                (callDetails.stats.owner_talk_ratio * 100).toFixed(2)
            } %`,
        });

        // Make an API Call to get the Receiver Overview.
    }, [callDetails]);

    useEffect(() => {
        dispatch(initializeIndividualCall(callId));

        // setcallDetails(
        //     activeCall.callDetails &&
        //         Object.keys(activeCall.callDetails).length > 0
        //         ? activeCall.callDetails
        //         : {}
        // );

        if (!allUsers.length) {
            dispatch(getAllUsers());
        }
        // Making an API Call to get the comments on the Call.
        // commentHandlers.getComments();

        return () => {
            dispatch(resetCallAudit());
        };
    }, []);

    return (
        <>
            {(showShare || showUpdateShareModal) && isShareVisible && (
                <Sharer
                    domain={domain}
                    config={{
                        id: callId,
                        visible: true,
                        shareDuration,
                    }}
                    sharerHandler={() => setShowShare(false)}
                    totalLength={callerOverview.totalLength}
                    monologues={monologues}
                    // callName={activeCall['callName']}
                    setShowUpdateShareModal={setShowUpdateShareModal}
                    isQms={
                        activeCall.callDetails.conference_tool == "convin_qms"
                    }
                />
            )}
        </>
    );
};

export default QmsShare;
