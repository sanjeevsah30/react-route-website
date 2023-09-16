import { Collapse } from "antd";
import MinusSvg from "app/static/svg/MinusSvg";
import NoDataSvg from "app/static/svg/NoDataSvg";
import PlusSvg from "app/static/svg/PlusSvg";

const { Panel } = Collapse;

export const CallNotes = ({ notes }) => {
    return (
        <>
            {notes &&
            !!Object.keys(notes).length &&
            notes?.analysis &&
            !!Object.keys(notes?.analysis)?.length ? (
                <>
                    {!!notes?.analysis?.what_went_wrong &&
                        !!notes?.analysis?.what_went_wrong?.length && (
                            <Collapse
                                expandIconPosition="right"
                                className="margin20"
                                expandIcon={({ isActive }) =>
                                    isActive ? (
                                        <MinusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    ) : (
                                        <PlusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    )
                                }
                                style={{
                                    background: "rgba(26, 98, 242, 0.05)",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(26, 98, 242, 0.2)",
                                }}
                            >
                                <Panel
                                    header={
                                        <>
                                            <span className="font16 bold600 primary paddingL5 ">
                                                What went wrong?
                                            </span>
                                        </>
                                    }
                                    key="1"
                                >
                                    <p className="dove_gray_cl">
                                        Below are the things that went wrong in
                                        the call
                                    </p>
                                    <ol
                                        style={{
                                            listStyleType: "decimal",
                                        }}
                                        className="marginL14"
                                    >
                                        {notes?.analysis?.what_went_wrong?.map(
                                            (item) => (
                                                <li className="bold400">
                                                    <span>{item}</span>
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </Panel>
                            </Collapse>
                        )}
                    {!!notes?.analysis?.what_went_right &&
                        !!notes?.analysis?.what_went_right?.length && (
                            <Collapse
                                expandIconPosition="right"
                                // defaultActiveKey={['1']}
                                className="margin20"
                                expandIcon={({ isActive }) =>
                                    isActive ? (
                                        <MinusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    ) : (
                                        <PlusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    )
                                }
                                style={{
                                    background: "rgba(26, 98, 242, 0.05)",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(26, 98, 242, 0.2)",
                                }}
                            >
                                <Panel
                                    header={
                                        <>
                                            <span className="font16 bold600 primary paddingL5 ">
                                                What went right?
                                            </span>
                                        </>
                                    }
                                    key="1"
                                >
                                    <p className="dove_gray_cl">
                                        Below are the things that went right in
                                        the call
                                    </p>
                                    <ol
                                        style={{
                                            listStyleType: "decimal",
                                        }}
                                        className="marginL14"
                                    >
                                        {notes?.analysis?.what_went_right?.map(
                                            (item) => (
                                                <li className="bold400">
                                                    <span>{item}</span>
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </Panel>
                            </Collapse>
                        )}
                    {!!notes?.analysis?.what_better_can_be_done &&
                        !!notes?.analysis?.what_better_can_be_done?.length && (
                            <Collapse
                                expandIconPosition="right"
                                className="margin20"
                                expandIcon={({ isActive }) =>
                                    isActive ? (
                                        <MinusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    ) : (
                                        <PlusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    )
                                }
                                style={{
                                    background: "rgba(26, 98, 242, 0.05)",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(26, 98, 242, 0.2)",
                                }}
                            >
                                <Panel
                                    header={
                                        <>
                                            <span className="font16 bold600 primary paddingL5">
                                                What agent can do better?
                                            </span>
                                        </>
                                    }
                                    key="1"
                                >
                                    <p className="dove_gray_cl">
                                        Below are the things that can be
                                        improved by agent
                                    </p>
                                    <ol
                                        style={{
                                            listStyleType: "decimal",
                                        }}
                                        className="marginL14"
                                    >
                                        {notes?.analysis?.what_better_can_be_done?.map(
                                            (item) => (
                                                <li className="bold400">
                                                    <span>{item}</span>
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </Panel>
                            </Collapse>
                        )}
                    {!!notes?.analysis?.next_steps &&
                        !!notes?.analysis?.next_steps?.length && (
                            <Collapse
                                expandIconPosition="right"
                                className="margin20"
                                expandIcon={({ isActive }) =>
                                    isActive ? (
                                        <MinusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    ) : (
                                        <PlusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    )
                                }
                                style={{
                                    background: "rgba(26, 98, 242, 0.05)",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(26, 98, 242, 0.2)",
                                }}
                            >
                                <Panel
                                    header={
                                        <>
                                            <span className="font16 bold600 primary paddingL5 ">
                                                Next Steps
                                            </span>
                                        </>
                                    }
                                    key="1"
                                >
                                    <p className="dove_gray_cl">
                                        Below are the best next steps to be
                                        followed
                                    </p>
                                    <ol
                                        style={{
                                            listStyleType: "decimal",
                                        }}
                                        className="marginL14"
                                    >
                                        {notes?.analysis?.next_steps?.map(
                                            (item) => (
                                                <li className="bold400">
                                                    <span>{item}</span>
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </Panel>
                            </Collapse>
                        )}
                </>
            ) : (
                <div className="flex column alignCenter justifyCenter height100p">
                    <NoDataSvg />
                    <div className="bold600">No Data</div>
                </div>
            )}
        </>
    );
};

export default CallNotes;
