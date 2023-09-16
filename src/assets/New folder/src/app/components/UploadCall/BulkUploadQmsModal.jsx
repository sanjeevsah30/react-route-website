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
import { getDomain, showExtraFieldsForQms } from "@tools/helpers";
import { useGetManualQmsFieldsListQuery } from "@convin/redux/services/settings/qms.service";
import { getTimeZone } from "tools/helpers";

export default forwardRef(function BulkUploadQmsModal(props, ref) {
    const {
        common: { domain },
    } = useSelector((state) => state);
    const { data = [], isLoading: isLoadingQmsFields } =
        useGetManualQmsFieldsListQuery(undefined, {
            refetchOnMountOrArgChange: true,
        });
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [file, setFile] = useState(null);
    const [step, setStep] = useState(0);
    const [fileHeaders, setFileHeaders] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [fileUploaded, setFileUplaoded] = useState(null);

    const selectOptions = useMemo(() => {
        return [
            ...data
                ?.filter((e) => !e.is_disabled)
                .map((item) => {
                    return {
                        name: `${item.is_mandatory ? "*" : ""}${item.name}`,
                        id: item.type,
                        required: item.is_mandatory,
                    };
                }),
            {
                name: "Agent Team",
                id: "owner_team",
            },
            {
                name: "Agent First Name",
                id: "owner_first_name",
            },
            {
                name: "Agent Last Name",
                id: "owner_last_name",
            },
            {
                name: "User Id",
                id: "owner_primary_phone",
            },
        ];
    }, [domain, data]);

    useImperativeHandle(
        ref,
        () => {
            return {
                openBulkUpladQmsModal: () => {
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
            title={"Upload QMS Data"}
            visible={showUploadModal}
            onCancel={handleClose}
            centered
            width={1000}
            destroyOnClose
            footer={[
                <div></div>,
                <Button
                    type="primary"
                    disabled={!file || isLoading || isLoadingQmsFields}
                    loading={isLoading || isLoadingQmsFields}
                    onClick={() => {
                        if (step === 0) {
                            let data = new FormData();
                            data.append("upload_type", "MANUAL_QMS");
                            data.append("file", file);
                            data.append("mapping", null);
                            data.append("timezone", getTimeZone());
                            setIsLoading(true);
                            axiosInstance
                                .post("/feedback/bulk_upload/", data, {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                })
                                .then((res) => {
                                    if (res?.data?.id) {
                                        setFileUplaoded(res.data);
                                        setFileHeaders(res.data.mapping);
                                        setStep((prev) => prev + 1);
                                    }
                                    setIsLoading(false);
                                })
                                .catch((err) => {
                                    openNotification(
                                        "error",
                                        "Error",
                                        getError(err).message
                                    );
                                    setIsLoading(false);
                                });
                            // setStep((prev) => prev + 1);
                        } else if (step === 1 && fileUploaded?.id) {
                            const values = Object.values(fileHeaders).filter(
                                (e) => e
                            );
                            const requiredFields = selectOptions
                                .filter((e) => e.required)
                                .map((e) => e.id);
                            const isValid = requiredFields.every((e) =>
                                values.includes(e)
                            );
                            if (isValid) {
                                setIsLoading(true);
                                axiosInstance
                                    .patch(
                                        `/feedback/bulk_upload/${fileUploaded.id}/`,
                                        {
                                            mapping: fileHeaders,
                                        }
                                    )
                                    .then((res) => {
                                        openNotification(
                                            "success",
                                            "success",
                                            "Uploaded Successfully. Conversations will be created after sometime"
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
                            } else {
                                openNotification(
                                    "error",
                                    "error",
                                    "Make sure you have mapped all mandateory fields"
                                );
                            }
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
                        items={["Upload Data", "Mapping"]}
                        current={step}
                        setCurrent={(value) => {
                            // if (value === 1 && !file) return;
                            // setStep(value);
                        }}
                        alignment="vertical"
                    />
                </div>
                {step === 0 ? (
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
                ) : (
                    <div className="flex1">
                        <div className="bold600 font16 mine_saft_cl marginB13">
                            Mapping
                        </div>
                        <div className="dove_gray_cl marginB26">
                            Its helps to mapping uploaded files to manual QMS
                        </div>
                        <div className="bold600 font16 mine_saft_cl flex marginB16">
                            <div className="flex1">
                                Existing Field Names (Uploaded)
                            </div>
                            <div className="flex1">Manual QMS Fields</div>
                        </div>
                        {Object.keys(fileHeaders).map((e, id) => {
                            return (
                                <div key={id} className="flex marginB10">
                                    <div className="flex flex1 justifySpaceBetween alignCenter">
                                        <div
                                            style={{
                                                background:
                                                    "rgba(153, 153, 153, 0.2)",
                                            }}
                                            className="paddingTB10 flex1 borderRadius6 paddingL12"
                                        >
                                            {e}
                                        </div>
                                        <div className="marginLR16">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M4.1665 10H15.8332"
                                                    stroke="#666666"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M10 4.16669L15.8333 10L10 15.8334"
                                                    stroke="#666666"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex1 flex alignCenter">
                                        <CustomSelect
                                            data={
                                                selectOptions.find(
                                                    (a) =>
                                                        a.id === fileHeaders[e]
                                                )
                                                    ? [
                                                          ...selectOptions.filter(
                                                              (s) => {
                                                                  return !Object.values(
                                                                      fileHeaders
                                                                  ).includes(
                                                                      s.id
                                                                  );
                                                              }
                                                          ),
                                                          selectOptions.find(
                                                              (a) =>
                                                                  a.id ===
                                                                  fileHeaders[e]
                                                          ),
                                                      ]
                                                    : [
                                                          ...selectOptions.filter(
                                                              (s) => {
                                                                  return !Object.values(
                                                                      fileHeaders
                                                                  ).includes(
                                                                      s.id
                                                                  );
                                                              }
                                                          ),
                                                      ]
                                            }
                                            option_key={"id"}
                                            option_name={"name"}
                                            placeholder={"Default Response"}
                                            style={{
                                                height: "40px",
                                            }}
                                            value={fileHeaders?.[
                                                e
                                            ]?.toLowerCase()}
                                            onChange={(value) => {
                                                const temp = { ...fileHeaders };
                                                temp[e] = value;
                                                setFileHeaders(temp);
                                            }}
                                            allowClear
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Modal>
    );
});
