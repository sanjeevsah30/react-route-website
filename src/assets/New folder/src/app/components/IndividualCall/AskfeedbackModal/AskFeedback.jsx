import React, { useEffect, useState } from "react";
import { Modal, Button, Checkbox, Input } from "antd";

import "./styles.scss";

import { useSelector, useDispatch } from "react-redux";
import { sendFeedback } from "@store/askfeedback/askfeedback";
import CloseSvg from "app/static/svg/CloseSvg";
import { CustomMultipleSelect } from "../../Resuable/index";

const { Search } = Input;

const AskFeedback = ({ visible, setVisible, callId }) => {
    const [isOpen, setOpen] = useState(true);

    // get all users
    const {
        common: { users },
        askfeedback: { status },
    } = useSelector((state) => state);

    const dispatch = useDispatch();

    const [userIds, setUserIds] = useState([]);

    // close modal on successfull request
    const sendRequest = () => {
        dispatch(
            sendFeedback({
                user_id: userIds,
                meeting_id: callId,
            })
        );
    };

    useEffect(() => {
        if (status) {
            setVisible(false);
            setUserIds([]);
        }
    }, [status]);

    // functions and state that will manager searching for people and selecting

    return (
        <Modal
            title="Feedback Request"
            visible={visible}
            onCancel={() => {
                setUserIds([]);
                setVisible(false);
            }}
            footer={[
                <div className="feedback_btn">
                    <Button
                        type="primary"
                        style={{ borderRadius: "5px" }}
                        onClick={sendRequest}
                        disabled={userIds.length === 0}
                    >
                        Request Feedback
                    </Button>
                </div>,
            ]}
            closeIcon={
                <CloseSvg
                    style={{
                        color: "#666666",
                    }}
                />
            }
            width={624}
        >
            <div className="feedback_form">
                <p className="feedback_title">
                    Ask for feedback from your team &amp; improve faster.{" "}
                </p>
                <p className="feedback_subtitle">
                    We will notify them that you've asked for a feedback &amp;
                    ask them to review your call.{" "}
                </p>
                <div className="f_line"></div>
                <p className="feedback_title marginTB15">
                    Select people who you want feedback from
                </p>
                <CustomMultipleSelect
                    data={users}
                    value={userIds}
                    onChange={(userIds) => setUserIds(userIds)}
                    placeholder={"Select Users"}
                    select_placeholder={"Select Users"}
                    style={{
                        width: "100%",
                        minHeight: "36px",
                        height: "auto",
                        padding: "0",
                    }}
                    className=" multiple__select"
                    type={"user"}
                />
                {/* <div className="f_container">
                    <div className="dropdown">
                        <div
                            className="dropdown-header"
                            onClick={toggleDropdown}
                        >
                            <p>Select People</p>
                            <i
                                className={`fa fa-chevron-right icon ${
                                    isOpen && 'open'
                                }`}
                            ></i>
                        </div>
                        {isOpen && (
                            <div className="dropdown_body">
                                <Search
                                    placeholder="Search Users"
                                    onChange={findPeople}
                                    onSearch={onSearch}
                                    style={{ width: '100%', padding: '5px' }}
                                />
                                <div className="checkbox_body">
                                    <Checkbox.Group
                                        onChange={checkBoxHandler}
                                        value={people}
                                        className="width100p"
                                    >
                                        {userState.length > 0 ? (
                                            userState.map((user) => (
                                                <div
                                                    className="single_option"
                                                    key={user.id}
                                                >
                                                    <Checkbox value={user.id}>
                                                        {user.first_name
                                                            ? user.first_name
                                                            : user.email}
                                                    </Checkbox>
                                                </div>
                                            ))
                                        ) : (
                                            <p
                                                style={{
                                                    width: '100%',
                                                    padding: '5px',
                                                }}
                                            >
                                                User Not Found
                                            </p>
                                        )}
                                    </Checkbox.Group>
                                </div>
                            </div>
                        )}
                    </div>

                  
                </div> */}
            </div>
        </Modal>
    );
};

export default AskFeedback;
