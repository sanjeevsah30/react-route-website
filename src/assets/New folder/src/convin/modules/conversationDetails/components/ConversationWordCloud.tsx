import { Box, Typography } from "@mui/material";
import "../style.scss";
import IndividualCallConfig from "app/constants/IndividualCall";
import React, { useContext, useLayoutEffect, useState } from "react";
import { CallContext } from "../../../../app/components/IndividualCall/IndividualCall";
import WordCloud from "../../../../app/components/IndividualCall/WordCloud";

type WordObj = {
    tag: string;
    weight: number;
};

type WordCloud = Record<
    string,
    {
        frequency: number;
        start_time: number;
    }
>;

const ConversationWordCloud: React.FC<{ word_cloud: WordCloud }> = ({
    word_cloud,
}): JSX.Element => {
    const [viewMore, setViewMore] = useState<boolean>(false);
    const [worldCloudVisible, setWorldCloudVisible] = useState(false);
    const wordCloudList: WordObj[] = [];
    const max_count = 40;
    const [keys, setKeys] = useState<string[]>();

    useLayoutEffect(() => {
        setKeys(Object.keys(word_cloud));
    }, []);

    Object.keys(word_cloud).forEach((key) => {
        wordCloudList.push({
            tag: key,
            weight: word_cloud[key]?.frequency,
        });
    });

    const {
        setSearchKeyword,
        setActiveLeftTab,
        transcriptRef,
        searchKeyword,
        seekToPoint,
    } = useContext(CallContext);

    const handleSearch = (key: string, time: any) => {
        setSearchKeyword(key);
        seekToPoint(time);
        setActiveLeftTab(IndividualCallConfig.LEFT_TABS.transcript.value);
        transcriptRef.current &&
            transcriptRef.current.filterTranscriptsExp(key);
    };
    return (
        <Box sx={{ p: 2.5, height: "100%", overflowY: "scroll" }}>
            <Box className="flex justify-between" sx={{ mr: 2 }}>
                <Typography className="font-semibold">Word Cloud</Typography>
                <Typography
                    className="cursor-pointer"
                    component="span"
                    onClick={() => {
                        setWorldCloudVisible(true);
                    }}
                    variant="textXsBold"
                    sx={{ color: "primary.main" }}
                >
                    View Cloud
                </Typography>
            </Box>
            <Box className="word__cloud__container" sx={{ py: 3 }}>
                {!viewMore &&
                    keys
                        ?.map((key) => {
                            return (
                                <Box
                                    className={`${
                                        key === searchKeyword ? "active" : ""
                                    }  word_container`}
                                    key={key}
                                    onClick={() =>
                                        handleSearch(
                                            key,
                                            word_cloud[key]?.start_time
                                        )
                                    }
                                >
                                    <Typography
                                        className="word"
                                        component="span"
                                    >
                                        {key} |{" "}
                                    </Typography>{" "}
                                    <Typography
                                        className="count"
                                        component="span"
                                    >
                                        {word_cloud[key]?.frequency}
                                    </Typography>
                                </Box>
                            );
                        })
                        .sort((item1, item2) => {
                            if (
                                item1.props.children[2].props.children >
                                item2.props.children[2].props.children
                            )
                                return -1;
                            if (
                                item1.props.children[2].props.children <
                                item2.props.children[2].props.children
                            )
                                return 1;
                            else return 0;
                        })
                        .slice(0, 40)}

                {viewMore &&
                    keys
                        ?.map((key) => {
                            return (
                                <Box
                                    className={`${
                                        key === searchKeyword ? "active" : ""
                                    }  word_container`}
                                    key={key}
                                    onClick={() => {
                                        handleSearch(
                                            key,
                                            word_cloud[key]?.start_time
                                        );
                                    }}
                                >
                                    <Typography
                                        className="word"
                                        component="span"
                                    >
                                        {key} |{" "}
                                    </Typography>{" "}
                                    <Typography
                                        className="count"
                                        component="span"
                                    >
                                        {word_cloud[key]?.frequency}
                                    </Typography>
                                </Box>
                            );
                        })
                        .sort((item1, item2) => {
                            if (
                                item1.props.children[2].props.children >
                                item2.props.children[2].props.children
                            )
                                return -1;
                            if (
                                item1.props.children[2].props.children <
                                item2.props.children[2].props.children
                            )
                                return 1;
                            else return 0;
                        })}

                {keys !== undefined && keys?.length > max_count && (
                    <Box
                        className="word_container view_more"
                        onClick={() => setViewMore((prev) => !prev)}
                    >
                        {viewMore ? "Show Less" : "View More+"}
                    </Box>
                )}
            </Box>
            {worldCloudVisible && (
                <WordCloud
                    data={wordCloudList}
                    setWorldCloudVisible={setWorldCloudVisible}
                />
            )}
        </Box>
    );
};

export default ConversationWordCloud;
