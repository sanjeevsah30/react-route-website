import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Modal, Select, Skeleton, Tooltip } from "antd";
import { FolderOutlined, BellOutlined } from "@ant-design/icons";
import { FolderAddOutlined, SnippetsOutlined } from "@ant-design/icons";
import { getDateTime, getRandomColors, uid } from "@helpers";
import { Link } from "react-router-dom";
import routes from "@constants/Routes/index";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@store/common/actions";
import libraryConfigs from "@constants/Library/index";
import { shareFolder } from "@store/library/actions";
import { Spinner } from "@presentational/reusables/index";

const { Option } = Select;
export default function LibraryFolder({
    loading,
    openAddFolder,
    folders,
    onClick,
}) {
    const [isSharing, setIsSharing] = useState(false);
    const dispatch = useDispatch();
    const allUsers = useSelector((state) => state.common.users);
    const isSample = useSelector((state) => state.library.sample);
    const [showShare, setShowShare] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [activeFolder, setActiveFolder] = useState(0);
    const [activeCreator, setActiveCreator] = useState(0);

    useEffect(() => {
        if (!allUsers.length) {
            dispatch(getAllUsers());
        }
    }, []);

    useEffect(() => {
        if (activeFolder) {
            let selectedFolder = folders.filter(
                (folder) => folder.id === activeFolder
            );
            if (selectedFolder.length) {
                setSelectedUsers(
                    selectedFolder[0].shared_with.map((user) =>
                        user.id.toString()
                    )
                );
            }
        }
    }, [activeFolder]);

    const openShareModel = (id, status, owner) => {
        setActiveFolder(id);
        setShowShare(status);
        setActiveCreator(owner);
    };

    const shareFolderWithUsers = () => {
        setIsSharing(true);
        const id = activeFolder;
        const share_with = allUsers.filter(
            (user) => selectedUsers.indexOf(user.id.toString()) !== -1
        );
        dispatch(shareFolder(id, share_with)).then((res) => {
            setIsSharing(false);
            if (!res.status) {
                setShowShare(false);
            }
        });
    };

    const getSharedString = (users) => {
        return users
            .slice(libraryConfigs.MAX_USERS_SHOWN)
            .map((user) => user.first_name)
            .join(", ");
    };

    return (
        <div className="row library-folders">
            {loading ? (
                <>
                    <Card className="folder" style={{ width: 300 }}>
                        <div className="folder-top">
                            <Skeleton
                                active
                                avatar={{ shape: "square", size: "small" }}
                                paragraph={{ rows: 2 }}
                            />
                        </div>
                        <div className="folder-info">
                            <Skeleton.Button
                                active
                                size={"small"}
                                shape={"round"}
                            />
                        </div>
                    </Card>
                    <Card className="folder" style={{ width: 300 }}>
                        <div className="folder-top">
                            <Skeleton
                                active
                                avatar={{ shape: "square" }}
                                paragraph={{ rows: 2 }}
                            />
                        </div>
                        <div className="folder-info">
                            <Skeleton.Button
                                active
                                size={"small"}
                                shape={"round"}
                            />
                        </div>
                    </Card>
                </>
            ) : (
                <>
                    <Card
                        className="folder add-folder-btn"
                        hoverable
                        style={{ width: 300 }}
                        onClick={openAddFolder}
                    >
                        <Button
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={<FolderAddOutlined />}
                        />
                        <span className="help-text">Add New</span>
                    </Card>
                    {folders.map((folder) => (
                        <Card
                            key={uid() + folder.id}
                            className="folder"
                            style={{ width: 300 }}
                            actions={[
                                <Tooltip
                                    destroyTooltipOnHide
                                    placement="topLeft"
                                    title={"Manage Watchers"}
                                >
                                    <Button
                                        icon={<BellOutlined />}
                                        type={"link"}
                                        onClick={() => {
                                            openShareModel(
                                                folder.id,
                                                true,
                                                folder.owner.id
                                            );
                                        }}
                                    />
                                </Tooltip>,
                                <Link
                                    key={folder.id}
                                    to={`${routes.LIBRARY}/${folder.id}`}
                                >
                                    <Button
                                        className="snippet-btn"
                                        type={"default"}
                                        icon={<SnippetsOutlined />}
                                        shape={"round"}
                                        onClick={(evt) =>
                                            onClick(evt, folder.id)
                                        }
                                        disabled={!folder.total_meetings}
                                    >
                                        {`${folder.total_meetings} Snippets`}
                                    </Button>
                                </Link>,
                            ]}
                        >
                            <div>
                                <div className="folder-top">
                                    <p className="date">
                                        {getDateTime(folder.created, "date")}
                                    </p>
                                    <p>
                                        <span>
                                            <FolderOutlined />{" "}
                                        </span>
                                        {folder.name.length > 25 ? (
                                            <Tooltip
                                                destroyTooltipOnHide
                                                placement="topLeft"
                                                title={folder.name}
                                            >
                                                <span className="folder-top-name">
                                                    {folder.name}
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            <span className="folder-top-name">
                                                {folder.name}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="folder-creator-shared">
                                    <div className="creator">
                                        <Tooltip
                                            destroyTooltipOnHide
                                            placement="topLeft"
                                            title={"Created By"}
                                        >
                                            <Avatar
                                                size={24}
                                                style={{
                                                    backgroundColor: "#7265e6",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                {folder.owner.first_name
                                                    .split("")[0]
                                                    .toUpperCase()}
                                            </Avatar>
                                            <span className="name">
                                                {folder.owner.first_name}{" "}
                                                {folder.owner.last_name}
                                            </span>
                                        </Tooltip>
                                    </div>
                                    <div className="shared">
                                        {folder.shared_with.length >
                                        libraryConfigs.MAX_USERS_SHOWN ? (
                                            <>
                                                {folder.shared_with
                                                    .slice(
                                                        0,
                                                        libraryConfigs.MAX_USERS_SHOWN
                                                    )
                                                    .map((user) => (
                                                        <UserAvatar
                                                            key={
                                                                uid() + user.id
                                                            }
                                                            user={user}
                                                        />
                                                    ))}
                                                <Avatar
                                                    size={24}
                                                    style={{
                                                        backgroundColor:
                                                            "#e665c6",
                                                    }}
                                                >
                                                    <Tooltip
                                                        destroyTooltipOnHide
                                                        placement="topLeft"
                                                        title={() =>
                                                            getSharedString(
                                                                folder.shared_with
                                                            )
                                                        }
                                                    >
                                                        +
                                                        {folder.shared_with
                                                            .length -
                                                            libraryConfigs.MAX_USERS_SHOWN}
                                                    </Tooltip>
                                                </Avatar>
                                            </>
                                        ) : (
                                            folder.shared_with.map((user) => (
                                                <UserAvatar
                                                    user={user}
                                                    key={uid() + user.id}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </>
            )}
            <Modal
                visible={showShare}
                title={libraryConfigs.SHARE_TITLE}
                className="modal"
                onOk={() => setShowShare(false)}
                onCancel={() => setShowShare(false)}
                footer={[
                    <Button
                        className={"cancel-folder"}
                        key="back"
                        onClick={() => setShowShare(false)}
                        shape={"round"}
                    >
                        Cancel
                    </Button>,
                    <Tooltip
                        destroyTooltipOnHide
                        title={isSample ? "Not available for sample data" : ""}
                        placement={"top"}
                    >
                        <Button
                            key="submit"
                            type="primary"
                            onClick={shareFolderWithUsers}
                            shape={"round"}
                            disabled={isSample}
                        >
                            {libraryConfigs.SHARE_BTN}
                        </Button>
                    </Tooltip>,
                ]}
            >
                <Spinner loading={isSharing}>
                    <div className="library-share-folder">
                        <p>
                            <i>
                                An email will be sent to users whenever there is
                                any update to this folder.
                            </i>
                        </p>
                        <Select
                            mode="multiple"
                            placeholder={libraryConfigs.SHARE_SELECT_LABEL}
                            onChange={(value) => {
                                setSelectedUsers(value);
                            }}
                            value={isSample ? [] : selectedUsers}
                            optionFilterProp="children"
                        >
                            {isSample
                                ? []
                                : allUsers.map((user) =>
                                      user.id !== activeCreator ? (
                                          <Option
                                              key={uid() + user.id}
                                              value={user.id.toString()}
                                          >
                                              {user.first_name}
                                          </Option>
                                      ) : null
                                  )}
                        </Select>
                    </div>
                </Spinner>
            </Modal>
        </div>
    );
}

LibraryFolder.defaultProps = {
    loading: false,
    openAddFolder: () => {},
    folders: [],
    onClick: () => {},
};

const UserAvatar = ({ user }) => (
    <Tooltip destroyTooltipOnHide placement="topLeft" title={user.first_name}>
        <Avatar
            size={24}
            style={{
                backgroundColor: getRandomColors(user.first_name),
            }}
        >
            {user.first_name.split("")[0].toUpperCase()}
        </Avatar>
    </Tooltip>
);
