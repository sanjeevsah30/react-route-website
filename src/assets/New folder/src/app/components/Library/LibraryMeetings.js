import { Icon, Spinner } from "@presentational/reusables/index";
import { BackTop, Button, Result } from "antd";
import React, { useEffect, useState } from "react";
import LibraryMeeting from "./LibraryMeeting";
import { ArrowLeftOutlined } from "@ant-design/icons";
import routes from "@constants/Routes/index";
import { Link } from "react-router-dom";
import { uid } from "@tools/helpers";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";

export default function LibraryMeetings({
    loading,
    meetings,
    callHandlers,
    handlePlayVideo,
    categories,
    selectedFolder,
}) {
    const [activeFolderName, setActiveFolderName] = useState("");
    useEffect(() => {
        if (!!selectedFolder && categories.length) {
            const folder = categories.filter(
                (category) => category.id === +selectedFolder
            );
            setActiveFolderName(folder.length ? folder[0].name : "");
        }
    }, [selectedFolder, categories]);
    return (
        <Spinner active loading={loading}>
            <div className="library-active">
                <Link to={routes.LIBRARY}>
                    <LeftArrowSvg />
                </Link>
                <h3>{activeFolderName}</h3>
            </div>
            <div
                id="callsCompletedContainer"
                className={`library-meeting-container ${
                    meetings.length ? "" : "no-meetings"
                }`}
            >
                {!!meetings.length &&
                    meetings.map((meeting, index) => (
                        <LibraryMeeting
                            key={uid() + meeting.id}
                            {...meeting}
                            {...callHandlers}
                            handlePlayVideo={handlePlayVideo}
                        />
                    ))}
            </div>
            {!loading && !meetings.length && (
                <Result
                    status="404"
                    title="Oh ho!"
                    subTitle="Sorry, No snippets found in this category."
                    extra={
                        <Link to={routes.LIBRARY}>
                            {" "}
                            <Button
                                type="primary"
                                shape={"round"}
                                icon={<ArrowLeftOutlined />}
                            >
                                Go Back
                            </Button>
                        </Link>
                    }
                />
            )}
        </Spinner>
    );
}
