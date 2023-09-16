import React, { useState } from "react";
import {
    Button,
    Popconfirm,
    Modal,
    Input,
    Select,
    Avatar,
    Tooltip,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import searchConfig from "@constants/Search";
import { Input as CustomInput, Label, Error } from "@reusables";
import { useDispatch, useSelector } from "react-redux";
import commonConfig from "@constants/common";
import { uid } from "@tools/helpers";
import EditCommentSvg from "app/static/svg/EditCommentSvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import SearchSvg from "app/static/svg/SearchSvg";
import TrackerModal from "./TrackerModal";
import config from "@constants/Search";
import { isEqual } from "lodash";
import InfiniteLoader from "@presentational/reusables/InfiniteLoader";
import { getTrackers } from "@store/search/actions";
import Dot from "@presentational/reusables/Dot";

const { Option } = Select;

export default function TrackersUI(props) {
    const user = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const resetModal = () => {
        props.setisEditing(false);
        props.setnewTrackerModal(false);
        props.setnewTracker(searchConfig.TRACKER_INIT);
    };

    const {
        trackers: { results, next },
    } = useSelector(({ search }) => search);
    const dispatch = useDispatch();
    const [trackerToEdit, setTrackerToEdit] = useState({
        name: "",
        update_interval:
            config.NOTIFICATION[config.TRACKER_INIT.update_interval],
        id: null,
    });

    const getNotificationType = (update_interval) => {
        const ch = config.NOTIFICATION.findIndex((n) =>
            isEqual(JSON.parse(update_interval), n)
        );

        switch (ch) {
            case 0:
                return "Immediately";
            case 1:
                return "Daily";
            case 2:
                return "Weekly";
            case 3:
                return "Monthly";
            default:
                return "";
        }
    };

    return (
        <>
            <div className="search-trackers ">
                <div className="top">
                    {/* <Label label={searchConfig.ALLTRACKERS} /> */}
                    <div className={"trackercontainer"}>
                        <Input
                            size="large"
                            placeholder={searchConfig.TRACKERPLACEHOLDER}
                            suffix={
                                <SearchSvg
                                    style={{
                                        marginRight: "12px",
                                        fontSize: "14px",
                                    }}
                                />
                            }
                            className="borderRadius5 marginB10 flexShrink active_hover active_focus"
                            onChange={(e) =>
                                props.setTrackerNameToFind(e.target.value)
                            }
                            value={props.trackerNameToFind}
                            autoFocus={true}
                        />
                    </div>
                </div>
                <InfiniteLoader
                    Component={TrackerCard}
                    data={results?.filter((tracker) =>
                        tracker.name
                            ?.toLowerCase()
                            .includes(props.trackerNameToFind.toLowerCase())
                    )}
                    onLoadMore={() => {
                        dispatch(getTrackers(next));
                    }}
                    style={{
                        height: "100%",
                        overflow: "auto",
                    }}
                    hasNextPage={next}
                    applyTracker={props.applyTracker}
                    removeTracker={props.removeTracker}
                    setShowModal={setShowModal}
                    user={user}
                    setTrackerToEdit={setTrackerToEdit}
                    getNotificationType={getNotificationType}
                />
            </div>
            <TrackerModal
                visible={showModal}
                closeModal={() => {
                    setShowModal(false);
                    setTrackerToEdit({
                        name: "",
                        update_interval:
                            config.NOTIFICATION[
                                config.TRACKER_INIT.update_interval
                            ],
                        id: null,
                    });
                }}
                title={searchConfig.EDIT_TRACKER_TITLE}
                handleSubmit={props.handleSubmit}
                data={trackerToEdit}
            />
        </>
    );
}

const TrackerCard = ({
    setTrackerToEdit,
    data: tracker,
    applyTracker,
    removeTracker,
    setShowModal,
    user,
    getNotificationType,
}) => (
    <div
        className="tracker-card"
        key={tracker.id}
        onClick={() => applyTracker(tracker.id)}
    >
        <div>
            <span className="tarcker_name">{tracker.name}</span>
            <Dot height="6px" width="6px" className="dusty_gray_bg marginLR8" />
            <span className="mine_shaft_cl">
                {getNotificationType(tracker.update_interval)}
            </span>
        </div>

        <div className="flex justifySpaceBetween alignCenter">
            <div className="flex1">
                <Avatar size={28} className="card__avatar">
                    {tracker?.owner?.first_name?.slice(0, 1)}
                </Avatar>
                <span className={"font12 dove_gray_cl marginL10"}>
                    {tracker.owner.first_name}
                </span>
            </div>
            <div>
                <div className="action">
                    {tracker.owner?.id === user.id && (
                        <>
                            <span
                                className="action_btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTrackerToEdit({
                                        ...tracker,
                                        update_interval:
                                            config.NOTIFICATION.findIndex((n) =>
                                                isEqual(
                                                    JSON.parse(
                                                        tracker.update_interval
                                                    ),
                                                    n
                                                )
                                            ),
                                    });
                                    setShowModal(true);
                                    // props.editTracker(
                                    //     tracker.id
                                    // );
                                }}
                            >
                                <EditCommentSvg />
                            </span>

                            <Popconfirm
                                onConfirm={(e) => {
                                    e.stopPropagation();
                                    removeTracker(tracker.id);
                                }}
                                title={"Are you sure to delete this tracker"}
                                onCancel={(e) => e.stopPropagation()}
                                okText="Yes"
                                cancelText="No"
                            >
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="action_btn"
                                >
                                    <DeleteSvg />
                                </span>
                            </Popconfirm>
                            <span className="action_btn">
                                <ChevronRightSvg />
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
);
