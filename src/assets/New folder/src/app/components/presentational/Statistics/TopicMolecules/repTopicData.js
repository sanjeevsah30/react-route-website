import React from "react";
import { Modal } from "antd";
import { orderBy } from "lodash";
import { useSelector } from "react-redux";
import { uid } from "@tools/helpers";
export default function RepTopicData(props) {
    const topicData = useSelector((state) => state.stats.topicDuration);
    const topics = useSelector((state) => state.common.topics);

    const getData = () => {
        return topics.map((topic) => {
            let repInfo = getTopicRep(topic);
            return {
                topicId: topic.id,
                topicName: topic.name,
                duration_avg: topicData[topic.id] ? repInfo.duration_avg : 0,
                presence_per_call: topicData[topic.id]
                    ? repInfo.presence_per_call
                    : 0,
            };
        });
    };

    const getTopicRep = (topic) => {
        let rep = topicData[topic.id]
            ? topicData[topic.id].find(
                  (details) => +details.speaker_id === +props.showInfoForRep
              )
            : null;
        return rep
            ? rep
            : {
                  duration_avg: 0,
                  presence_per_call: 0,
              };
    };

    return (
        <Modal
            className="topic-card"
            visible={+props.showInfoForRep}
            title={`Topic wise data for ${
                props.rep ? Object.values(props.rep)[0] : ""
            }`}
            onOk={() => props.setShowInfoForRep("")}
            onCancel={() => props.setShowInfoForRep("")}
            footer={""}
            width={420}
        >
            <RepListHeader />
            <div className="reps-data">
                {orderBy(getData(), "presence_per_call", "desc").map((data) => (
                    <RepListItem key={uid() + data.topicId} data={data} />
                ))}
            </div>
        </Modal>
    );
}

function RepListItem({ data }) {
    return (
        <div className="rep row" key={data.topicId}>
            <div className="col-10">
                <span>{data.topicName}</span>
            </div>
            <div className="col-6 text-center">
                <span>{(data.presence_per_call * 100).toFixed(2)}%</span>
            </div>
            <div className="col-8 text-center">
                <span>{data.duration_avg.toFixed(2)}</span>
            </div>
        </div>
    );
}

function RepListHeader() {
    return (
        <div className="header row">
            <div className="col-10">
                <span className="strong paragraph">Topic Name</span>
            </div>
            <div className="col-6 text-center">
                <span className="strong paragraph">% Calls</span>
            </div>
            <div className="col-8 text-center">
                <span className="strong paragraph">Avg Time (in sec)</span>
            </div>
        </div>
    );
}
