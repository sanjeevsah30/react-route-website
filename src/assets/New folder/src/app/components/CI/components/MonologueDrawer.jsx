import React, { useState } from "react";
import { Drawer, Popover, Skeleton } from "antd";

import MonologuePlayer from "@presentational/reusables/MonologuePlayer";
import useResizeWidth from "hooks/useResizeWidth";
import { useDispatch, useSelector } from "react-redux";

import {
    getDateTime,
    getDuration,
    getDurationInSeconds,
    goToTranscriptTab,
    secondsToTime,
} from "@tools/helpers";

import { getPhraseSnippets } from "@store/ci/actions";

import CloseSvg from "app/static/svg/CloseSvg";

import "./styles.scss";
import PlaySvg from "app/static/svg/PlaySvg";
import ShareSvg from "app/static/svg/ShareSvg";
import Sharer from "@container/Sharer/Sharer";
import VirtualMonologue from "./VirtualMonologue";

export default function MonologueDrawer({
    isVisible,
    title,
    nextSnippetsUrl,
    snippets = [],
    getNext,
    handleClose,
    snippetLoading,
}) {
    const [shareConfig, setShareConfig] = useState({});
    const [showShare, setShowShare] = useState(false);
    return (
        <Drawer
            placement="right"
            onClose={handleClose}
            visible={isVisible}
            getContainer={false}
            className="snippetsDrawer"
            bodyStyle={{
                padding: "0",
            }}
            title={<div className="font20 blod600">Snippets</div>}
            extra={
                <>
                    <span className="curPoint" onClick={handleClose}>
                        <CloseSvg />
                    </span>
                </>
            }
        >
            {snippets && (
                <Skeleton active loading={!snippets.length && snippetLoading}>
                    <VirtualMonologue
                        Component={MonologueCard}
                        data={snippets}
                        nextSnippetsUrl={nextSnippetsUrl}
                        loading={snippetLoading}
                        visible={isVisible}
                        snippetLoading={snippetLoading}
                        getNext={getNext}
                        setShareConfig={setShareConfig}
                        setShowShare={setShowShare}
                    />
                </Skeleton>
            )}

            {showShare && (
                <Sharer
                    config={{ ...shareConfig, visible: showShare }}
                    sharerHandler={() => setShowShare(false)}
                    totalLength={shareConfig?.shareDuration}
                    monologues={[]}
                    callName={""}
                    setShowUpdateShareModal={() => {}}
                />
            )}
        </Drawer>
    );
}

const MonologueCard = ({
    id,
    title,
    search_context = [],
    start_time,
    end_time,
    isSample,
    setShareConfig,
    setShowShare,
    meeting_type,
}) => {
    return (
        <div className="monologue_card flex" key={id}>
            <div className="flex1">
                <div className="monologue_card_title">
                    <p
                        // target={'_target'}
                        onClick={() => {
                            const win = window.open(`/call/${id}`);
                            win.focus();
                        }}
                        className="title"
                    >
                        <span>{title}</span>
                    </p>
                    <p className="date">
                        {getDateTime(start_time)} |{" "}
                        {getDuration(start_time, end_time)}
                    </p>
                </div>

                <div className=" monologues_snippets">
                    <Monologue
                        id={id}
                        isSample={isSample}
                        monologues={search_context || []}
                        meeting_type={meeting_type}
                    />
                </div>
            </div>
            <div
                style={{
                    borderLeft: "1px solid #99999920",
                }}
                className="flex alignCenter paddingLR10 curPoint"
                onClick={() => {
                    setShowShare(true);
                    setShareConfig({
                        id,
                        shareDuration: [
                            0,
                            getDurationInSeconds(start_time, end_time),
                        ],
                    });
                }}
            >
                <ShareSvg
                    style={{
                        color: "#666666",
                        transform: "scale(0.8)",
                    }}
                />
            </div>
        </div>
    );
};

const Monologue = ({
    meeting_title,
    id,
    monologues,
    goToTranscriptPage,
    meeting_type,
}) => {
    const { domain } = useSelector((state) => state.common);
    return (
        <>
            {monologues?.map((monologue, idx) => (
                <div className={`flex alignCenter`} key={idx}>
                    {meeting_type === "call" && (
                        <Popover
                            overlayClassName={
                                "minWidth30 maxWidth30 maxHeight30"
                            }
                            destroyTooltipOnHide={{ keepParent: false }}
                            content={
                                <MonologuePlayer
                                    id={id}
                                    start_time={monologue.start_time}
                                    end_time={monologue.end_time}
                                />
                            }
                            title={meeting_title}
                            placement={"bottom"}
                            trigger="hover"
                            // getPopupContainer={() =>
                            //     document.getElementById(`search__callCard${id}`)
                            // }
                        >
                            <PlaySvg />
                        </Popover>
                    )}

                    <p
                        className="font14 marginLR14  flex1"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToTranscriptTab({
                                event: e,
                                start_time: monologue.start_time,
                                end_time: monologue.end_time,
                                headline: monologue.headline,
                                meeting_id: id,
                                domain,
                            });
                        }}
                    >
                        <span className="dove_gray_cl font14 bold600 marginR4">
                            {secondsToTime(monologue.start_time)} :
                        </span>
                        <span className="paddingR8 font14 bold600 capitalize">
                            {monologue.speaker_name || "Multiple Speakers"} :
                        </span>
                        <span
                            className="srchCallCard__monologue mine_shaft_cl"
                            dangerouslySetInnerHTML={{
                                __html: monologue?.headline,
                            }}
                        ></span>
                    </p>
                </div>
            ))}
        </>
    );
};
