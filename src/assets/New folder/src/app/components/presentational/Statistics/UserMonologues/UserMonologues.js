import React, { useEffect, useState } from "react";
import { Button, Drawer, Popover, Skeleton } from "antd";
import { PlayCircleOutlined, CloseOutlined } from "@ant-design/icons";
import MonologuePlayer from "@presentational/reusables/MonologuePlayer";
import { useDispatch, useSelector } from "react-redux";
import { getTopicSnippets } from "@store/stats/actions";
import {
    getDateTime,
    getDuration,
    goToTranscriptTab,
    secondsToTime,
    uid,
} from "@tools/helpers";
import useResizeWidth from "hooks/useResizeWidth";
import ReactVirtualSnippets from "./ReactVirtualSnippets";

export default function UserMonologues({
    isVisible,
    title,
    toggleModal,
    topicId,
    filters,
    repId,
    index,
    setShowMonologueModal,
    meetings,
    repIndex,
}) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.stats);

    const topicData = useSelector(
        (state) => state.stats.topicDuration[topicId]
    );
    const [monologueData, setMonologueData] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    useEffect(() => {
        if (isVisible) {
            const findIndex = topicData.findIndex(
                (topic) => +topic.speaker_id === +repId
            );
            if (topicData?.[findIndex]?.meetings) {
                setMonologueData(topicData[findIndex].meetings);
                setNextUrl(topicData[findIndex].nextUrl);
                return;
            }
            const newFilters = filters.filter(
                (filter) => filter.name !== "owner__id"
            );
            const data = [...newFilters];
            dispatch(getTopicSnippets(data, topicId, repId));
        }
    }, [isVisible]);

    useEffect(() => {
        return () => {
            setMonologueData([]);
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            const findIndex = topicData.findIndex(
                (topic) => +topic.speaker_id === +repId
            );
            if (topicData[findIndex]?.meetings?.length) {
                setMonologueData(topicData[findIndex]?.meetings);
                setNextUrl(topicData[findIndex].nextUrl);
            }
        }
    }, [topicData]);

    const loadMore = () => {
        const newFilters = filters.filter(
            (filter) => filter.name !== "owner__id"
        );
        const data = [...newFilters];

        dispatch(getTopicSnippets(data, topicId, repId, nextUrl));
    };

    const [width] = useResizeWidth(500);
    return (
        <Drawer
            placement="right"
            onClose={() => {
                setShowMonologueModal(false);
                setMonologueData([]);
            }}
            visible={isVisible}
            getContainer={false}
            width={width}
            className={"userMonologueDrawer"}
            title={title}
            bodyStyle={{
                padding: "0",
            }}
        >
            <Skeleton active loading={!monologueData.length && loading}>
                {monologueData?.length ? (
                    <ReactVirtualSnippets
                        Component={MonologueCard}
                        data={monologueData}
                        nextSnippetsUrl={nextUrl}
                        loading={loading}
                        visible={isVisible}
                        snippetLoading={loading}
                        loadMore={loadMore}
                    />
                ) : (
                    <></>
                )}
            </Skeleton>
        </Drawer>
    );
}

const MonologueCard = ({ id, title, snippets, start_time, end_time }) => {
    return (
        <div className="borderBottom" key={id}>
            <a href={`${window.location.origin}/call/${id}`} target={"_target"}>
                <button className="ant-btn ant-btn-link ant-btn-round font14 text-bolder margin0 paddingL12">
                    <span>{title}</span>
                </button>
            </a>
            <p className="greyText font12 margin0 paddingL21">
                {getDateTime(start_time)} | {getDuration(start_time, end_time)}
            </p>
            {snippets.map((snippet, index) => {
                return (
                    <div key={uid() + index}>
                        <Monologue {...snippet} meeting_id={id} />
                    </div>
                );
            })}
        </div>
    );
};

const Monologue = ({
    id,
    meeting_title,
    meeting_id,
    start_time,
    end_time,
    text,
    speaker_name,
    style,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const { domain } = useSelector((state) => state.common);
    return (
        <div>
            <Popover
                overlayClassName={
                    "minWidth30 maxWidth30 maxHeight20 userMonologuePlyer"
                }
                destroyTooltipOnHide={{ keepParent: false }}
                content={
                    <div className="flex column posRel">
                        <Button
                            icon={<CloseOutlined />}
                            className="alignSelfEnd closeBtn"
                            type="link"
                            onClick={() => setIsVisible(false)}
                        />
                        <MonologuePlayer
                            id={meeting_id}
                            start_time={start_time}
                            end_time={end_time}
                            autoPlay={true}
                        />
                    </div>
                }
                placement={"left"}
                trigger="click"
                visible={isVisible}
                onVisibleChange={(status) => setIsVisible(status)}
            >
                <div className="flex padding6">
                    <div className="col-2">
                        <Button
                            className="margin0 text-center"
                            icon={<PlayCircleOutlined />}
                            type="link"
                        />
                    </div>
                    <div
                        className="col-22 marginTop4"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToTranscriptTab({
                                event: e,
                                start_time,
                                end_time,
                                headline: text,
                                meeting_id,
                                domain,
                            });
                        }}
                    >
                        <span className="greyText">
                            {secondsToTime(start_time)}{" "}
                        </span>
                        <span className="labelSpan">{speaker_name} : </span>
                        <span
                            className="srchCallCard__monologue"
                            dangerouslySetInnerHTML={{
                                __html: text,
                            }}
                        />
                    </div>
                </div>
            </Popover>
        </div>
    );
};
