import { useEffect, useState } from "react";
import "./styles.scss";

// components and antd imports
import { Button, Modal } from "antd";

import { useDispatch, useSelector } from "react-redux";

import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import CloseSvg from "app/static/svg/CloseSvg";

import MomentTypes from "./MomentTypes";
import {
    createMoment,
    deleteMoment,
    getMoments,
    getSlackChannels,
} from "@store/momentSettings/momentSettings";

const colors = [
    "#333333",
    "#00BEFF",
    "#43BB0A",
    "#F5B400",
    "#FF6725",
    "#FF6365",
    "#8368F3",
    "#EC4EA5",
    "#A9A9A9",
    "#06DDAA",
];

const MomentsSettings = () => {
    const dispatch = useDispatch();

    const [state, setState] = useState([]);
    // modal props
    const [visible, setVisible] = useState(false);

    // loader states
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    // moment state
    const [moment, setMoment] = useState({
        name: "",
        color_code: "",
    });

    // redux essentials
    const {
        momentCreate: { isCreated, isError },
        data,
        momentDelete: { isDeleted, isDeleteError },
    } = useSelector((state) => state.momentSettings);

    useEffect(() => {
        dispatch(getMoments());
    }, [isCreated, isDeleted]);

    const submitHandler = () => {
        setConfirmLoading(true);
        dispatch(createMoment(moment));
        setMoment({
            name: "",
            color_code: "",
        });
    };

    useEffect(() => {
        if (isCreated || isError) {
            setConfirmLoading(false);
            setVisible(false);
        }
    }, [isCreated, isError]);

    const [myData, setMyData] = useState([]);
    // set state when data is available
    let d = [];
    useEffect(() => {
        if (data?.results?.length > 0) {
            setState(data.results);
        }
    }, [data]);
    if (state.length > 0) {
        d = Array.from(state);
    }
    // console.log(d.sort((a, b) => a.order - b.order));
    const deleteMomentHandler = (id) => {
        dispatch(deleteMoment(id));
    };

    return (
        <div className="moments_container">
            <div className="moments_container_header">
                <h2>Moments Settings</h2>

                <div className="_div1">
                    <p style={{ color: "#666666" }}>
                        These are keyword phrases you setup to find anything in
                        your meetings. They are useful to track competitors and
                        any topic of interest.
                    </p>
                    <Button
                        className="ant-btn ant-btn-primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            showModal();
                        }}
                    >
                        Create A Moment
                    </Button>
                    <Modal
                        title="Create Moment"
                        visible={visible}
                        // onOk={handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                        closeIcon={
                            <CloseSvg
                                style={{
                                    color: "#666666",
                                }}
                            />
                        }
                        footer={
                            <Button
                                type="primary"
                                disabled={
                                    moment.name === "" ||
                                    moment.color_code === ""
                                }
                                loading={confirmLoading}
                                onClick={submitHandler}
                            >
                                Create Now
                            </Button>
                        }
                    >
                        <div className="moment_modal">
                            <div>
                                <p style={{ color: "#333333" }}>
                                    Enter Moment name
                                </p>

                                <input
                                    type="text"
                                    placeholder="Support Issue..."
                                    value={moment.name}
                                    onChange={(e) =>
                                        setMoment({
                                            ...moment,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div style={{ marginBottom: "-10px" }}>
                                <p style={{ color: "#333333" }}>
                                    Choose Colour
                                </p>
                                <div className="color_wrapper">
                                    {colors.map((color) => (
                                        <div
                                            className="color_box"
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                                setMoment({
                                                    ...moment,
                                                    color_code: color,
                                                });
                                            }}
                                        >
                                            {moment.color_code === color && (
                                                <CheckOutlined
                                                    style={{ color: "white" }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>

            <div className="moments_container_body">
                {state.length > 0 && (
                    <>
                        <p style={{ color: "#666666", position: "absolute" }}>
                            Moment Types
                        </p>
                        <p
                            style={{
                                color: "#666666",
                                position: "absolute",
                                right: "30%",
                            }}
                        >
                            Slack Notification
                        </p>
                    </>
                )}

                <MomentTypes
                    colors={colors}
                    state={state}
                    setState={setState}
                    deleteMomentHandler={deleteMomentHandler}
                />
            </div>
        </div>
    );
};

export default MomentsSettings;
