import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Dropdown, Input, Menu, Modal, Skeleton } from "antd";
import FolderCard from "./FolderCard/FolderCard";
import { LibraryContext } from "./NewLibraryContainer";
import libraryConfigs from "@constants/Library/index";
import SnippetCard from "./SnippetCard/SnippetCard";
import NavHeader from "./NavHeader/NavHeader";
import FileCard from "./FileCard/FileCard";
import CustomButton from "./CustomButton/CustomButton";
import { DropnUpload, NoData, Spinner } from "@presentational/reusables/index";
import callsConfig from "@constants/MyCalls/index";
import {
    CloseSvg,
    DownLoadSvg,
    NoDataSvg,
    UploadTempSvg,
} from "app/static/svg/indexSvg";
import DragDrop from "./DragDrop/DragDrop";
import { Link, Route } from "react-router-dom";
import routes from "@constants/Routes/index";
import { useDispatch, useSelector } from "react-redux";
import {
    createGoogleForm,
    setInitialState,
    uploadMedia,
} from "@store/library/librarySlice";
import { openNotification } from "@store/common/actions";
import LibarayNav from "./LibaryNav/LibarayNav";
import Assessment from "./Assessment/Assessment";
import AssessmentFormCreate from "./Assessment/AssessmentFormCreate/AssessmentFormCreate";
import DownloadSvg from "app/static/svg/DownloadSvg";
import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import Nav from "./LibaryNav/Nav";
import apiErrors from "@apis/common/errors";
import ChartImg from "../AnalyticsDashboard/Components/svg/chart-growth.png";
import ExcelImg from "../AnalyticsDashboard/Components/svg/microsoft-excel.png";

const LibraryTabs = [
    {
        id: 1,
        tab_title: "Knowledge Base",
        link: "/library/resources",
    },
    {
        id: 2,
        tab_title: "Assessment",
        link: "/library/assessment",
    },
];

const AssessmentTabs = [
    {
        id: 1,
        tab_title: "Questions",
        link: "/library/assessment/create",
    },
    {
        id: 2,
        tab_title: "Analysis",
        link: "/library/assessment/analysis",
    },
];

function NewLibraryView(props) {
    const {
        categories,
        createFolder,
        handleSelectFolder,
        meetings,
        uploads,
        handlePlayVideo,
        deleteSnippetHandler,
        updateFolderName,
        // updateCallProgress,
        // uploadProgress,
        selectedFolder,
        deleteUploads,
        deleteFolder,
        getMediaHandler,
        getSnippetHandler,
    } = props;
    const {
        showCreateFolder,
        showMoreSnippet,
        setShowCreateFolder,
        createFolderName,
        showEditModal,
        setShowMoreSnippet,
        uploadSnippetsModal,
        setUploadSnippetsModal,
        setCreateFolderName,
        files,
        setFiles,
        mediaId,
        // getMediaHandler,
        // setUploadProgress,
        setShowEditModal,
    } = useContext(LibraryContext);

    const dispatch = useDispatch();
    const { id } = useSelector(
        (state) => state.librarySlice.assessment.formData
    );
    const { loader, filesLoader, assessment } = useSelector(
        (state) => state.librarySlice
    );
    const temp =
        uploads?.media?.length / 2 === 0
            ? uploads?.media?.length / 2
            : uploads?.media?.length / 2 + 1;

    const [activeTab, setActiveTab] = useState(LibraryTabs[0]?.id);
    const [activeAssessTab, setActiveAssessTab] = useState(
        AssessmentTabs[0]?.id
    );
    const [activeAssessment, setActiveAssessment] = useState(null);
    console.log(activeAssessTab);
    const [imageUrl, setImageUrl] = useState("");
    const [isLoding, setIsLoding] = useState(false);
    const [isDataAvilable, setIsDataAvilable] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        window.location.pathname === "/library/assessment"
            ? setActiveTab(LibraryTabs[1]?.id)
            : window.location.pathname === "/library/resources"
            ? setActiveTab(LibraryTabs[0]?.id)
            : setActiveTab(LibraryTabs[0]?.id);

        window.location.pathname.includes("/library/assessment/create")
            ? setActiveAssessTab(AssessmentTabs[0]?.id)
            : window.location.pathname.includes("/library/assessment/analysis")
            ? setActiveAssessTab(AssessmentTabs[1]?.id)
            : setActiveAssessTab(AssessmentTabs[0]?.id);
    }, [window.location.pathname]);

    useEffect(() => {
        if (!!id && window.location.pathname.includes("/analysis")) {
            setActiveAssessment(id);
            setIsLoding(true);
            const url = `/coachings/assessment/${id}/graph/`;
            axiosInstance
                .get(url, { responseType: "arraybuffer" })
                .then((res) => {
                    const blob = new Blob([res.data], {
                        type: res.headers["content-type"],
                    });
                    const objectUrl = URL.createObjectURL(blob);
                    setImageUrl(objectUrl);
                    setIsLoding(false);
                    setIsDataAvilable(true);
                })
                .catch((err) => {
                    const { status, message } = getError(err);
                    setIsLoding(false);
                    if (status === apiErrors.AXIOSERRORSTATUS) {
                        setIsDataAvilable(false);
                        openNotification("error", "Error", message);
                    }
                });
        }
    }, [window.location.pathname]);

    const downloadImage = () => {
        // e.preventDefault();
        const a = document.createElement("a");
        a.href = imgRef.current.src;
        a.download = "image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const downloadExcelHandle = () => {
        const destination_id = assessment.assessmentsList.find(
            (item) => item.id === activeAssessment
        ).destination_id;
        window.open(
            `https://docs.google.com/spreadsheets/d/${destination_id}/export?format=xlsx&id=${destination_id}`,
            "_parent"
        );
    };

    const downloadHandle = ({ key }) => {
        console.log(key);
        if (+key === 2) {
            downloadExcelHandle();
        } else {
            isDataAvilable && downloadImage();
        }
    };

    const menu = (
        <Menu
            onClick={downloadHandle}
            items={[
                {
                    label: "GRAPH",
                    key: "1",
                    icon: (
                        <img
                            alt="graph"
                            style={{ width: 20, height: 20 }}
                            src={ChartImg}
                        />
                    ),
                },
                {
                    label: "REPORT",
                    key: "2",
                    icon: (
                        <img
                            alt="report"
                            style={{ width: 20, height: 20 }}
                            src={ExcelImg}
                        />
                    ),
                },
            ]}
        />
    );

    return (
        <div className="heightp100">
            {/* {window.location.pathname === '/library/assessment' ||
            window.location.pathname === '/library/resources' ? (
                <Nav
                    tabs={LibraryTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            ) : (
                <></>
            )} */}
            <Route
                exact
                path={routes.LIBRARY.resources}
                render={() => (
                    <>
                        <Nav
                            tabs={LibraryTabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                        <div className="overflowYscroll heightp100">
                            {loader ? (
                                <div className="library_folders_container paddingLR36 paddingTB36 row">
                                    <Card
                                        className="addFolder folder"
                                        hoverable
                                        style={{ width: 198, borderRadius: 12 }}
                                    >
                                        <div className="folder-top">
                                            <Skeleton
                                                active
                                                avatar={{
                                                    shape: "square",
                                                    size: "small",
                                                }}
                                                paragraph={{ rows: 2 }}
                                            />
                                        </div>
                                    </Card>
                                    <Card
                                        className="addFolder folder"
                                        hoverable
                                        style={{ width: 198, borderRadius: 12 }}
                                    >
                                        <div className="folder-top">
                                            <Skeleton
                                                active
                                                avatar={{
                                                    shape: "square",
                                                    size: "small",
                                                }}
                                                paragraph={{ rows: 2 }}
                                            />
                                        </div>
                                    </Card>
                                    <Card
                                        className="addFolder folder"
                                        hoverable
                                        style={{ width: 198, borderRadius: 12 }}
                                    >
                                        <div className="folder-top">
                                            <Skeleton
                                                active
                                                avatar={{
                                                    shape: "square",
                                                    size: "small",
                                                }}
                                                paragraph={{ rows: 2 }}
                                            />
                                        </div>
                                    </Card>
                                    <Card
                                        className="addFolder folder"
                                        hoverable
                                        style={{ width: 198, borderRadius: 12 }}
                                    >
                                        <div className="folder-top">
                                            <Skeleton
                                                active
                                                avatar={{
                                                    shape: "square",
                                                    size: "small",
                                                }}
                                                paragraph={{ rows: 2 }}
                                            />
                                        </div>
                                    </Card>
                                </div>
                            ) : (
                                <div className="library_folders_container paddingLR36 paddingTB36 row">
                                    <FolderCard
                                        isAddFolder={true}
                                        onClickHandler={setShowCreateFolder}
                                    />
                                    {categories &&
                                        categories.map((category) => (
                                            <Link
                                                to={`${routes.LIBRARY.resources}/${category?.id}`}
                                                key={category?.id}
                                            >
                                                <FolderCard
                                                    category={category}
                                                    onClickHandler={
                                                        handleSelectFolder
                                                    }
                                                    updateFolderName={
                                                        updateFolderName
                                                    }
                                                    setShowEditModal={
                                                        setShowEditModal
                                                    }
                                                    showEditModal={
                                                        showEditModal
                                                    }
                                                    setCreateFolderName={
                                                        setCreateFolderName
                                                    }
                                                    createFolderName={
                                                        createFolderName
                                                    }
                                                    deleteFolder={deleteFolder}
                                                    id={category?.id}
                                                />
                                            </Link>
                                        ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            />

            <Route
                exact
                path={routes.LIBRARY.folder}
                render={() => (
                    <div className="library_snippets_container overflowYscroll heightp100">
                        {/*---------------------------- navHeader ------------------------------- */}
                        <NavHeader />
                        {uploads.loader && meetings.loader ? (
                            <div className="snippet_cards_container row">
                                <Card
                                    className="addFolder folder"
                                    hoverable
                                    style={{ width: 333, borderRadius: 12 }}
                                >
                                    <div className="folder-top">
                                        <Skeleton
                                            active
                                            avatar={{
                                                shape: "square",
                                                size: "small",
                                            }}
                                            paragraph={{ rows: 2 }}
                                        />
                                    </div>
                                </Card>
                                <Card
                                    className="addFolder folder"
                                    hoverable
                                    style={{ width: 333, borderRadius: 12 }}
                                >
                                    <div className="folder-top">
                                        <Skeleton
                                            active
                                            avatar={{
                                                shape: "square",
                                                size: "small",
                                            }}
                                            paragraph={{ rows: 2 }}
                                        />
                                    </div>
                                </Card>
                                <Card
                                    className="addFolder folder"
                                    hoverable
                                    style={{ width: 333, borderRadius: 12 }}
                                >
                                    <div className="folder-top">
                                        <Skeleton
                                            active
                                            avatar={{
                                                shape: "square",
                                                size: "small",
                                            }}
                                            paragraph={{ rows: 2 }}
                                        />
                                    </div>
                                </Card>
                                <Card
                                    className="addFolder folder"
                                    hoverable
                                    style={{ width: 333, borderRadius: 12 }}
                                >
                                    <div className="folder-top">
                                        <Skeleton
                                            active
                                            avatar={{
                                                shape: "square",
                                                size: "small",
                                            }}
                                            paragraph={{ rows: 2 }}
                                        />
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <>
                                {!!meetings.snippets.length ||
                                !!uploads.media.length ? (
                                    <>
                                        {/*-------------------- Snippets section ---------------------------------*/}
                                        {
                                            // !!meetings.snippets.length &&
                                            <>
                                                {!!meetings.snippets.length && (
                                                    <div className="seprator_heading font16 bold600">
                                                        <p className="line">
                                                            Snippets
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="snippet_cards_container row">
                                                    {
                                                        // !meetings.loader ?
                                                        <>
                                                            {
                                                                !!meetings
                                                                    .snippets
                                                                    .length && (
                                                                    <>
                                                                        {meetings.snippets
                                                                            ?.slice(
                                                                                0,
                                                                                5
                                                                            )
                                                                            ?.map(
                                                                                (
                                                                                    snippet
                                                                                ) => (
                                                                                    <SnippetCard
                                                                                        key={
                                                                                            snippet.id
                                                                                        }
                                                                                        snippet={
                                                                                            snippet
                                                                                        }
                                                                                        handlePlayVideo={
                                                                                            handlePlayVideo
                                                                                        }
                                                                                        deleteSnippetHandler={
                                                                                            deleteSnippetHandler
                                                                                        }
                                                                                        getSnippetHandler={
                                                                                            getSnippetHandler
                                                                                        }
                                                                                    />
                                                                                )
                                                                            )}
                                                                        {showMoreSnippet ? (
                                                                            <>
                                                                                {meetings.snippets
                                                                                    ?.slice(
                                                                                        5
                                                                                    )
                                                                                    ?.map(
                                                                                        (
                                                                                            snippet
                                                                                        ) => (
                                                                                            <SnippetCard
                                                                                                key={
                                                                                                    snippet.id
                                                                                                }
                                                                                                snippet={
                                                                                                    snippet
                                                                                                }
                                                                                                handlePlayVideo={
                                                                                                    handlePlayVideo
                                                                                                }
                                                                                                deleteSnippetHandler={
                                                                                                    deleteSnippetHandler
                                                                                                }
                                                                                                getSnippetHandler={
                                                                                                    getSnippetHandler
                                                                                                }
                                                                                            />
                                                                                        )
                                                                                    )}
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </>
                                                                )
                                                                // :
                                                                // <div className="flex alignCenter justifyContentCenter">
                                                                //     <NoData />
                                                                // </div>
                                                                // <></>
                                                            }
                                                        </>
                                                        // :
                                                        // <>
                                                        //     <Card
                                                        //         className="addFolder folder"
                                                        //         hoverable
                                                        //         style={{ width: 198, borderRadius: 12 }}
                                                        //     >
                                                        //         <div className="folder-top">
                                                        //             <Skeleton
                                                        //                 active
                                                        //                 avatar={{ shape: 'square', size: 'small' }}
                                                        //                 paragraph={{ rows: 2 }}
                                                        //             />
                                                        //         </div>
                                                        //     </Card>
                                                        //     <Card
                                                        //         className="addFolder folder"
                                                        //         hoverable
                                                        //         style={{ width: 198, borderRadius: 12 }}
                                                        //     >
                                                        //         <div className="folder-top">
                                                        //             <Skeleton
                                                        //                 active
                                                        //                 avatar={{ shape: 'square', size: 'small' }}
                                                        //                 paragraph={{ rows: 2 }}
                                                        //             />
                                                        //         </div>
                                                        //     </Card>
                                                        //     <Card
                                                        //         className="addFolder folder"
                                                        //         hoverable
                                                        //         style={{ width: 198, borderRadius: 12 }}
                                                        //     >
                                                        //         <div className="folder-top">
                                                        //             <Skeleton
                                                        //                 active
                                                        //                 avatar={{ shape: 'square', size: 'small' }}
                                                        //                 paragraph={{ rows: 2 }}
                                                        //             />
                                                        //         </div>
                                                        //     </Card>
                                                        // </>
                                                    }
                                                </div>
                                                {meetings.snippets.length >
                                                    4 && (
                                                    <div className="showMoreSnippet_btn primary_cl bold600">
                                                        <span
                                                            className="curPoint"
                                                            onClick={() =>
                                                                setShowMoreSnippet(
                                                                    (prev) =>
                                                                        !prev
                                                                )
                                                            }
                                                        >
                                                            {showMoreSnippet
                                                                ? `Show less snippets`
                                                                : `Show all snippets`}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        }

                                        {/* ------------------- file Upload section -------------------------------- */}
                                        {
                                            <>
                                                {
                                                    // !!uploads.media.length &&
                                                    <>
                                                        {!!uploads?.media
                                                            ?.length && (
                                                            <div className="seprator_heading font16 bold600">
                                                                <p className="line">
                                                                    Uploads
                                                                </p>
                                                            </div>
                                                        )}
                                                        <div className="upload_file_container flex">
                                                            <div className="upload_left_section">
                                                                {uploads?.media
                                                                    ?.slice(
                                                                        0,
                                                                        temp
                                                                    )
                                                                    ?.map(
                                                                        (
                                                                            item
                                                                        ) => (
                                                                            <FileCard
                                                                                media={
                                                                                    item
                                                                                }
                                                                                deleteUploads={
                                                                                    deleteUploads
                                                                                }
                                                                                getMediaHandler={
                                                                                    getMediaHandler
                                                                                }
                                                                            />
                                                                        )
                                                                    )}
                                                            </div>
                                                            {/* <div className="vertical_line"></div> */}
                                                            <div className="upload_right_section">
                                                                {uploads?.media
                                                                    ?.slice(
                                                                        temp
                                                                    )
                                                                    ?.map(
                                                                        (
                                                                            item
                                                                        ) => (
                                                                            <FileCard
                                                                                media={
                                                                                    item
                                                                                }
                                                                                deleteUploads={
                                                                                    deleteUploads
                                                                                }
                                                                                getMediaHandler={
                                                                                    getMediaHandler
                                                                                }
                                                                            />
                                                                        )
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            </>
                                        }
                                    </>
                                ) : (
                                    <div className="flex alignCenter justifyCenter height100p">
                                        <NoData />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            />
            <Route
                exact
                path={routes.LIBRARY.assessment}
                render={() => (
                    <>
                        <Nav
                            tabs={LibraryTabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            createLink="/library/assessment/create"
                            onClickHandler={() => {
                                dispatch(setInitialState({}));
                                dispatch(createGoogleForm());
                            }}
                        />
                        <Assessment />
                    </>
                )}
            />
            <Route
                exact
                path={`${routes.LIBRARY.assessment}/create`}
                render={() => (
                    <>
                        <Nav
                            tabs={AssessmentTabs}
                            backButton={"/library/assessment"}
                            activeTab={activeAssessTab}
                            setActiveTab={setActiveAssessTab}
                        />
                        <AssessmentFormCreate />
                    </>
                )}
            />
            <Route
                exact
                path={`${routes.LIBRARY.assessment}/create/:id`}
                render={() => (
                    <>
                        <Nav
                            tabs={AssessmentTabs}
                            backButton={"/library/assessment"}
                            activeTab={activeAssessTab}
                            setActiveTab={setActiveAssessTab}
                        />
                        <AssessmentFormCreate />
                    </>
                )}
            />
            <Route
                exact
                path={`${routes.LIBRARY.assessment}/analysis`}
                render={() => (
                    <>
                        <Nav
                            tabs={AssessmentTabs}
                            backButton={"/library/assessment"}
                            activeTab={activeAssessTab}
                            setActiveTab={setActiveAssessTab}
                        />
                        <div
                            className="flex column"
                            style={{
                                width: "68%",
                                margin: "0 75px",
                                height: "90%",
                            }}
                        >
                            <div
                                className="flex alignCenter justifySpaceBetween"
                                style={{
                                    marginTop: "34px",
                                    marginBottom: "34px",
                                }}
                            >
                                <div className="font18 bold600">
                                    Pictorial Analysis of Responses
                                </div>
                                <Dropdown overlay={menu}>
                                    <div
                                        // onClick={
                                        //     isDataAvilable
                                        //         ? downloadImage
                                        //         : () => {}
                                        // }
                                        className="curPoint"
                                    >
                                        <DownloadSvg />
                                    </div>
                                </Dropdown>
                            </div>
                            <div
                                className="width100p overflowYscroll"
                                style={{
                                    height: "700px",
                                    boxShadow:
                                        "0px 4px 20px rgba(51, 51, 51, 0.1)",
                                    borderRadius: "14px",
                                    flexGrow: 1,
                                }}
                            >
                                <Spinner loading={isLoding}>
                                    {!isLoding && (
                                        <>
                                            {isDataAvilable ? (
                                                <img
                                                    src={imageUrl}
                                                    alt="response Analysis"
                                                    ref={imgRef}
                                                />
                                            ) : (
                                                <div
                                                    className="flex alignCenter justifyCenter"
                                                    style={{ height: "100%" }}
                                                >
                                                    <NoDataSvg />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </Spinner>
                            </div>
                        </div>
                    </>
                )}
            />

            {/*------------------- Models section -----------------------------------------*/}
            <Modal
                style={{ minWidth: "auto", fontSize: 27 }}
                width={666}
                visible={showCreateFolder}
                title={libraryConfigs.CREATE_FOLDER}
                className="create_folder_modal"
                onOk={() => {
                    setCreateFolderName("");
                    setShowCreateFolder(false);
                }}
                onCancel={() => {
                    setCreateFolderName("");
                    setShowCreateFolder(false);
                }}
                footer={[
                    <Button
                        className={"cancel_folder_btn footer_btn"}
                        key="back"
                        onClick={() => {
                            setCreateFolderName("");
                            setShowCreateFolder(false);
                        }}
                        shape={"round"}
                    >
                        {libraryConfigs.CANCEL}
                    </Button>,
                    <Button
                        className="submit_btn footer_btn"
                        key="submit"
                        type="primary"
                        onClick={() => {
                            createFolder(createFolderName);
                            setCreateFolderName("");
                            setShowCreateFolder(false);
                        }}
                        shape={"round"}
                    >
                        {libraryConfigs.CREATE_FOLDER_BTN}
                    </Button>,
                ]}
            >
                <div className="create_folder_form_content mine_shaft_cl">
                    <div className="folder_title font18 bold600">
                        {"Enter a Name"}
                    </div>
                    <div className="input_wrapper marginT23">
                        <Input
                            placeholder="Enter a folder name"
                            style={{
                                height: "3.75rem",
                                backgroundColor: "rgba(153, 153, 153, 0.03)",
                                borderRadius: 6,
                            }}
                            value={createFolderName}
                            onChange={(e) => {
                                setCreateFolderName(e.target.value);
                                // console.log(e.target.value)
                            }}
                        ></Input>
                    </div>
                </div>
            </Modal>

            <Modal
                title="Upload"
                visible={uploadSnippetsModal}
                className="upload_file_modal mine_shaft_cl font24 bold600"
                style={{ minWidth: "auto" }}
                width={`64.25rem`}
                onCancel={() => {
                    setFiles({});
                    // setUploadProgress({
                    //     value: 0,
                    //     isError: false,
                    // });
                    setUploadSnippetsModal(false);
                }}
                closeIcon={
                    <CloseSvg
                        style={{ transform: "scale(1.2)", color: "#333" }}
                    />
                }
                footer={[
                    <CustomButton
                        disabled={
                            !!Object.values(filesLoader).filter((e) => e).length
                        }
                        onClick={() => {
                            // const tempFilesArr = [];
                            // Object.keys(files).forEach(
                            //     key => {
                            //         let data = new FormData();
                            //         data.append('category', selectedFolder);
                            //         data.append('media', files[key])
                            //         dispatch(uploadMedia({ data: data, updateCallProgress: updateCallProgress }))
                            //         // console.log(data)
                            //         // dispatch(uploadMedia(data))
                            //     }
                            // )
                            Promise.all(
                                Object.keys(files).map((key) => {
                                    let data = new FormData();
                                    data.append("category", selectedFolder);
                                    data.append("media", files[key]);

                                    let api = dispatch(
                                        uploadMedia({
                                            data: data,
                                            // updateCallProgress:
                                            //     updateCallProgress,
                                        })
                                    );

                                    api?.unwrap()?.then(() => {
                                        const temp = { ...files };
                                        delete temp[key];
                                        setFiles({ ...temp });
                                    });

                                    return api.unwrap();
                                })
                            ).then((res) => {
                                setFiles({});
                                openNotification(
                                    "success",
                                    "Success",
                                    "media Uploaded successfully"
                                );
                                setUploadSnippetsModal(false);
                            });
                        }}
                    />,
                ]}
            >
                {uploadSnippetsModal && (
                    <DragDrop
                        files={files}
                        setFiles={setFiles}
                        // uploadProgress={uploadProgress}
                    />
                )}
            </Modal>

            <Modal
                style={{ minWidth: "auto", fontSize: 27 }}
                width={666}
                visible={showEditModal.visible}
                title={libraryConfigs.EDIT_FOLDER}
                className="create_folder_modal"
                onOk={() =>
                    setShowEditModal({
                        name: "",
                        category_id: 0,
                        visible: false,
                    })
                }
                onCancel={() =>
                    setShowEditModal({
                        name: "",
                        category_id: 0,
                        visible: false,
                    })
                }
                footer={[
                    <Button
                        className={"cancel_folder_btn footer_btn"}
                        key="back"
                        onClick={() =>
                            setShowEditModal({
                                name: "",
                                category_id: 0,
                                visible: false,
                            })
                        }
                        shape={"round"}
                    >
                        {libraryConfigs.CANCEL}
                    </Button>,
                    <Button
                        className="submit_btn footer_btn"
                        key="submit"
                        type="primary"
                        onClick={() => {
                            dispatch(
                                updateFolderName({
                                    id: showEditModal?.category_id,
                                    category: showEditModal.name,
                                })
                            );
                            setShowEditModal({
                                name: "",
                                category_id: 0,
                                visible: false,
                            });
                        }}
                        shape={"round"}
                    >
                        {libraryConfigs.EDIT_FOLDER_BTN}
                    </Button>,
                ]}
            >
                <div className="create_folder_form_content mine_shaft_cl">
                    <div className="folder_title font18 bold600">
                        {"Enter a Name"}
                    </div>
                    <div className="input_wrapper marginT23">
                        <Input
                            placeholder="Enter a folder name"
                            style={{
                                height: "3.75rem",
                                backgroundColor: "rgba(153, 153, 153, 0.03)",
                                borderRadius: 6,
                            }}
                            value={showEditModal.name}
                            onChange={(e) => {
                                setShowEditModal({
                                    ...showEditModal,
                                    name: e.target.value,
                                });
                                // console.log(e.target.value)
                            }}
                        ></Input>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

const dummyData = [{}];

export default NewLibraryView;
