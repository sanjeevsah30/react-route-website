import { checkFileType, getDateTime, getDMYDate } from "@tools/helpers";
import { useDispatch } from "react-redux";
import React from "react";
import {
    AudioSvg,
    DeleteSvg,
    DocSvg,
    MediaSvg,
    PlaySvg,
} from "app/static/svg/indexSvg";
import "./fileCard.style.scss";

function FileCard({ media, deleteUploads, getMediaHandler }) {
    const dispatch = useDispatch();
    const type = checkFileType(media.file_type);
    return (
        <div
            className="fileCard_container flex alignCenter justifySpaceBetween curPoint"
            onClick={(e) => {
                e.stopPropagation();
                getMediaHandler(media?.id, true);
            }}
            key={media?.id}
        >
            <div className="fileCard_content flex alignCenter">
                <span className="fileCard_icon">
                    {type === "audio" ? (
                        <AudioSvg />
                    ) : type === "video" ? (
                        <MediaSvg />
                    ) : type === "document" ? (
                        <DocSvg />
                    ) : (
                        <DocSvg />
                    )}
                </span>
                <div className="marginL24 min_width_0_flex_child">
                    <span className="fileCard_title font16 bold600 elipse_text mine_shaft_cl">
                        {media?.file_name}
                    </span>
                    <div className="fileCard_info dove_gray_cl bold400 font14">
                        <span className="dusty_gray_cl">Uploaded by</span>
                        <span className="marginL5">
                            {media?.owner?.first_name}
                        </span>
                        <span>{" | "}</span>
                        <span className="">
                            {getDateTime(
                                media?.updated,
                                "data",
                                " ",
                                "MMM dd, yyyy"
                            )}
                        </span>
                    </div>
                </div>
            </div>
            <div className="controls_btn">
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        dispatch(deleteUploads(media?.id));
                    }}
                >
                    <DeleteSvg
                        style={{ color: "#666", transform: "scale(1.35)" }}
                        height="24"
                        width="24"
                        className="delete_btn curPoint"
                    />
                </span>
                {/* <PlaySvg outline="#666666" className="play_btn curPoint marginL10" /> */}
            </div>
        </div>
    );
}

export default FileCard;
