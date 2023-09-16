import { NoData } from "@presentational/reusables/index";
import { getDateTime, getDMYDate } from "@tools/helpers";
import { Button, Card, Popconfirm, Tooltip, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { DeleteSvg, PlaySvg } from "app/static/svg/indexSvg";
import "./snippetCard.style.scss";

function SnippetCard(props) {
    const {
        snippet,
        handlePlayVideo,
        deleteSnippetHandler,
        getSnippetHandler,
    } = props;

    const { sample, meetings } = useSelector((state) => state.librarySlice);
    const { isSample } = sample;
    // const { loader } = meetings;
    // console.log(meetings.loader)
    return (
        <>
            {
                <Card className="snippet_container" onClick={() => {}}>
                    <div className="snippet_header dusty_gray_cl">
                        <span className="date_container">
                            {getDateTime(
                                snippet?.updated,
                                "date",
                                " ",
                                "MMM dd, yyyy"
                            )}
                        </span>
                        <span>{" | "}</span>
                        <span className="owner_name_title marginL5 bold600 mine_shaft_cl">
                            {snippet?.owner?.first_name}
                        </span>
                    </div>
                    <Typography.Paragraph
                        className="snippet_content"
                        ellipsis={{
                            rows: 2,
                            tooltip: true,
                            expandable: false,
                            suffix: "",
                        }}
                    >
                        {snippet?.note}
                    </Typography.Paragraph>
                    <div className="snippet_footer flex alignCenter justifySpaceBetween">
                        <div className="left_section">
                            <div className="snippet_button_container flex alignCenter">
                                <Popconfirm
                                    placement="bottomRight"
                                    title={"Are you sure to delete this call?"}
                                    onConfirm={() => {
                                        // console.log(snippet?.id)
                                        deleteSnippetHandler(snippet?.id);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Tooltip
                                        placement="topLeft"
                                        title={"View Original"}
                                    >
                                        <span
                                            className="flex alignCenter"
                                            style={{
                                                color: "#1a62f2",
                                                transform: "scale(1.5)",
                                            }}
                                        >
                                            <DeleteSvg />
                                        </span>
                                    </Tooltip>
                                </Popconfirm>
                                <Tooltip
                                    destroyTooltipOnHide
                                    placement="topLeft"
                                    title={"Play Snippet"}
                                >
                                    <PlaySvg
                                        className="marginL32"
                                        style={{
                                            transform: "scale(1.15)",
                                        }}
                                        onClick={
                                            () => {
                                                getSnippetHandler(
                                                    snippet?.id,
                                                    true
                                                );
                                            }
                                            // handlePlayVideo(
                                            //     {
                                            //         id: snippet?.meeting,
                                            //         start_time:
                                            //             snippet?.start_time,
                                            //         end_time: snippet?.end_time,
                                            //     },
                                            //     true
                                            // )
                                        }
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="right_section">
                            <Tooltip
                                placement="topLeft"
                                title={"View Original"}
                            >
                                <a
                                    href={
                                        isSample
                                            ? ""
                                            : `${window.location.origin}/call/${snippet?.meeting}`
                                    }
                                    target={"_target"}
                                >
                                    <Button className="view_call_btn">
                                        View call
                                    </Button>
                                </a>
                            </Tooltip>
                        </div>
                    </div>
                </Card>
            }
        </>
    );
}

export default SnippetCard;
