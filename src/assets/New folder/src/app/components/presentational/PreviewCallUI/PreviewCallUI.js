import React, { useState } from "react";
import { Layout, Typography, Button, Row, Col, Card } from "antd";
import { Logo } from "@presentational/reusables";
import { Label } from "@presentational/reusables";
import { isEmpty } from "lodash";
import MeetingDetails from "./subcomponents/MeetingDetails";
import MeetingTranscript from "./subcomponents/MeetingTranscript";
import MeetingHeatMap from "./subcomponents/MeetingHeatMap";
import ShakaPlayer from "../../ShakaPlayer/ShakaPlayer";
import Tabs from "./subcomponents/Tabs";
import NoData from "@presentational/reusables/NoData";
import { useEffect } from "react";
import { useCallback } from "react";
import useDebounce from "hooks/useDebounce";
import { useRef } from "react";
import Summary from "../../IndividualCall/Summary";

const { Header, Content, Footer } = Layout;
const TAB_KEYS = {
    details: "details",
    overview: "overview",
    transcript: "transcript",
    summary: "summary",
};
const TABS = [
    {
        key: TAB_KEYS.details,
        label: "Details",
    },
    {
        key: TAB_KEYS.overview,
        label: "Overview",
    },
    {
        key: TAB_KEYS.transcript,
        label: "Transcript",
    },
    {
        key: TAB_KEYS.summary,
        label: "Summary",
    },
];
export default function PreviewCallUI({
    playedDuration,
    playerHandlers,
    meeting,
    previewRef,
    mediaUri,
    mediaStartTime,
}) {
    const renderedTranscript = useRef([]);
    const [keyword, setKeyword] = useState("");
    const [activeTab, setActiveTab] = useState(TAB_KEYS.overview);
    const [filteredTranscript, setFilteredTranscript] = useState([]);
    const debouncedKeyword = useDebounce(keyword, 500);
    const findInTranscript = (evt) => {
        activeTab !== TAB_KEYS.transcript && setActiveTab(TAB_KEYS.transcript);
        let value = evt.target.value
            ?.replace(/[^a-zA-Z0-9 ]/g, "")
            ?.toLowerCase();
        setKeyword(value);
    };
    const handleActiveTab = (tab) => {
        setActiveTab(tab.key);
    };
    useEffect(() => {
        if (meeting?.transcript_json?.length) {
            getClubbedTranscripts(meeting.transcript_json);
        }
    }, [meeting?.transcript_json]);

    const getClubbedTranscripts = useCallback((transcripts) => {
        /** club repeated speaker type */
        let prevTranscript = null;
        let clubbedTranscripts = [];
        if (transcripts && transcripts.length) {
            for (let i = 0; i <= transcripts.length; i++) {
                if (prevTranscript) {
                    if (
                        transcripts[i] &&
                        prevTranscript.speaker_name ===
                            transcripts[i].speaker_name &&
                        ((isEmpty(prevTranscript.topics) &&
                            isEmpty(transcripts[i].topics)) ||
                            Object.keys(prevTranscript.topics)[0] ===
                                Object.keys(transcripts[i].topics)[0])
                    ) {
                        prevTranscript.monologue_text += ` ${transcripts[i].monologue_text}`;
                    } else {
                        clubbedTranscripts.push(prevTranscript);
                        prevTranscript = { ...transcripts[i] };
                    }
                    if (prevTranscript.indexes) {
                        prevTranscript.indexes.push(i);
                    } else {
                        prevTranscript.indexes = [i];
                    }
                } else {
                    prevTranscript = { ...transcripts[i] };
                    if (prevTranscript.indexes) {
                        prevTranscript.indexes.push(i);
                    } else {
                        prevTranscript.indexes = [i];
                    }
                }
            }
        }
        renderedTranscript.current = clubbedTranscripts;
        setFilteredTranscript(clubbedTranscripts);
    }, []);

    useEffect(() => {
        if (debouncedKeyword) {
            setFilteredTranscript(
                renderedTranscript.current.filter((text) =>
                    text?.monologue_text?.toLowerCase()?.includes(keyword)
                )
            );
        } else {
            setFilteredTranscript(renderedTranscript.current);
        }
    }, [debouncedKeyword]);

    return (
        <Layout className={"preview"}>
            <Header className={"preview_header"}>
                <a
                    href="https://convin.ai"
                    className="user-auth-bottom-nav-link"
                >
                    <Logo logoWhite={true} />
                </a>
                <Button type="primary">
                    <a
                        href={"https://convin.ai/#freedemo"}
                        target={"_blank"}
                        rel="noopener noreferrer"
                    >
                        Try for free
                    </a>
                </Button>
            </Header>
            <Content className={"preview_content"}>
                <Card className={"preview_row"} bordered={false}>
                    <Row>
                        <Col span={24}>
                            <ShakaPlayer
                                videoRef={previewRef}
                                onProgress={playerHandlers.onProgress}
                                uri={mediaUri}
                                // startTime={+start_time}
                                customClass="preview_player"
                                playOnLoad={true}
                            />
                        </Col>
                        <Col span={24}>
                            <Tabs
                                tabs={
                                    meeting.meeting_json.meeting_summary &&
                                    !!Object.keys(
                                        meeting.meeting_json.meeting_summary
                                    ).length
                                        ? TABS
                                        : TABS.filter(
                                              (item) =>
                                                  item.key !== TAB_KEYS.summary
                                          )
                                }
                                handleActiveTab={handleActiveTab}
                                activeTab={activeTab}
                                findInTranscript={findInTranscript}
                            />
                        </Col>
                        {activeTab === TAB_KEYS.details && (
                            <Col span={24}>
                                <MeetingDetails
                                    meeting_json={meeting.meeting_json}
                                    mStartTime={meeting.start_time}
                                    mEndTime={meeting.end_time}
                                ></MeetingDetails>
                                <Row className={"preview_right_comment"}>
                                    <Label label="Comment" />
                                    <div
                                        className={"preview_right_comment_text"}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                meeting.comment ||
                                                meeting.meeting_json.agenda,
                                        }}
                                    ></div>
                                </Row>
                            </Col>
                        )}
                        {activeTab === TAB_KEYS.transcript && (
                            <Col span={24}>
                                {meeting.share_with_transcript && (
                                    <MeetingTranscript
                                        transcript_json={filteredTranscript}
                                        keyword={debouncedKeyword}
                                        findInTranscript={findInTranscript}
                                        seekNplay={playerHandlers.seekToPoint}
                                        playedSeconds={playedDuration}
                                        playerRef={previewRef}
                                    />
                                )}
                            </Col>
                        )}
                        {activeTab === TAB_KEYS.overview && (
                            <Col span={24}>
                                {!!meeting.transcript_json.length ? (
                                    <MeetingHeatMap
                                        seekNplay={playerHandlers.seekToPoint}
                                        playedSeconds={playedDuration}
                                        meeting={meeting.meeting_json}
                                        transcript={meeting.transcript_json}
                                        mStartTime={meeting.start_time}
                                        mEndTime={meeting.end_time}
                                    />
                                ) : (
                                    <NoData
                                        description={"Data not available"}
                                    />
                                )}
                            </Col>
                        )}
                        {activeTab === TAB_KEYS.summary && (
                            <Col span={24}>
                                {meeting.meeting_json.meeting_summary ? (
                                    <Summary
                                        meeting_summary={
                                            meeting.meeting_json.meeting_summary
                                        }
                                    />
                                ) : (
                                    <NoData
                                        description={"Data not available"}
                                    />
                                )}
                            </Col>
                        )}
                    </Row>
                </Card>
            </Content>
            <Footer className={"preview_footer"}>
                Convin ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    );
}
