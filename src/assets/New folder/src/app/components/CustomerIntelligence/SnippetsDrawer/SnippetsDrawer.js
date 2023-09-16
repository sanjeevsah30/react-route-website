import React, { useContext, useState } from "react";
import { Button, Drawer, Popover, Skeleton } from "antd";
import { PlayCircleOutlined, CloseOutlined } from "@ant-design/icons";
import MonologuePlayer from "@presentational/reusables/MonologuePlayer";
import useResizeWidth from "hooks/useResizeWidth";
import { useDispatch, useSelector } from "react-redux";

import {
    getDateTime,
    getDuration,
    getDurationInSeconds,
    goToTranscriptTab,
    secondsToTime,
    uid,
} from "@tools/helpers";
import ReactVirtualSnippets from "./ReactVirtualSnippets";
import { getPhraseSnippets } from "@store/ci/actions";
import { CiContext } from "../CustomerIntelligence";
import CloseSvg from "app/static/svg/CloseSvg";

import "./drawer.scss";
import PlaySvg from "app/static/svg/PlaySvg";
import ShareSvg from "app/static/svg/ShareSvg";
import Sharer from "@container/Sharer/Sharer";

export default function SnippetsDrawer({
    isVisible,
    title,
    toggleModal,
    snippets = [],
    nextSnippetsUrl,
    phraseId,
    tabId,
    domain,
    saidByFilter,
    isSample,
    is_processed,
    phrase,
}) {
    const [width] = useResizeWidth(500);
    const snippetLoading = useSelector((state) => state.ci.snippetLoading);
    const dispatch = useDispatch();
    const getTopBarData = () => {};
    const getNext = () => {
        dispatch(
            getPhraseSnippets({
                domain,
                id: phraseId,
                tabId,
                nextSnippetsUrl,
                saidByFilter,
                topBarFilter: getTopBarData(),
                is_processed,
                phrase,
            })
        );
    };

    const [shareConfig, setShareConfig] = useState({});
    const [showShare, setShowShare] = useState(false);
    return (
        <Drawer
            placement="right"
            onClose={toggleModal}
            visible={isVisible}
            getContainer={false}
            className="snippetsDrawer"
            bodyStyle={{
                padding: "0",
            }}
            title={
                <div className="font20 blod600">{title} (Phrase/Keyword)</div>
            }
            extra={
                <>
                    <span className="curPoint" onClick={toggleModal}>
                        <CloseSvg />
                    </span>
                </>
            }
        >
            {snippets && (
                <Skeleton active loading={!snippets.length && snippetLoading}>
                    <ReactVirtualSnippets
                        Component={MonologueCard}
                        data={snippets}
                        nextSnippetsUrl={nextSnippetsUrl}
                        phraseId={phraseId}
                        domain={domain}
                        tabId={tabId}
                        loading={snippetLoading}
                        visible={isVisible}
                        snippetLoading={snippetLoading}
                        saidByFilter={saidByFilter}
                        isSample={isSample}
                        getNext={getNext}
                        setShareConfig={setShareConfig}
                        setShowShare={setShowShare}
                    />
                </Skeleton>
            )}

            {showShare && (
                <Sharer
                    domain={domain}
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
}) => {
    return (
        <div className="monologue_card flex" key={id}>
            <div className="flex1">
                <div className="monologue_card_title">
                    <p
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

const Monologue = ({ meeting_title, id, monologues, goToTranscriptPage }) => {
    const { domain } = useSelector((state) => state.common);

    return (
        <>
            {monologues?.map((monologue, idx) => (
                <div className={`flex alignCenter`} key={idx}>
                    <Popover
                        overlayClassName={"minWidth30 maxWidth30 maxHeight30"}
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
