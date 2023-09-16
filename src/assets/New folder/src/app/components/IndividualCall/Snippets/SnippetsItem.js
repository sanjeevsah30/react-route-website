import React, { useEffect, useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import {
    Alert,
    Avatar,
    Button,
    Input,
    Popconfirm,
    Popover,
    Select,
    Tooltip,
} from "antd";
import {
    getDateTime,
    getDisplayName,
    getDuration,
    secondsToTime,
} from "@tools/helpers";
import ScissorsRoundedSvg from "app/static/svg/ScissorsRoundedSvg";
import LinkSvg from "app/static/svg/LinkSvg";
import ShareSvg from "app/static/svg/ShareSvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import Spinner from "@presentational/reusables/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteCallSnippet,
    getSnippetShareLink,
    getSnippetToUpdate,
    setSnippetToUpdate,
} from "@store/individualcall/actions";
import { getAllUsers } from "@store/common/actions";
import commonConfig from "@constants/common/index";

export default function SnippetsItem({
    data,
    style,
    measureRef,
    setShowUpdateShareModal,
    seekToPoint,
}) {
    const dispatch = useDispatch();
    const { start_time, end_time, comment, title, owner, url, id } = data;
    const [showUrl, setShowUrl] = useState(false);
    const user = useSelector((state) => state.auth);
    const PublicLink = () => {
        return (
            <div className="flex alignCenter">
                <Input value={url} className="flex1" />
                <Button
                    key="submit"
                    className={"sharer__copy"}
                    type="primary"
                    onClick={() => {
                        navigator.clipboard.writeText(url, 100);
                        setShowUrl((prev) => !prev);
                    }}
                    shape={"default"}
                >
                    Copy Link
                </Button>
            </div>
        );
    };

    return (
        <li
            id={`callSnippets__itemWrapper${data.id}`}
            className="callSnippets__itemWrapper"
            style={style}
            ref={measureRef}
        >
            <div className="callSnippets__item">
                <div className="callSnippets__itemLeft">
                    <div className="callSnippets__itemLeft--top">
                        <Tooltip title="Play">
                            <Button
                                className="playButton"
                                icon={<CaretRightOutlined />}
                                type="primary"
                                shape="circle"
                                onClick={() => {
                                    seekToPoint(start_time);
                                }}
                            />
                        </Tooltip>
                        <div className="marginL12 flex1">
                            <p className="font14 bold600 mine_shaft_cl margin0 lineHightN">
                                {title}
                            </p>
                            <div className="flex alignCenter spaceBetween">
                                <p className="flex flex1 margin0 lineHightN">
                                    <span className="dusty_gray_cl font12 lineHightN marginR8">
                                        {getDateTime(data.updated, "date")}
                                    </span>
                                    <span className="callSnippets__itemLeft--duration">
                                        <ScissorsRoundedSvg />
                                        <span className="marginL4">
                                            {secondsToTime(
                                                end_time - start_time
                                            )}
                                        </span>
                                    </span>
                                </p>
                                <div className="flex alignCenter">
                                    <Avatar size={26} className="card__avatar">
                                        {getDisplayName({ ...owner }).slice(
                                            0,
                                            1
                                        )}
                                    </Avatar>
                                    <span className="font12 mine_shaft_cl lineHightN">
                                        {getDisplayName({ ...owner })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="callSnippets__itemLeft--bottom">
                        <p className="font14 dusty_gray_cl bold600 margin0">
                            {comment || "No Comment"}
                        </p>
                    </div>
                </div>
                <div className="callSnippets__itemRight">
                    <Popover
                        className="callSnippets__item--popover"
                        placement="bottomRight"
                        content={<PublicLink />}
                        trigger="click"
                        visible={showUrl}
                        onVisibleChange={() => setShowUrl((prev) => !prev)}
                    >
                        <Tooltip title="Copy">
                            <Button
                                type="text"
                                id={`callSnippets__itemRight--ink${data.id}`}
                                icon={<LinkSvg />}
                            />
                        </Tooltip>
                    </Popover>
                    {/* <Popover
                        className="callSnippets__item--popover"
                        placement="bottomRight"
                        content={<ShareEmail id={data.id} />}
                        trigger="click"
                        getPopupContainer={() => {
                            return document.getElementById(
                                `callSnippets__itemRight--share${data.id}`
                            );
                        }}
                    >
                        <Button
                            type="text"
                            id={`callSnippets__itemRight--share${data.id}`}
                            icon={<ShareSvg />}
                        />
                    </Popover> */}
                    {user.id === owner.id ||
                    user.designation === commonConfig.ADMIN ? (
                        <>
                            <Tooltip title="Share">
                                <Button
                                    type="text"
                                    id={`callSnippets__itemRight--share${data.id}`}
                                    icon={<ShareSvg />}
                                    onClick={() => {
                                        setShowUpdateShareModal(true);
                                        dispatch(getSnippetToUpdate(id));
                                    }}
                                />
                            </Tooltip>
                            <Popconfirm
                                title="Are you sure to delete this snippet?"
                                onConfirm={(e) => {
                                    e.stopPropagation();
                                    dispatch(deleteCallSnippet(id));
                                }}
                                onCancel={(e) => e.stopPropagation()}
                                okText="Yes"
                                cancelText="No"
                            >
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="curPoint"
                                >
                                    <DeleteSvg />
                                </span>
                            </Popconfirm>
                        </>
                    ) : (
                        <></>
                    )}

                    {/* <Button
                        type="text"
                        id={`callSnippets__itemRight--id${data.id}`}
                        icon={<DeleteSvg />}
                    /> */}
                </div>
            </div>
        </li>
    );
}

const ShareEmail = ({ id }) => {
    const dispatch = useDispatch();

    const users = useSelector((state) => state.common.users);
    const [shareViaMails, setShareViaMails] = useState({
        emails: [],
        error: false,
    });
    useEffect(() => {
        if (!users.length) {
            dispatch(getAllUsers());
        }
    }, []);
    const handleEmails = (email) => {
        if (validateEmail(email)) {
            setShareViaMails((prev) => ({
                ...prev,
                emails: [...prev.emails, email],
            }));
        } else {
            setShareViaMails((prev) => ({
                ...prev,
                error: true,
            }));
            setTimeout(() => {
                setShareViaMails((prev) => ({
                    ...prev,
                    error: false,
                }));
            }, 2000);
        }
    };

    const removeEmails = (email) => {
        let updatedMails = [...shareViaMails.emails];
        let mailToRemove = updatedMails.findIndex((mail) => mail === email);
        updatedMails.splice(mailToRemove, 1);
        setShareViaMails((prev) => ({
            ...prev,
            emails: updatedMails,
        }));
    };

    const validateEmail = (email) => {
        var re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    return (
        <>
            <div
                className="sharer__inputWrapper"
                id={`sharer__inputWrapper${id}`}
            >
                <Select
                    mode="tags"
                    placeholder="Enter email and press enter"
                    onSelect={handleEmails}
                    onDeselect={removeEmails}
                    value={shareViaMails.emails}
                    maxTagCount="responsive"
                    getPopupContainer={() =>
                        document.querySelector(
                            `#sharer__inputWrapper${id} .ant-select`
                        )
                    }
                >
                    {users.map((user) => (
                        <Select.Option key={user.email}>
                            {user?.first_name || user?.email}
                        </Select.Option>
                    ))}
                </Select>
                <Button
                    key="submit"
                    className={"sharer__submit"}
                    type="primary"
                    onClick={() => {
                        // submitForm(false);
                    }}
                    shape={"default"}
                >
                    Share
                </Button>
            </div>
            {shareViaMails.error && (
                <Alert
                    message="Please enter a valid email id"
                    type="error"
                    showIcon
                    closable
                />
            )}
        </>
    );
};
