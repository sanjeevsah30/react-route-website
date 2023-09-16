import React, { useState } from "react";

import { Input, Alert, Modal, Select, Switch } from "antd";

// Svg Icons
import MailSvg from "app/static/svg/MailSvg";
import { TickSvg } from "app/static/svg/TickSvg";
import CircleInfoSvg from "app/static/svg/CircleInfoSvg";
import LinkSvg from "app/static/svg/LinkSvg";
import CloseSvg from "app/static/svg/CloseSvg";

const { TextArea } = Input;

function ShareModal({
    title = "",
    onCancel = () => {},
    onCloseBtn = () => {},
    onBlurTextArea = () => {},
    commentHeading = "",
    placeholderTextArea = "",
    alertMessage = "",
    valueTextArea = "",
    onChangeTextArea = () => {},
    mailError,
    showAlret,
    onSelectEmails = () => {},
    onDeselectEmails = () => {},
    valueSelectEmails = {},
    selectOptionEmailUser = [],
    onClickShare = () => {},
    isChecked,
    isSharing,
    onToggle,
    valueLinkInput,
    onClickCopyLink,
}) {
    const [showShare, setShowShare] = useState(false);

    return (
        <Modal
            centered
            visible={showShare}
            closable={false}
            onCancel={onCancel}
            // onCancel={() => {
            //     // setForm({
            //     //     ...form,
            //     //     publicUrl: '',
            //     //     comment: '',
            //     //     emails: [],
            //     //     isPublic: false
            //     // })
            //     setShowShare(false);
            //     // setIsChecked(false);
            //     // setisSharing(false);
            // }}
            footer={null}
            width="605px"
            className="model_container bold600"
        >
            <div
                className="font16 flex paddingTB25 paddingLR25 marginB24 alignCenter justifySpaceBetween width100p"
                style={{
                    borderBottom: "1px solid rgba(153, 153, 153, 0.2)",
                }}
            >
                <span>
                    <MailSvg />{" "}
                    <span className="marginL11">{title} via Email</span>
                </span>
                <span
                    className="close_btn"
                    onClick={onCloseBtn}
                    // onClick={() => {
                    //     setForm({
                    //         ...form,
                    //         publicUrl: '',
                    //         comment: '',
                    //         emails: [],
                    //         isPublic: false
                    //     })
                    //     setShowShare(false);
                    //     setIsChecked(false);
                    // }}
                >
                    <CloseSvg />
                </span>
            </div>
            <div className="shareLink_card_container paddingLR25">
                <div className="font14 marginB12">{commentHeading}</div>
                <div className="marginB24 width100p">
                    <TextArea
                        className="flex comment_input"
                        rows={2}
                        placeholder={placeholderTextArea}
                        onBlur={onBlurTextArea}
                        value={valueTextArea}
                        onChange={onChangeTextArea}
                        // onBlur={({ target: { value } }) =>
                        //     setForm({ ...form, comment: value })
                        // }
                        // value={form.comment}
                        // onChange={({ target: { value } }) =>
                        //     setForm({ ...form, comment: value })
                        // }
                    />
                </div>
                <div className="font14 marginB12">Share to</div>
                {
                    // mailError
                    false && (
                        <Alert
                            message="Please enter a valid email id"
                            type="error"
                            showIcon
                            closable
                        />
                    )
                }
                <div
                    className="flex alignCenter justifySpaceBetween width100p paddingLR6 paddingTB4"
                    style={{
                        border: "1px solid rgba(153, 153, 153, 0.2)",
                        borderRadius: "5px",
                    }}
                >
                    <div className="select_container width100p">
                        <Select
                            mode="tags"
                            placeholder="Enter email and press enter"
                            onSelect={onSelectEmails}
                            onDeselect={onDeselectEmails}
                            value={valueSelectEmails}
                            className="email_container width100p"
                        >
                            {selectOptionEmailUser.map((user) => (
                                <Select.Option key={user.email}>
                                    {user?.first_name || user?.email}
                                </Select.Option>
                            ))}
                            {/* {users.map(
                                            (user) => (
                                            <Select.Option key={user.email}>
                                                {user?.first_name ||
                                                    user?.email}
                                            </Select.Option>
                                        )
                                        )
                                        } */}
                        </Select>
                    </div>
                    <button
                        className="link_btn paddingTB8 paddingLR25 goodblue_cl goodblue_bg"
                        // onClick={() => {
                        //     // submitForm(false)
                        // }}
                        onClick={onClickShare}
                    >
                        SHARE
                    </button>
                </div>
                <div className="flex marginT18 marginB50  bold400 font12">
                    <span>
                        <CircleInfoSvg />
                    </span>
                    <span className="marginL10">
                        A public Link will be shared with the listed Analytics
                        to the above mentioned email.
                    </span>
                </div>
            </div>

            <div
                className="flex alignCenter justifySpaceBetween paddingLR25 paddingB12 width100p"
                style={{ borderBottom: "1px solid rgba(153, 153, 153, 0.2)" }}
            >
                <div className="bold600 font18">
                    <LinkSvg />
                    <span className="marginL14">Create a Shareable Link</span>
                </div>
                <div>
                    <span className="bold600 font14 marginR17">
                        Generate public link
                    </span>
                    <span>
                        <Switch
                            checked={isChecked}
                            onChange={onToggle}
                            loading={isSharing}
                        />
                    </span>
                </div>
            </div>

            <div className="paddingLR25 paddingB24">
                <div
                    className="flex alignCenter justifySpaceBetween width100p paddingLR6 paddingTB4 marginT9"
                    style={{
                        border: "1px solid rgba(153, 153, 153, 0.2)",
                        borderRadius: "5px",
                    }}
                >
                    <input
                        type="text"
                        className="link_input bold400 font14"
                        // value={form.isPublic ? form.publicUrl : ''}
                        value={valueLinkInput}
                    />
                    <button
                        className="link_btn paddingTB8 paddingLR25 goodblue_cl goodblue_bg"
                        onClick={onClickCopyLink}
                        // onClick={() => {
                        //     if (form.isPublic) {
                        //         navigator.clipboard.writeText(
                        //             form.publicUrl,
                        //             100
                        //         );
                        //         setshowAlret(true);
                        //     }
                        // }}
                    >
                        Copy Link
                    </button>
                </div>
                <div className="flex marginT18 bold400 font12 width100p">
                    <span>
                        <CircleInfoSvg />
                    </span>
                    <span className="marginL10">
                        A public link will be generated and can be shared with
                        anyone.
                    </span>
                </div>
                {
                    // showAlret && form.publicUrl
                    false ? (
                        <div className="alert_container marginT24">
                            <Alert
                                message={
                                    <div className="flex alignCenter justifyCenter">
                                        <TickSvg
                                            style={{
                                                color: "#52C41A",
                                                marginRight: "8px",
                                            }}
                                        />
                                        <div className="goodcolor_cl">
                                            {alertMessage}
                                        </div>
                                    </div>
                                }
                                type="success"
                                className="share_message_close"
                            />
                        </div>
                    ) : (
                        <></>
                    )
                }
            </div>
        </Modal>
    );
}

export default ShareModal;
