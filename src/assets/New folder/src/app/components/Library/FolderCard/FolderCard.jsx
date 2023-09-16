import React, { useState } from "react";
import "./folderCard.style.scss";
import { Card, Popconfirm, Popover, Typography } from "antd";
import { AddNewFolderSvg, FolderSvg, MoreSvg } from "app/static/svg/indexSvg";
import { getDateTime } from "@tools/helpers";
import { useDispatch, useSelector } from "react-redux";

function FolderCard(props) {
    const {
        category,
        // ------ defaultProps -------
        isAddFolder = false,
        onClickHandler = () => {},
        updateFolderName,
        setShowEditModal,
        showEditModal,
        createFolderName,
        setCreateFolderName,
        deleteFolder,
        id,
    } = props;
    const dispatch = useDispatch();
    const [clicked, setClicked] = useState(false);
    const { loader } = useSelector((state) => state.librarySlice);
    return (
        <>
            {
                <>
                    {isAddFolder ? (
                        <Card
                            className="addFolder folder"
                            hoverable
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onClickHandler(true);
                            }}
                            style={{ width: 198, borderRadius: 12 }}
                        >
                            <div className="flex alignCenter column">
                                <AddNewFolderSvg />
                                <span className="dove_gray_cl placeholder marginT15">
                                    Add New Folder
                                </span>
                            </div>
                        </Card>
                    ) : (
                        <Card
                            className="folder"
                            onClick={(e) => {
                                onClickHandler(e, category?.id);
                            }}
                            style={{ width: 198, borderRadius: 12 }}
                            key={id}
                        >
                            <div className="min_width_0_flex_child">
                                <div className="icon_container flex alignCenter justifySpaceBetween">
                                    <FolderSvg />
                                    <Popover
                                        title={`Select Options`}
                                        placement="bottomRight"
                                        trigger="click"
                                        visible={clicked}
                                        onVisibleChange={(visible) =>
                                            setClicked(visible)
                                        }
                                        content={
                                            <div
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <div
                                                    className="option"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setClicked(false);
                                                        // setCreateFolderName(
                                                        //     category.name
                                                        // );
                                                        setShowEditModal({
                                                            name: category.name,
                                                            visible: true,
                                                            category_id:
                                                                category?.id,
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </div>

                                                <Popconfirm
                                                    title="Are you sure to delete this team?"
                                                    onConfirm={(e) => {
                                                        e.stopPropagation();
                                                        setClicked(false);
                                                        dispatch(
                                                            deleteFolder(
                                                                category?.id
                                                            )
                                                        );
                                                        setShowEditModal({
                                                            name: category.name,
                                                            visible: false,
                                                            category_id:
                                                                category?.id,
                                                        });
                                                    }}
                                                    onCancel={(e) => {
                                                        setClicked(false);
                                                        e.stopPropagation();
                                                        setShowEditModal({
                                                            name: category.name,
                                                            visible: false,
                                                            category_id:
                                                                category?.id,
                                                        });
                                                    }}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <div
                                                        className="option"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        Delete
                                                    </div>
                                                </Popconfirm>
                                            </div>
                                        }
                                        overlayClassName={
                                            "library_card_more_options_popover"
                                        }
                                    >
                                        <span
                                        // onClick={() => {
                                        //     setCreateFolderName(category.name)
                                        //     setShowEditModal({ ...showEditModal, category_id: category?.id })
                                        // }}
                                        >
                                            <MoreSvg
                                                style={{ color: "#666666" }}
                                            />
                                        </span>
                                    </Popover>
                                </div>
                                <div className="folder_title mine_shaft_cl font18 bold600 marginT12">
                                    <Typography.Paragraph
                                        ellipsis={{
                                            rows: 1,
                                            tooltip: true,
                                            expandable: false,
                                        }}
                                    >
                                        {category?.name}
                                    </Typography.Paragraph>
                                </div>
                                <div className="folder_content dusty_gray_cl font12 marginT5 elipse_text">
                                    <span className="creation_date">
                                        {getDateTime(
                                            category?.updated,
                                            "date",
                                            " ",
                                            "MMM dd, yyyy"
                                        )}
                                    </span>
                                    <span>{" | "}</span>
                                    <span className="created_by dove_gray_cl bold600">
                                        {category?.owner?.first_name}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    )}
                </>
            }
        </>
    );
}

export default FolderCard;
