import { Button, Input, Modal, Select, Tooltip, DatePicker } from "antd";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import TopbarConfig from "@constants/Topbar/index";
import callsConfig from "@constants/MyCalls/index";
import { DropnUpload } from "@presentational/reusables/index";
import { useDispatch, useSelector } from "react-redux";
import * as commonActions from "@store/common/actions";
import { PlusOutlined } from "@ant-design/icons";
import { uploadNewCall } from "@store/calls/actions";
import DebounceSelect from "../Search/DebounceSelect";
import * as callApis from "@apis/calls/index";
import apiErrors from "@apis/common/errors";
import UploadSvg from "app/static/svg/UploadSvg";
import CloseSvg from "app/static/svg/CloseSvg";
import { hasVoicePrint } from "@apis/voice/index";
import RecordingsManager from "@container/Settings/RecordingsManager/index";

const { Option } = Select;

export default forwardRef(function UploadCall(props, ref) {
    const { TextArea } = Input;
    const initError = {
        name: false,
        agenda: false,
        tags: false,
        callType: false,
        client: false,
        file: false,
        rep: false,
    };

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const allClients = useSelector((state) => state.common.clients || []);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [error, setError] = useState(initError);
    const [file, setFile] = useState("");
    const [uploadProgress, setUploadProgress] = useState({
        value: 0,
        isError: false,
    });
    const [callName, setCallName] = useState("");
    const [callAgenda, setCallAgenda] = useState("");
    const [selectedClient, setSelectedClient] = useState(undefined);
    const [newClient, setNewClient] = useState("");
    const [voicePrintAvailable, setVoicePrintAvailable] = useState(false);
    const [showVoicePrintModal, setShowVoicePrintModal] = useState(false);
    const allReps = useSelector((state) => state.common.users || []);
    const [repId, setRepId] = useState(undefined);

    const [datetime, setDatetime] = useState(null);

    const clientRef = useRef(null);

    useImperativeHandle(
        ref,
        () => {
            return {
                openUpladCallModal() {
                    handlers.toggleUploadModal();
                },
            };
        },
        []
    );

    useEffect(() => {
        if (!allClients.length && showUploadModal) {
            dispatch(commonActions.getClients({}));
        }
    }, [showUploadModal]);
    useEffect(() => {
        hasVoicePrint(domain).then((res) => {
            if (res.recording) {
                setVoicePrintAvailable(true);
            }
        });
    }, []);

    const handlers = {
        toggleUploadModal: () => {
            setShowUploadModal((prev) => !prev);
        },
        getFile: (file) => {
            setFile(file);
            setError({
                ...error,
                file: false,
            });
        },
        handleRepChange: (value) => {
            setRepId(value);
            setError({
                ...error,
                rep: false,
            });
        },

        handleCallClientChange: (value) => {
            setSelectedClient(value);
            setError({
                ...error,
                client: false,
            });
        },
        handleCallAgendaChange: ({ target: { value } }) => {
            setCallAgenda(value);
            setError({
                ...error,
                agenda: false,
            });
        },
        handleCallNameChange: ({ target: { value } }) => {
            setCallName(value);
            setError({
                ...error,
                name: false,
            });
        },
        handleCreateClient: () => {
            if (!newClient) {
                return;
            }
            const emailRegx =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let clientData;
            if (!emailRegx.test(newClient)) {
                clientData = { first_name: newClient };
            } else {
                clientData = { email: newClient };
            }
            dispatch(commonActions.createClient(clientData)).then((res) => {
                if (!res.status) {
                    setSelectedClient(res.id);
                    setNewClient("");
                }
            });
            setError({
                ...error,
                client: false,
            });
            // clientRef.current.blur();
        },
        uploadCall: () => {
            if (handlers.validateModal()) {
                let data = new FormData();
                data.append("summary", callName);
                data.append("description", callAgenda);
                data.append("media", file);
                data.append("creator_email", user.email);
                data.append("organizer_email", user.email);
                data.append("owner", repId);
                if (selectedClient) data.append("client", selectedClient);
                data.append("start_time", datetime);
                dispatch(uploadNewCall(data, handlers.updateCallProgress)).then(
                    (res) => {
                        if (res.status) {
                            setUploadProgress({
                                ...uploadProgress,
                                isError: true,
                            });
                        } else {
                            setUploadProgress({
                                value: 0,
                                isError: false,
                            });
                            handlers.reInitModal();
                        }
                    }
                );
            }
        },
        validateModal: () => {
            let errors = Object.assign({}, error);
            let isValid = true;
            if (!callName) {
                errors.name = true;
                isValid = false;
            }
            if (!callAgenda) {
                errors.agenda = true;
                isValid = false;
            }
            if (domain?.toLowerCase() === "planetspark" && !selectedClient) {
                errors.client = true;
                isValid = false;
            }
            if (!repId) {
                errors.rep = true;
                isValid = false;
            }
            if (!file) {
                errors.file = true;
                isValid = false;
            }
            if (!datetime) {
                errors.datetime = true;
                isValid = false;
            }
            setError(errors);
            return isValid;
        },
        updateCallProgress: (progress) => {
            setUploadProgress({
                value: progress,
                isError: false,
            });
        },
        reInitModal: () => {
            setCallName("");
            setCallAgenda("");
            setSelectedClient(undefined);
            setFile(null);
            setValue(undefined); // debounced client
            dispatch(commonActions.getClients({})); // get clients again
            setShowUploadModal(false);
            setRepId(undefined);
        },
    };

    const [value, setValue] = useState([]);

    const { nextClientsUrl, salesTaskNextLoading, domain } = useSelector(
        (state) => state.common
    );

    async function fetchClientList(query) {
        return callApis.getClients(domain, query).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                commonActions.openNotification("error", "Error", res.message);
            } else {
                dispatch(commonActions.storeClients(res));
                return res.results.map((client) => ({
                    label:
                        client.first_name ||
                        client.email ||
                        client.company_name ||
                        client.id.toString(),
                    value: client.id,
                }));
            }
        });
    }

    const loadMore = (e) => {
        const { target } = e;

        if (
            target.scrollTop + target.offsetHeight === target.scrollHeight &&
            nextClientsUrl &&
            !salesTaskNextLoading
        ) {
            dispatch(commonActions.getClients({ next_url: nextClientsUrl }));
        }
    };

    const NotFoundContent = () => {
        return (
            <div
                style={{
                    display: "flex",
                    flexWrap: "nowrap",
                }}
            >
                <Button type={"link"} onClick={handlers.handleCreateClient}>
                    <PlusOutlined /> Create New Client
                </Button>
            </div>
        );
    };

    const getClientName = ({ first_name, email, company_name, id }) => {
        if (first_name) {
            if (email) {
                return `${first_name} (${email})`;
            }
            if (company_name) {
                return `${first_name} (${company_name})`;
            }
            return first_name;
        }
        return email || company_name || id.toString();
    };

    // For date picker
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const onDateChange = (value, dateString) => {
        onDateOk(value);
    };

    const onDateOk = (value) => {
        const startDate = new Date(value._d).toISOString();
        setDatetime(startDate);
    };

    return (
        <>
            <Modal
                wrapClassName="upload_call_modal"
                title={callsConfig.UPLOAD_CALL.modalTile}
                visible={showUploadModal}
                onOk={handlers.toggleUploadModal}
                onCancel={handlers.toggleUploadModal}
                centered
                width={900}
                destroyOnClose
                footer={[
                    <div></div>,
                    <Button
                        key="submit"
                        className={"uploadCall-upload borderRadius5"}
                        type="primary"
                        onClick={handlers.uploadCall}
                        shape={"round"}
                        disabled={!voicePrintAvailable}
                    >
                        {callsConfig.UPLOAD_CALL.uploadCtaLabel}
                    </Button>,
                ]}
                className="homepage_modal"
                closeIcon={<CloseSvg />}
            >
                {!voicePrintAvailable && (
                    <div className="paddingLR16 flex alignCenter marginB12">
                        <p className="marginR8 text-bolder bitter_sweet_cl">
                            Please setup voice print to upload call. This helps
                            in processing call.
                        </p>
                        <Button
                            type="primary"
                            className="text-bolder br4"
                            onClick={() => setShowVoicePrintModal(true)}
                        >
                            SETUP NOW
                        </Button>
                    </div>
                )}
                <div className={"uploadCall-container"}>
                    <div className={"uploadCall-container-left"}>
                        <div
                            className={
                                "uploadCall-name uploadCall-modal-section"
                            }
                        >
                            <Input
                                value={callName}
                                onChange={handlers.handleCallNameChange}
                                className={`call_name ${
                                    error.name ? "error" : ""
                                }`}
                                placeholder={
                                    callsConfig.CALLCARD_CALLNAME_LABEL
                                }
                            />
                        </div>
                        <div
                            className={
                                "uploadCall-recp uploadCall-modal-section"
                            }
                        >
                            <DebounceSelect
                                value={value}
                                placeholder={
                                    callsConfig.UPLOAD_CALL.chooseClientLabel
                                }
                                fetchOptions={fetchClientList}
                                handleSearch={(val) => {
                                    setNewClient(val);
                                }}
                                onChange={(client) => {
                                    setValue(client);
                                    handlers.handleCallClientChange(
                                        client?.value
                                    );
                                }}
                                optionFilterProp="children"
                                optionsArr={
                                    allClients?.length
                                        ? allClients.map((client) => ({
                                              label: getClientName(client),
                                              value: client.id,
                                              id: client.id,
                                          }))
                                        : []
                                }
                                nextLoading={salesTaskNextLoading}
                                loadMore={loadMore}
                                onClear={() =>
                                    dispatch(commonActions.getClients({}))
                                }
                                NotFoundContent={NotFoundContent}
                                className={error.client ? "error" : ""}
                            />
                        </div>
                        {/* Date Picker */}
                        <div
                            className={
                                "uploadCall-recp uploadCall-modal-section"
                            }
                        >
                            <DatePicker
                                showTime
                                onChange={onDateChange}
                                onOk={onDateOk}
                                className={error.datetime ? "error" : ""}
                                style={{
                                    height: "40px",
                                    borderRadius: "10px",
                                }}
                                disabledDate={(current) => {
                                    return current.valueOf() > Date.now();
                                }}
                            />
                        </div>
                    </div>
                    <div className={"uploadCall-container-right"}>
                        <div
                            className={
                                "uploadCall-callType uploadCall-modal-section"
                            }
                        >
                            <Select
                                className={error.rep ? "error" : ""}
                                value={repId}
                                placeholder={"Select owner"}
                                onChange={handlers.handleRepChange}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                                optionFilterProp="children"
                            >
                                <Option disabled>-Select Owner-</Option>
                                {allReps.map((rep) => (
                                    <Option key={rep.id} value={rep.id}>
                                        {rep?.first_name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div
                            className={
                                "uploadCall-callAgenda uploadCall-modal-section"
                            }
                        >
                            <TextArea
                                className={error.agenda ? "error" : ""}
                                value={callAgenda}
                                onChange={handlers.handleCallAgendaChange}
                                placeholder={callsConfig.CALLCARD_AGENDA_LABEL}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </div>
                    </div>
                    <div className={"horizontalline"}></div>
                    <div className={"uploadCall-container-bottom"}>
                        <DropnUpload
                            className={error.file ? "error" : ""}
                            getfile={handlers.getFile}
                            dropzoneBtnLabel={
                                callsConfig.UPLOAD_CALL.dropzoneBtnLabel
                            }
                            uploadFileMsg={
                                callsConfig.UPLOAD_CALL.uploadFileMsg
                            }
                            acceptedFormats={
                                callsConfig.UPLOAD_CALL.acceptedFormats
                            }
                            allowedFormatsLabel={
                                callsConfig.UPLOAD_CALL.allowedFormatsLabel
                            }
                            uploadProgress={uploadProgress}
                            file={file}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                wrapClassName="upload_call_modal"
                // title={callsConfig.UPLOAD_CALL.modalTile}
                visible={showVoicePrintModal}
                onOk={() => setShowVoicePrintModal(false)}
                onCancel={() => setShowVoicePrintModal(false)}
                centered
                destroyOnClose
                footer={null}
                className="upload__voicePrint"
                closeIcon={<CloseSvg />}
            >
                <RecordingsManager
                    isOnSetup={true}
                    onSaveRecording={() => {
                        setShowVoicePrintModal(false);
                        setVoicePrintAvailable(true);
                    }}
                />
            </Modal>
            {/* <Tooltip title={TopbarConfig.UPLOADTEXT}>
                <Button
                    className="upload-call"
                    shape="round"
                    icon={<UploadSvg />}
                    type="link"
                    onClick={handlers.toggleUploadModal}
                />
            </Tooltip> */}
        </>
    );
});
