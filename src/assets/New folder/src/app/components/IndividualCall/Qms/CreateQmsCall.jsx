import {
    AutoComplete,
    Button,
    Collapse,
    DatePicker,
    Divider,
    Form,
    Input,
    Modal,
    Select,
    Skeleton,
    Space,
    TimePicker,
    Tooltip,
    TreeSelect,
} from "antd";
import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    flattenTeams,
    getName,
    secToTimeNew,
    showExtraFieldsForQms,
} from "@tools/helpers";
import { useHistory, useLocation } from "react-router-dom";
import {
    createManualQmsCallRequest,
    createUserQms,
} from "@store/auditSlice/auditSlice";

import apiErrors from "../../../ApiUtils/common/errors";
import { QMSActiveCallContext } from "./QmsView";
import PlusSvg from "app/static/svg/PlusSvg";
import CustomTabs from "../../Resuable/Tabs/CustomTabs";
import callsConfig from "@constants/MyCalls/index";
import moment from "moment";
import Icon from "@presentational/reusables/Icon";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import { openNotification, storeUsers } from "@store/common/actions";
import CloseSvg from "app/static/svg/CloseSvg";
import qms from "app/static/images/qms.png";
import { MeetingTypeConst } from "@container/Home/Home";
import InfoCircleSvg from "../../../static/svg/InfoCircleSvg";
import TagSelector from "./TagSelector";
import { useGetManualQmsFieldsListQuery } from "@convin/redux/services/settings/qms.service";
import { stripTags } from "@amcharts/amcharts5/.internal/core/util/Utils";

const { Panel } = Collapse;

const getTotalDuration = (d) => {
    if (duration) {
        return null;
    }
    const duration = new Date(d._d);
    const totalDuration =
        duration.getHours() * 3600 +
        duration.getMinutes() * 60 +
        duration.getSeconds();
    return totalDuration;
};

function CreateQmsCall() {
    const { data, isFetching } = useGetManualQmsFieldsListQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const { users, teams, versionData } = useSelector((state) => state.common);
    const { loading } = useSelector((state) => state.auditSlice);
    const {
        common: { domain, tags, call_types },
    } = useSelector((state) => state);
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [form] = Form.useForm();

    const [teamItems, setTeamItems] = useState([]);
    const [filteredNameOptions, setFilteredNameOptions] = useState([]);
    const [filteredEmailOptions, setFilteredEmailOptions] = useState([]);
    const [filteredPhoneOptions, setFilteredPhoneOptions] = useState([]);
    const [isTimeDisabled, setIsTimeDisabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    const onValuesChange = (value, all) => {
        if (value.hasOwnProperty("first_name")) {
            const foundUser = users.find(
                (item) => item.id === value.first_name
            );

            if (foundUser) {
                const tempFormData = {
                    team: flattenTeams(teams).find(
                        (item) => item.id === foundUser?.team
                    )?.id,
                    owner_email: foundUser?.owner_email,
                    primary_phone: foundUser?.primary_phone,
                };
                setFormData({
                    ...formData,
                    ...tempFormData,
                    first_name: foundUser?.first_name,
                });
                form.setFieldsValue({ ...all, ...tempFormData });
            } else {
                setFormData({
                    ...formData,
                    first_name: filteredNameOptions.find(
                        (item) => item.id === value.first_name
                    )?.first_name,
                });
            }
            return;
        }
        if (value.hasOwnProperty("owner_email")) {
            const foundUser = users.find(
                (item) => item?.id === value?.owner_email
            );

            if (foundUser) {
                const tempFormData = {
                    team: flattenTeams(teams).find(
                        (item) => item?.id === foundUser?.team
                    )?.id,
                    first_name: foundUser?.first_name,
                    primary_phone: foundUser?.primary_phone,
                };
                setFormData({
                    ...formData,
                    ...tempFormData,
                    owner_email: foundUser?.email,
                });
                form.setFieldsValue({ ...all, ...tempFormData });
            } else {
                setFormData({
                    ...formData,
                    owner_email: filteredEmailOptions.find(
                        (item) => item?.id === value?.owner_email
                    )?.owner_email,
                });
            }
            return;
        }
        if (value.hasOwnProperty("primary_phone")) {
            const foundUser = users.find(
                (item) => item.id === value.primary_phone
            );
            if (foundUser) {
                const tempFormData = {
                    team: flattenTeams(teams).find(
                        (item) => item.id === foundUser?.team
                    )?.id,
                    owner_email: foundUser?.owner_email,
                    first_name: foundUser?.first_name,
                };
                setFormData({
                    ...formData,
                    ...tempFormData,
                    primary_phone: foundUser.primary_phone.toString(),
                });
                form.setFieldsValue({ ...all, ...tempFormData });
            } else {
                setFormData({
                    ...formData,
                    primary_phone: filteredPhoneOptions
                        .find((item) => item?.id === value?.primary_phone)
                        ?.primary_phone.toString(),
                });
            }
            return;
        }
        if (value.hasOwnProperty("meeting_type")) {
            if (
                value.meeting_type.toLowerCase() === "email" ||
                value.meeting_type.toLowerCase() === "chat"
            ) {
                setIsTimeDisabled(true);
                const tempFormData = {
                    meeting_type: value.meeting_type,
                };
                setFormData({
                    ...formData,
                    ...tempFormData,
                });
                form.setFieldsValue({ ...all, ...tempFormData });
            } else {
                setIsTimeDisabled(false);
                setFormData({
                    ...formData,
                    meeting_type: value.meeting_type,
                });
            }
            return;
        }
        setFormData({
            ...formData,
            [Object.keys(value)[0]]: value[Object.keys(value)[0]],
        });
    };
    const { activeCall, setCall, isLoadingCall } =
        useContext(QMSActiveCallContext);

    const getValdationObject = () => {
        if (isTimeDisabled) {
            let temp = {};
            data !== undefined &&
                data
                    ?.filter((e) => !e.is_disabled && e.type !== "duration")
                    .forEach((item) => {
                        if (
                            item.is_mandatory &&
                            item.metadata.nature === "select" &&
                            (item.type === "tags" || item.type === "type")
                        ) {
                            temp[item.type] = Yup.array().required();
                        } else if (item.is_mandatory)
                            temp[item.type] = Yup.string().required();
                    });

            return temp;
        } else {
            let temp = {};
            data !== undefined &&
                data
                    ?.filter((e) => !e.is_disabled)
                    .forEach((item) => {
                        if (
                            item.is_mandatory &&
                            item.metadata.nature === "select" &&
                            (item.type === "tags" || item.type === "type")
                        ) {
                            temp[item.type] = Yup.array().required();
                        } else if (item.is_mandatory)
                            temp[item.type] = Yup.string().required();
                    });

            return temp;
        }
    };
    const validationSchema = Yup.object().shape(getValdationObject());

    const handleValidate = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });

            setErrors({});
            if (!validateEmail(formData.owner_email)) {
                return openNotification("error", "Email is not valid");
            }
            const payload = {};
            const tempArr = data.map((item) => item.type);
            Object.keys(formData)
                ?.filter((e) => tempArr.includes(e))
                .map((key) => {
                    if (
                        formData[key].hasOwnProperty("_isAMomentObject") &&
                        key === "start_time"
                    ) {
                        const start_time = new Date(formData.start_time);
                        payload[key] = start_time.toISOString();
                    } else if (
                        formData[key].hasOwnProperty("_isAMomentObject")
                    ) {
                        if (
                            key === "duration" &&
                            formData.meeting_type.toLowerCase() ===
                                MeetingTypeConst.calls.toLowerCase()
                        ) {
                            payload[key] = getTotalDuration(formData[key]);
                        } else if (key.includes("duration")) {
                            payload[key] = getTotalDuration(formData[key]);
                        } else {
                            const time = new Date(formData[key]);
                            payload[key] = time.toISOString();
                        }
                    } else if (key === "id") {
                        payload[key] = formData[key];
                        payload["title"] = formData[key];
                    } else {
                        payload[key] = formData[key];
                    }
                });
            dispatch(createManualQmsCallRequest(payload)).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) return;
                if (res?.payload?.id) {
                    setCall({
                        callId: res.payload.id,
                        callName: res.payload.title,
                        callType: callsConfig.COMPLETED_TYPE,
                        callDetails: res.payload,
                    });
                }
            });
        } catch (err) {
            const validationErrors = {};
            err.inner.forEach((error) => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
        }
    };
    const onFinishUserData = (values) => {
        const payload = {
            owner_first_name: values?.first_name,
            owner_email: values?.owner_email,
            owner_last_name: values?.last_name,
            owner_primary_phone: values?.primary_phone,
            team_id: values?.team,
        };
        dispatch(createUserQms(payload)).then((res) => {
            if (res.payload?.id) {
                const newUser = {
                    id: res.payload.id,
                    first_name: res.payload.first_name,
                    middle_name: res.payload.middle_name,
                    last_name: res.payload.last_name,
                    email: res.payload.email,
                    primary_phone: res.payload.primary_phone,
                    role: res.payload.role,
                    team: res.payload.team,
                };
                dispatch(storeUsers([...users, newUser]));
                setIsModalOpen(false);
                openNotification(
                    "success",
                    "Successfully Created",
                    "New user added successfully"
                );
            }
        });
    };

    useEffect(() => {
        setFilteredNameOptions(users);
        setFilteredEmailOptions(users);
        setFilteredPhoneOptions(users.filter((e) => e.primary_phone));
    }, [users]);

    useEffect(() => {
        setTeamItems(teams);
    }, [teams]);

    useEffect(() => {
        const { id } = activeCall;
        if (id) {
            history.push(
                `/${activeCall?.meeting_type || "call"}/qms/${activeCall?.id}${
                    location.search
                }`
            );
        }
    }, [activeCall.id, teams]);

    useEffect(() => {
        const { callName, callDetails, id } = activeCall;

        if (callDetails?.start_time)
            if (id) {
                const regexPattern = /^(\d{4}-\d{2}-\d{2})/;
                const retriveFormData = {};
                Object.keys(callDetails?.calendar?.raw).forEach((item) => {
                    if (item === "duration" || item.includes("duration")) {
                        retriveFormData[item] = moment(
                            secToTimeNew(callDetails?.calendar?.raw[item]),
                            "HH:mm:ss"
                        );
                        return;
                    }
                    if (regexPattern.test(callDetails?.calendar?.raw[item])) {
                        const localDate = new Date(
                            callDetails?.calendar?.raw[item]
                        );
                        retriveFormData[item] = moment(
                            localDate,
                            "YYYY-MM-DD HH:mm:ss"
                        );
                        return;
                    }
                    if (item === "tags") {
                        retriveFormData[item] = callDetails?.calendar?.raw[item]
                            .length
                            ? `+${callDetails?.calendar?.raw[item].length} selected`
                            : "No Tags Applied";
                        return;
                    }
                    if (item === "type") {
                        retriveFormData[item] = callDetails?.calendar?.raw[item]
                            .length
                            ? `+${callDetails?.calendar?.raw[item].length} selected`
                            : "No Types Applied";
                        return;
                    }
                    retriveFormData[item] = callDetails?.calendar?.raw[item];
                });

                form.setFieldsValue(retriveFormData);
            }
    }, [activeCall.id, teams]);

    const validateMessages = {
        required: "*Required!",
        types: {
            email: "${label} is not a valid email!",
            number: "${label} is not a valid number!",
        },
    };

    const [fields, setFields] = useState();

    const validateEmail = (email) => {
        var re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <div
            className="audit_container flex column flexShrink0"
            style={{
                gap: "24px",
                position: "relative",
            }}
        >
            <div className="call_form_info flexShrink0">
                {!activeCall.id ? (
                    <>
                        <div
                            className="paddingLR32 flex justifySpaceBetween alignCenter "
                            style={{
                                borderBottom:
                                    "1px solid rgba(153, 153, 153, 0.2)",
                            }}
                        >
                            <CustomTabs
                                navlink={false}
                                tabsList={[{ name: "Details", id: 1 }]}
                            />
                        </div>
                        {isLoadingCall || isFetching ? (
                            <Skeleton
                                active
                                paragraph={{ rows: 5 }}
                                title={false}
                                style={{ padding: "10px" }}
                            />
                        ) : (
                            <Form
                                className="form_body paddingLR32 paddingT32 paddingB24"
                                onValuesChange={onValuesChange}
                                onFinish={handleValidate}
                                form={form}
                                disabled={!!activeCall?.callId}
                                validateMessages={validateMessages}
                                fields={fields}
                                layout={"vertical"}
                                onFieldsChange={(_, allFields) => {
                                    setFields(allFields);
                                }}
                            >
                                <Form.Item className="submit_button">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        className="borderRadius4"
                                    >
                                        Save
                                    </Button>
                                </Form.Item>

                                {data
                                    ?.filter((e) => !e.is_disabled)
                                    .map(
                                        ({
                                            name,
                                            is_mandatory,
                                            metadata,
                                            type,
                                            description,
                                        }) => {
                                            let options = [];
                                            if (
                                                metadata.choices !== undefined
                                            ) {
                                                options = metadata.choices.map(
                                                    (item) => ({
                                                        value: item,
                                                        label: item,
                                                    })
                                                );
                                            }
                                            return (
                                                <Form.Item
                                                    noStyle={false}
                                                    key={name}
                                                    label={
                                                        <div className="flex alignCenter font12">
                                                            <span>{name}</span>
                                                            {description.length ? (
                                                                <Tooltip
                                                                    title={
                                                                        description
                                                                    }
                                                                >
                                                                    <InfoCircleSvg
                                                                        style={{
                                                                            transform:
                                                                                "scale(0.7)",
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    }
                                                    name={type}
                                                    rules={[
                                                        {
                                                            required:
                                                                isTimeDisabled &&
                                                                type ===
                                                                    "duration"
                                                                    ? !isTimeDisabled
                                                                    : is_mandatory,
                                                        },
                                                    ]}
                                                >
                                                    {metadata.nature ===
                                                    "text_field" ? (
                                                        <Input className="form_input" />
                                                    ) : metadata.nature ===
                                                          "select" &&
                                                      type === "owner_email" ? (
                                                        <Select
                                                            suffixIcon={<></>}
                                                            optionFilterProp="children"
                                                            showSearch={true}
                                                            // onSearch={onEmailChange}
                                                            type={"email"}
                                                            className="agent_dropdown"
                                                            dropdownRender={(
                                                                menu
                                                            ) => (
                                                                <>
                                                                    <Space
                                                                        style={{
                                                                            padding:
                                                                                "17px 10px 6px 17px",
                                                                        }}
                                                                    >
                                                                        <span
                                                                            className="primary curPoint"
                                                                            onClick={() =>
                                                                                setIsModalOpen(
                                                                                    true
                                                                                )
                                                                            }
                                                                        >
                                                                            <PlusSvg />{" "}
                                                                            ADD
                                                                            USER
                                                                        </span>
                                                                    </Space>
                                                                    {menu}
                                                                </>
                                                            )}
                                                        >
                                                            {filteredEmailOptions.map(
                                                                (item) => (
                                                                    <AutoComplete.Option
                                                                        value={
                                                                            item.id
                                                                        }
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        className="padding10"
                                                                    >
                                                                        {getName(
                                                                            item
                                                                        )}
                                                                        <div className=""></div>
                                                                        {
                                                                            item.email
                                                                        }
                                                                        <div className=""></div>
                                                                        {
                                                                            item?.primary_phone
                                                                        }
                                                                    </AutoComplete.Option>
                                                                )
                                                            )}
                                                        </Select>
                                                    ) : metadata.nature ===
                                                          "select" &&
                                                      type === "tags" ? (
                                                        <TreeSelect
                                                            treeCheckable
                                                            showArrow={true}
                                                            showCheckedStrategy={
                                                                TreeSelect.SHOW_CHILD
                                                            }
                                                            tagRender={"okay"}
                                                            showSearch
                                                            // value={[1, 2, 3, 4]}
                                                            treeData={tags?.map(
                                                                (e) => ({
                                                                    ...e,
                                                                    name: e.tag_name,
                                                                })
                                                            )}
                                                            placeholder="Select Tags"
                                                            select_placeholder="Select Tags"
                                                            style={{
                                                                width: "100px",
                                                                height: "auto",
                                                                padding: "0",
                                                            }}
                                                            fieldNames={{
                                                                label: "name",
                                                                value: "id",
                                                            }}
                                                            option_name="name"
                                                            type="type"
                                                            treeNodeFilterProp="name"
                                                            popupClassName={
                                                                "custom_select_dropdown tree_tag_selector_dropdown"
                                                            }
                                                            allowClear={false}
                                                            maxTagCount={0}
                                                            dropdownRender={(
                                                                menu
                                                            ) => {
                                                                return (
                                                                    <>{menu}</>
                                                                );
                                                            }}
                                                            suffixIcon={<></>}
                                                        />
                                                    ) : metadata.nature ===
                                                          "select" &&
                                                      type === "type" ? (
                                                        <TreeSelect
                                                            treeCheckable
                                                            showArrow={true}
                                                            showCheckedStrategy={
                                                                TreeSelect.SHOW_CHILD
                                                            }
                                                            showSearch
                                                            treeData={call_types?.map(
                                                                (e) => ({
                                                                    ...e,
                                                                    name: e.type,
                                                                })
                                                            )}
                                                            placeholder="Select Types"
                                                            select_placeholder="Select Types"
                                                            style={{
                                                                width: "100px",
                                                                height: "auto",
                                                                padding: "0",
                                                            }}
                                                            fieldNames={{
                                                                label: "name",
                                                                value: "id",
                                                            }}
                                                            option_name="name"
                                                            type="type"
                                                            treeNodeFilterProp="name"
                                                            popupClassName={
                                                                "custom_select_dropdown tree_tag_selector_dropdown"
                                                            }
                                                            allowClear={false}
                                                            maxTagCount={0}
                                                            dropdownRender={(
                                                                menu
                                                            ) => {
                                                                return (
                                                                    <>{menu}</>
                                                                );
                                                            }}
                                                            suffixIcon={<></>}
                                                        />
                                                    ) : metadata.nature ===
                                                      "select" ? (
                                                        <Select
                                                            className="form_input"
                                                            suffixIcon={<></>}
                                                            options={options}
                                                        />
                                                    ) : metadata.nature ===
                                                          "date_time" &&
                                                      metadata.date_time ===
                                                          "date" ? (
                                                        <DatePicker
                                                            className="form_input"
                                                            placeholder={""}
                                                            format={
                                                                "YYYY-MM-DD"
                                                            }
                                                        />
                                                    ) : metadata.nature ===
                                                          "date_time" &&
                                                      metadata.date_time ===
                                                          "both" ? (
                                                        <DatePicker
                                                            className="form_input"
                                                            placeholder={""}
                                                            showTime={true}
                                                            format={
                                                                "YYYY-MM-DD HH:mm:ss"
                                                            }
                                                        />
                                                    ) : metadata.nature ===
                                                          "date_time" &&
                                                      metadata.date_time ===
                                                          "time" ? (
                                                        <TimePicker
                                                            className="form_input"
                                                            placeholder={""}
                                                            disabled={
                                                                type ===
                                                                "duration"
                                                                    ? isTimeDisabled
                                                                    : false
                                                            }
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                </Form.Item>
                                            );
                                        }
                                    )}
                            </Form>
                        )}
                    </>
                ) : (
                    <Collapse
                        className="bold600 font16"
                        expandIconPosition={"right"}
                        bordered={false}
                        expandIcon={({ isActive }) =>
                            isActive ? <ChevronUpSvg /> : <ChevronDownSvg />
                        }
                    >
                        <Panel showArrow={true} header="Details" key="1">
                            <Form
                                className="form_body paddingLR32 paddingT32 paddingB24"
                                form={form}
                                disabled={!!activeCall?.callId}
                                style={{ borderTop: "1px solid #99999933" }}
                                layout={"vertical"}
                            >
                                {data
                                    ?.filter((e) => !e.is_disabled)
                                    .map(({ name, metadata, type }) => {
                                        return (
                                            <Form.Item
                                                noStyle={false}
                                                key={name}
                                                label={
                                                    <div className="flex alignCenter font12">
                                                        <span>{name}</span>
                                                        <InfoCircleSvg
                                                            style={{
                                                                transform:
                                                                    "scale(0.7)",
                                                            }}
                                                        />
                                                    </div>
                                                }
                                                name={type}
                                            >
                                                {metadata.nature ===
                                                "text_field" ? (
                                                    <Input className="form_input" />
                                                ) : metadata.nature ===
                                                      "select" &&
                                                  type === "tags" ? (
                                                    <Select
                                                        className="form_input"
                                                        value={
                                                            selectedTags.length
                                                                ? `+${selectedTags.length} selected`
                                                                : "No Tags Applied"
                                                        }
                                                        suffixIcon={<></>}
                                                    />
                                                ) : metadata.nature ===
                                                      "select" &&
                                                  type === "type" ? (
                                                    <Select
                                                        className="form_input"
                                                        suffixIcon={<></>}
                                                        // value={
                                                        //     selectedTypes.length
                                                        //         ? `+${selectedTypes.length} selected`
                                                        //         : "No Types Applied"
                                                        // }
                                                    />
                                                ) : metadata.nature ===
                                                  "select" ? (
                                                    <Select
                                                        className="form_input"
                                                        suffixIcon={<></>}
                                                    />
                                                ) : metadata.nature ===
                                                      "date_time" &&
                                                  metadata.date_time ===
                                                      "both" ? (
                                                    <DatePicker
                                                        className="form_input"
                                                        placeholder={""}
                                                        showTime={true}
                                                        format={
                                                            "YYYY-MM-DD HH:mm:ss"
                                                        }
                                                    />
                                                ) : metadata.nature ===
                                                      "date_time" &&
                                                  metadata.date_time ===
                                                      "date" ? (
                                                    <DatePicker
                                                        className="form_input"
                                                        placeholder={""}
                                                        format={"YYYY-MM-DD"}
                                                    />
                                                ) : metadata.nature ===
                                                      "date_time" &&
                                                  metadata.date_time ===
                                                      "time" ? (
                                                    <TimePicker
                                                        className="form_input"
                                                        placeholder={""}
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </Form.Item>
                                        );
                                    })}
                            </Form>
                        </Panel>
                    </Collapse>
                )}
            </div>
            {window.location.pathname === "/call/qms" && (
                <div>
                    <img src={qms} alt="" />
                </div>
            )}
            <Modal
                title="Add User"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                closeIcon={<CloseSvg />}
                footer={null}
                className="createUserQmsModel"
            >
                <Form
                    layout="vertical"
                    className="flex"
                    style={{ gap: "25px" }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinishUserData}
                    autoComplete="off"
                >
                    <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!",
                            },
                        ]}
                    >
                        <Input
                            className="form_input"
                            placeholder="Enter user first name"
                        />
                    </Form.Item>
                    <Form.Item label="Last Name" name="last_name">
                        <Input
                            className="form_input"
                            placeholder="Enter user last name"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: "email",
                                message: "Please input valid email!",
                            },
                        ]}
                    >
                        <Input
                            className="form_input"
                            placeholder="Enter your email"
                        />
                    </Form.Item>
                    <Form.Item
                        label="User ID"
                        name="primary_phone"
                        rules={[
                            {
                                required: true,
                                message: "Please input valid user ID!",
                            },
                        ]}
                    >
                        <Input
                            className="form_input"
                            placeholder="Enter user user ID"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Team"
                        name="team"
                        rules={[
                            {
                                required: true,
                                message: "Please input valid team!",
                            },
                        ]}
                    >
                        <Select
                            className="form_input"
                            placeholder="Select team"
                            suffixIcon={<></>}
                            optionFilterProp="children"
                            showSearch={true}
                            dropdownRender={(menu) => <>{menu} </>}
                            style={{ textTransform: "intial" }}
                            placement="bottomLeft"
                        >
                            {flattenTeams(teams).map((item) => (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="add_user_btn"
                        >
                            ADD USER
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default CreateQmsCall;
