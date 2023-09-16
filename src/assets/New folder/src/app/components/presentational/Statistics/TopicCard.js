import React, { useState, useEffect } from "react";
import { Card, Button, Skeleton, Progress, Modal, Tooltip } from "antd";
import { useSelector } from "react-redux";
import { orderBy, isEmpty } from "lodash";
import { getRandomColors, uid } from "@tools/helpers";
import statisticsConfig from "@constants/Statistics/index";
import { NoData } from "@reusables";
import { PlayCircleOutlined } from "@ant-design/icons";

export default function TopicCard(props) {
    const topicData = useSelector(
        (state) => state.stats.topicDuration[props.topic.id]
    );
    const { toggleMonologueModal } = props;
    const [isExpended, setIsExpended] = useState(false);
    const [repSortedData, setRepSortedData] = useState([]);
    useEffect(() => {
        if (topicData) {
            getRepSortedData();
        } else {
            setRepSortedData([]);
        }
    }, [topicData, props.reps]);

    const getRepSortedData = () => {
        let data = [];

        for (const topic of topicData) {
            if (props.reps[topic.speaker_id]) {
                data.push({
                    ...topic,
                    repId: props.reps[topic.speaker_id].repId,
                    repName: props.reps[topic.speaker_id].repName,
                });
            }
        }

        setRepSortedData(orderBy(data, "presence_per_call", "desc"));
    };

    return (
        <Card
            className={`topic-card`}
            title={props.topic.name}
            headStyle={{
                backgroundColor: `${getRandomColors(props.topic.name)}`,
            }}
            extra={
                isEmpty(repSortedData) ? (
                    <></>
                ) : (
                    <Button
                        type="link"
                        onClick={() => setIsExpended((prev) => !prev)}
                    >
                        All Reps
                    </Button>
                )
            }
        >
            <Skeleton loading={props.fetchingData} active>
                {isEmpty(repSortedData) ? (
                    <NoData description={"No Data found"} />
                ) : (
                    <>
                        <RepListHeader />
                        <div className="reps-data">
                            {repSortedData
                                .slice(
                                    0,
                                    statisticsConfig.TOPIC_MAX_COLLAPSED + 1
                                )
                                .map((rep, index) => {
                                    return (
                                        <RepListItem
                                            key={uid() + rep.repId}
                                            rep={rep}
                                            topic={props.topic}
                                            setShowInfoForRep={
                                                props.setShowInfoForRep
                                            }
                                            toggleMonologueModal={
                                                toggleMonologueModal
                                            }
                                            meetings={rep.meetings}
                                            nextUrl={rep.nextUrl}
                                            index={index}
                                            isSample={props.isSample}
                                        />
                                    );
                                })}
                        </div>
                    </>
                )}
            </Skeleton>
            <Modal
                visible={isExpended}
                title={props.topic.name}
                className="topic-card"
                onOk={() => setIsExpended((prev) => !prev)}
                onCancel={() => setIsExpended((prev) => !prev)}
                footer={""}
            >
                <Skeleton loading={props.fetchingData} active>
                    {isEmpty(repSortedData) ? (
                        <NoData description={"No Data found"} />
                    ) : (
                        <>
                            <RepListHeader />
                            <div className="reps-data">
                                {repSortedData.map((rep) => (
                                    <RepListItem
                                        key={uid() + rep.repId}
                                        rep={rep}
                                        topic={props.topic}
                                        setShowInfoForRep={
                                            props.setShowInfoForRep
                                        }
                                        toggleMonologueModal={
                                            toggleMonologueModal
                                        }
                                        onCancel={() =>
                                            setIsExpended((prev) => !prev)
                                        }
                                        isSample={props.isSample}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </Skeleton>
            </Modal>
        </Card>
    );
}

function RepListItem({
    rep,
    topic,
    setShowInfoForRep,
    toggleMonologueModal,
    index,
    onCancel,
    isSample,
}) {
    return (
        <div className="rep row" onClick={() => setShowInfoForRep(rep.repId)}>
            <div className="col-10">
                <span className="capitalize">{rep.repName}</span>
                <Progress
                    percent={(rep.presence_per_call * 100).toFixed(2)}
                    size="small"
                    status="normal"
                    showInfo={false}
                    strokeColor={getRandomColors(topic.name)}
                />
            </div>
            <div className="col-2 text-center">
                <Tooltip
                    destroyTooltipOnHide
                    title={`Last 10 snippets for ${rep.repName} ${
                        isSample ? "(Not available for sample data)" : ""
                    }`}
                    placement={"top"}
                >
                    <Button
                        disabled={isSample}
                        className="margin0 text-center"
                        icon={<PlayCircleOutlined />}
                        type="link"
                        onClick={(evt) => {
                            onCancel();
                            toggleMonologueModal(
                                evt,
                                {
                                    repId: rep.repId,
                                    repName: rep.repName,
                                    meetings: rep.meetings,
                                    nextUrl: rep.nextUrl,
                                },
                                {
                                    id: topic.id,
                                    name: topic.name,
                                },
                                index
                            );
                        }}
                    />
                </Tooltip>
            </div>
            <div className="col-6 text-center">
                <span>{(rep.presence_per_call * 100).toFixed(2)}%</span>
            </div>
            <div className="col-6 text-center">
                <span>{rep.duration_avg.toFixed(2)}</span>
            </div>
        </div>
    );
}

function RepListHeader() {
    return (
        <div className="header row">
            <div className="col-10">
                <span className="strong paragraph">Rep Name</span>
            </div>
            <div className="col-2"></div>
            <div className="col-6 text-center">
                <span className="strong paragraph">% Calls</span>
            </div>
            <div className="col-6 text-center">
                <span className="strong paragraph">Avg Time (in sec)</span>
            </div>
        </div>
    );
}

RepListItem.defaultProps = {
    onCancel: () => {},
};
