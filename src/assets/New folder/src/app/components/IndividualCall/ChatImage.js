import { Image, Tooltip, Button } from "antd";
import { getDateTime } from "../../../tools/helpers";
import { CommentOutlined } from "@ant-design/icons";

const ChatImage = ({ transcript, addComment }) => {
    const { urls, speaker_type, timestamp, monologue_text } = transcript;
    return urls?.length < 4 ? (
        urls.map((url) => (
            <div className={`${speaker_type}_chat`}>
                {addComment ? (
                    <div className="add_comment_container">
                        <Tooltip title="Add Comment">
                            <Button
                                icon={<CommentOutlined />}
                                type={"text"}
                                onClick={(e) => {
                                    addComment(e);
                                }}
                                className="comment_btn"
                            />
                        </Tooltip>
                    </div>
                ) : null}
                <div className="chat_img_container">
                    <Image
                        src={url}
                        fallback="https://via.placeholder.com/640x360"
                        preview={{ mask: null }}
                    />
                    <div className="chat_img_caption">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: monologue_text,
                            }}
                        />

                        <span className="chat_time">
                            {getDateTime(new Date(timestamp * 1000), "time")}
                        </span>
                    </div>
                </div>
            </div>
        ))
    ) : (
        <div className={`${speaker_type}_chat`}>
            <div className="chat_multiple_img_container">
                <Image.PreviewGroup>
                    {urls.slice(0, 4).map((url, idx) => {
                        return (
                            <Image
                                src={url}
                                fallback="https://via.placeholder.com/640x360"
                                preview={{
                                    mask:
                                        idx === 3 && urls.length > 4 ? (
                                            <div>+{urls.length - 4}</div>
                                        ) : null,
                                }}
                            />
                        );
                    })}
                    {urls.slice(4).map((url, idx) => {
                        return (
                            <div style={{ display: "none" }}>
                                <Image
                                    src={url}
                                    fallback="https://via.placeholder.com/640x360"
                                />
                            </div>
                        );
                    })}
                </Image.PreviewGroup>
            </div>
        </div>
    );
};

export default ChatImage;
