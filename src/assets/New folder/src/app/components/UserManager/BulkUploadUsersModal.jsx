import CloseSvg from "@container/Settings/MomentsSettings/CloseSvg";
import { Button, Modal } from "antd";
import React, { forwardRef, useMemo } from "react";
import { useImperativeHandle } from "react";
import { useState } from "react";
import UploadTempSvg from "app/static/svg/UploadTempSvg";
import Papa from "papaparse";
import Steps from "@presentational/reusables/Steps";
import { CustomSelect } from "../Resuable/index";
import { axiosInstance } from "@apis/axiosInstance";
import { openNotification } from "../../../store/common/actions";
import { getError } from "../../ApiUtils/common";
import { useSelector } from "react-redux";
import ArrowAnchorSvg from "app/static/svg/ArrowAnchorSvg";

export default forwardRef(function BulkUploadUsersModal(props, ref) {
    const {
        common: { domain },
    } = useSelector((state) => state);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [file, setFile] = useState(null);
    const [step, setStep] = useState(0);
    const [fileHeaders, setFileHeaders] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [fileUploaded, setFileUplaoded] = useState(null);
    const { downloadUserData } = props;

    const selectOptions = useMemo(() => {
        return [
            {
                name: "*First Name",
                id: "agent_name",
                required: true,
            },
            {
                name: "*Email",
                id: "agent_email",
                required: true,
            },
            {
                name: "*role",
                id: "role",
                required: true,
            },
            {
                name: "team",
                id: "team_name",
                required: true,
            },
            {
                name: "Manager Email",
                id: "manager_email",
                required: true,
            },
            {
                name: "User Id",
                id: "primary_phone",
                required: true,
            },
            {
                name: "User Type",
                id: "user_type_name",
            },
            {
                name: "License",
                id: "subscription_namw",
            },
        ];
    }, [domain]);

    useImperativeHandle(
        ref,
        () => {
            return {
                openBulkUpladUserModal: () => {
                    setShowUploadModal(true);
                },
            };
        },
        []
    );

    function uploadCsvHandler(event) {
        if (event.target.files[0] !== undefined) {
            const maxAllowedSize = 10 * 1024 * 1024;
            if (event.target.files[0].size > maxAllowedSize) {
                // Here you can ask your users to load correct file
                event.target.value = "";
                return openNotification(
                    "error",
                    "Error",
                    "Upload a file whose size is less than 10 mb"
                );
            }
            setFile(event.target.files[0]);
            Papa.parse(event.target.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const parsedData = results.data;
                    if (parsedData.length) {
                        let keys = Object.keys(parsedData[0]);
                        let temp = {};
                        keys.forEach((e) => {
                            if (!temp[e]) {
                                temp[e] = null;
                            }
                        });
                        setFileHeaders(temp);
                    }
                },
            });
        } else {
            setFile(null);
        }
    }

    const handleClose = () => {
        setShowUploadModal(false);
        setFileHeaders({});
        setFileUplaoded(null);
        setStep(0);
        setFile(null);
    };

    return (
        <Modal
            wrapClassName="upload_call_modal"
            title={"Upload Users Data"}
            visible={showUploadModal}
            onCancel={handleClose}
            centered
            width={1000}
            destroyOnClose
            footer={[
                <div></div>,
                <Button
                    type="primary"
                    disabled={step == 1 ? !file || isLoading : false}
                    loading={isLoading}
                    onClick={() => {
                        if (step === 0) setStep((prev) => prev + 1);
                        else if (step == 1) {
                            let data = new FormData();
                            data.append("file", file);
                            data.append("mapping", null);
                            data.append("upload_type", "USER_LIST");
                            setIsLoading(true);
                            axiosInstance
                                .post("/feedback/bulk_upload/", data)
                                .then((res) => {
                                    openNotification(
                                        "success",
                                        "success",
                                        "Uploaded Successfully. Users will be created after sometime"
                                    );
                                    setIsLoading(false);
                                    handleClose();
                                })
                                .catch((err) => {
                                    openNotification(
                                        "error",
                                        "Error",
                                        getError(err).message
                                    );
                                    setIsLoading(false);
                                });
                        }
                    }}
                >
                    {step ? "Upload" : "Next"}
                </Button>,
            ]}
            className="homepage_modal"
            closeIcon={
                <div className="flex alignCenter justifyCenter height100p">
                    <CloseSvg />
                </div>
            }
        >
            <div className="flex">
                <div className="marginR40">
                    <Steps
                        items={["Add/Edit Users", "Upload Data"]}
                        current={step}
                        setCurrent={(value) => {
                            if (value === 1 && !file) return;
                            setStep(value);
                        }}
                        alignment="vertical"
                    />
                </div>
                {step === 0 ? (
                    <>
                        {" "}
                        <div>
                            <div className="marginB20">
                                <p className="bold600 font18">
                                    Add or Edit Users
                                </p>
                                <p className="bold400 font14 dove_gray_cl">
                                    To upload new users or edit existing users,
                                    please follow the steps below.
                                </p>
                            </div>
                            <div className="">
                                <p className="bold400 font16 dove_gray_cl">
                                    <span className="bold600 mine_shaft_cl ">
                                        Step 1:
                                    </span>{" "}
                                    Download the existing user data from{" "}
                                    <a
                                        className="bold600"
                                        style={{ color: "#1A62F2" }}
                                        onClick={() => {
                                            downloadUserData();
                                        }}
                                    >
                                        here{" "}
                                        <ArrowAnchorSvg
                                            style={{ transform: "scale(0.6)" }}
                                        />
                                    </a>
                                </p>
                                <p className="bold400 font16 dove_gray_cl">
                                    <span className="bold600 mine_shaft_cl ">
                                        Step 2:
                                    </span>{" "}
                                    Add new users or edit existing users in the
                                    file which you have downloaded from previous
                                    step.
                                </p>
                            </div>
                            <div
                                className="marginTB20   "
                                style={{
                                    border: "1px solid rgba(153, 153, 153, 0.2)",
                                }}
                            ></div>

                            <p className="bold400 font16 ">
                                Detailed Instructions:{" "}
                            </p>

                            <ol className="list-decimal ml-6 ">
                                <li className="bold600 font16 padding10">
                                    {" "}
                                    <p>Create/Edit Users</p>
                                    <ul className="bold400 font16 dove_gray_cl list-disc ml-6 ">
                                        <li>
                                            To create a new user, fill all the
                                            details in a new excel row and
                                            upload.
                                        </li>
                                        <li>
                                            To modify details for existing user,
                                            make changes in the respective
                                            fields and upload.
                                        </li>
                                    </ul>
                                </li>

                                <li className="bold600 font16 padding10">
                                    <p>Activate/Deactivate Users</p>

                                    <ul className="bold400 font16 dove_gray_cl list-disc ml-6">
                                        <li>
                                            If user enters{" "}
                                            <span className="bold600">
                                                ‘Active’
                                            </span>{" "}
                                            in the Active/Inactive field or
                                            leaves it empty, those users will be
                                            marked as active
                                        </li>
                                        <li>
                                            If a user enters{" "}
                                            <span className="bold600">
                                                ‘Inactive’{" "}
                                            </span>{" "}
                                            in the Active/Inactive field, those
                                            users will get deactivated.
                                        </li>
                                        <li>
                                            {" "}
                                            If a user deletes an entry in the
                                            file, those users will get
                                            deactivated.
                                        </li>
                                    </ul>
                                </li>

                                <li className="bold600 font16 padding10">
                                    {" "}
                                    <p>
                                        Email ID cannot be changed from data
                                        upload method{" "}
                                    </p>
                                    <ul className="bold400 font16 dove_gray_cl list-disc ml-6">
                                        <li>
                                            It can be changed from the user
                                            manager.
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </>
                ) : (
                    <div className="flex1">
                        <div className="browse_file_container flex alignCenter column paddingTB12 flex1">
                            <UploadTempSvg />
                            <div
                                className="body_container bold600 font18"
                                style={{ textAlign: "center" }}
                            >
                                <label
                                    className="browse_btn primary_cl curPoint"
                                    htmlFor="file"
                                >
                                    Browse Excel/CSV File
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    style={{ display: "none" }}
                                    multiple={true}
                                    onChange={uploadCsvHandler}
                                    onClick={(e) => {
                                        e.target.value = "";
                                    }} // this is to remove the privious selected files
                                    accept=".xlsx, .xls, .csv"
                                />
                                <div className="dusty_gray_cl bold400 font12">
                                    Max. File Size : 10mb
                                </div>
                            </div>
                        </div>
                        {file ? (
                            <div
                                className="flex paddingTB20 paddingLR12 justifySpaceBetween marginT20"
                                style={{
                                    background: "rgba(153, 153, 153, 0.1)",
                                    maxWidth: "430px",
                                    borderRadius: "6px",
                                }}
                            >
                                <div className="left flex alignCenter min_width_0_flex_child width70p">
                                    <span className="title elipse_text mine_shaft_cl">
                                        {file.name}
                                    </span>
                                    <span className="file_size dusty_gray_cl marginR36 marginL15">{`(${Number(
                                        (file.size / 1000000).toFixed(2)
                                    )}mb)`}</span>
                                    <span
                                        className="flex alignCenter"
                                        style={{
                                            border: "1px solid #999999",
                                            height: "20px",
                                            minWidth: "120px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: `100%`,
                                                height: "14px",
                                                margin: "2px",
                                                backgroundColor: "#1A62F2",
                                            }}
                                        ></span>
                                    </span>
                                </div>
                                <div className="curPoint flex alignCenter marginL15">
                                    <CloseSvg
                                        style={{
                                            color: "#666",
                                            transform: "scale(0.75)",
                                            marginRight: "0.75rem",
                                        }}
                                        onClick={() => {
                                            setFile(null);
                                            setFileHeaders({});
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
});
