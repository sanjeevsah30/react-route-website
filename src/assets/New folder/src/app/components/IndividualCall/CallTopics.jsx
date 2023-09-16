import { Badge, Collapse } from "antd";
import React from "react";
import CallSentenceCards from "./CallSentenceCards";
import Processing from "./Processing";
import NoTopicsSvg from "app/static/svg/NoTopicsSvg";
const { Panel } = Collapse;
export default function CallTopics({
    topics,
    activeTopic,
    isProcessing,
    seekToPoint,
    setActiveTopic,
}) {
    return (
        <>
            {isProcessing ? (
                <div className="height100p flex alignCenter justifyCenter">
                    <Processing />
                </div>
            ) : (
                <div className="individualcall-topics-container">
                    {Object.keys(topics)?.length ? (
                        <Collapse
                            ghost
                            expandIconPosition={"right"}
                            activeKey={activeTopic}
                            onChange={(e) => setActiveTopic(e)}
                        >
                            {Object.keys(topics)?.map((topic) => (
                                <Panel
                                    key={topic}
                                    header={
                                        <p className="topicPanel__header font16 bold600 mine_shaft_cl">
                                            <span>{topic}</span>
                                            <Badge
                                                count={
                                                    topics?.[topic]?.allData
                                                        ?.length
                                                }
                                                style={{
                                                    backgroundColor: `${topics?.[topic]?.color}1A`,
                                                    fontWeight: 600,
                                                    color: topics?.[topic]
                                                        ?.color,
                                                    borderRadius: "6px",
                                                    marginLeft: "4px",
                                                    height: "40px",
                                                    width: "40px",
                                                    fontSize: "16px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            />
                                        </p>
                                    }
                                    // style={{
                                    //     borderLeft: `5px solid ${topics?.[topic]?.color}`,
                                    // }}
                                >
                                    <CallSentenceCards
                                        items={topics[topic].data}
                                        seekToPoint={seekToPoint}
                                        isProcessing={false}
                                        showLabel={false}
                                        showCount
                                        topic={topic}
                                        isTopicType
                                        NotFoundIcon={NoTopicsSvg}
                                        notFoundText={" No Topics Found"}
                                    />
                                </Panel>
                            ))}
                        </Collapse>
                    ) : (
                        <div className="height100p flex column alignCenter justifyCenter">
                            <NoTopicsSvg />
                            <div className="bold700 font18 marginTB20">
                                No Topics Found
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
