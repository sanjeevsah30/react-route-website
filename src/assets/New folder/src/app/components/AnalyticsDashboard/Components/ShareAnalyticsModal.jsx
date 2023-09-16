import apiErrors from "@apis/common/errors";
import { shareAnalytics } from "@apis/sharer/index";
import { HomeContext } from "@container/Home/Home";
import CloseSvg from "@container/Settings/MomentsSettings/CloseSvg";
import { openNotification } from "@store/common/actions";
import { prepareSearchData } from "@store/search/utils";
import { Alert, Modal, notification, Select, Input, Switch } from "antd";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import CircleInfoSvg from "app/static/svg/CircleInfoSvg";
import LinkSvg from "app/static/svg/LinkSvg";
import MailSvg from "app/static/svg/MailSvg";
import { TickSvg } from "app/static/svg/TickSvg";

const { TextArea } = Input;

export default function ShareAnalyticsModal({ showShare, setShowShare }) {
    const { meetingType } = useContext(HomeContext);

    const [form, setForm] = useState({
        comment: "",
        emails: [],
        isPublic: false,
        publicUrl: "",
    });

    const [isSharing, setisSharing] = useState(false);
    const [showAlret, setshowAlret] = useState(false);
    const [mailError, setmailError] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const {
        common,
        auth,
        dashboard: {
            templates_data: { templates, template_active },
            dashboard_filters,
        },

        search: { searchFilters, fileds },
        callAudit: { isAccountLevel },
    } = useSelector((state) => state);

    const {
        filterTeams,
        filterReps,
        filterCallDuration,
        filterDates,
        domain,
        users,
    } = common;

    const validateEmail = (email) => {
        var re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEmails = (email) => {
        if (validateEmail(email)) {
            setForm({
                ...form,
                emails: [...form.emails, email],
            });
        } else {
            setmailError(true);
            setTimeout(() => {
                setmailError(false);
            }, 2000);
        }
    };

    const removeEmails = (email) => {
        let updatedMails = [...form.emails];
        let mailToRemove = updatedMails.findIndex((mail) => mail === email);
        updatedMails.splice(mailToRemove, 1);
        setForm({
            ...form,
            emails: updatedMails,
        });
    };

    const submitForm = (getPublic) => {
        const payload = {
            comment: "",
            emails: form.emails,

            json_filters: prepareSearchData(fileds, prepareData(), {
                client: searchFilters.client
                    ? common.salesTasks.find(
                          ({ id }) => +searchFilters.client.value === id
                      ) || {
                          ...searchFilters.client,
                          name: searchFilters.client.label,
                          id: searchFilters.client.id,
                      }
                    : null,
                topics:
                    common.topics.find(
                        ({ id }) => id === searchFilters.topic
                    ) || null,
                tags: common.tags.filter(({ id }) => {
                    for (let tag of searchFilters.call_tags) {
                        if (+tag === id) return true;
                    }
                    return false;
                }),
                owner:
                    common.filterReps?.reps?.find(
                        ({ id }) => id === common.filterReps.active
                    ) || null,
                team:
                    common.filterTeams?.teams?.find(
                        ({ id }) => id === common.filterTeams.active
                    ) || null,

                template:
                    templates.find(({ id }) => id === template_active) || null,
                keywords: searchFilters.keywords,
                isAccountLevel,
                stage: dashboard_filters.stage,
                auditFilter: dashboard_filters.audit_filter,
            }),

            owner: auth.id,
            module: "home",
        };

        if (!getPublic) {
            if (!form.emails.length) {
                setmailError(true);
                setTimeout(() => {
                    setmailError(false);
                }, 2000);
                return;
            }
        } else {
            setisSharing(true);
        }

        shareAnalytics(domain, payload).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                setForm({
                    ...form,
                    publicUrl: res?.data?.url,
                    isPublic: true,
                });
                if (!getPublic) {
                    navigator.clipboard.writeText(res?.data?.url, 100);
                    setForm({
                        ...form,
                        publicUrl: res?.data?.url,
                        isPublic: getPublic,
                    });
                    notification.success({
                        message: "Shared Successfully",
                    });
                } else {
                }
            }
            setisSharing(false);
        });
    };

    const onToggle = (checked) => {
        setIsChecked(true);
        if (checked) {
            submitForm(true);
        } else {
            setForm({
                ...form,
                isPublic: false,
                publicUrl: "",
            });
            setIsChecked(false);
        }
    };

    const prepareData = (flag = true) => {
        let data = {
            client: searchFilters?.client?.value,
            searchKeywords: {
                keywords: searchFilters?.keywords,
                isInCall: searchFilters?.keyword_present_in_call,
                saidByOwner: searchFilters?.keyword_said_by_rep,
                saidByClient: searchFilters?.keyword_said_by_others,
            },
            filterTags: searchFilters?.call_tags,
            questions: {
                byOwner: searchFilters?.no_of_questions_by_rep,
                byClient: searchFilters?.no_of_questions_by_others,
            },
            topics: {
                topic: searchFilters?.topic,
                inCall: searchFilters?.topic_in_call,
            },
            interactivity: searchFilters?.interactivity,
            callType: searchFilters?.call_types,
            callDuration:
                filterCallDuration.options[filterCallDuration.active].value,
            activeReps: filterReps.active,
            activeTeam: filterTeams.active,
            activeDateRange: filterDates.dates[filterDates.active].dateRange,
            conferenceMedium: searchFilters?.recording_medium,
            processingStatus: searchFilters?.processing_status,
            auditQuestions: searchFilters?.activeQuestions,
            template: templates.find(({ id }) => id === template_active),
            audit_filter: dashboard_filters.audit_filter,
            // min_aiscore: searchFilters.min_aiscore,
            // max_aiscore: searchFilters.max_aiscore,
            meetingType,
        };

        return data;
    };
    return (
        <Modal
            centered
            visible={showShare}
            closable={false}
            onCancel={() => {
                setForm({
                    ...form,
                    publicUrl: "",
                    comment: "",
                    emails: [],
                    isPublic: false,
                });
                setShowShare(false);
                setIsChecked(false);
                setisSharing(false);
            }}
            footer={null}
            width="605px"
            className="model_container bold600"
        >
            <div
                className="font16 flex paddingTB25 paddingLR25 marginB24 alignCenter justifySpaceBetween width100p"
                style={{
                    borderBottom: "1px solid rgba(153, 153, 153, 0.2)",
                }}
            >
                <span>
                    <MailSvg />{" "}
                    <span className="marginL11">Share Analytics via Email</span>
                </span>
                <span
                    className="close_btn"
                    onClick={() => {
                        setForm({
                            ...form,
                            publicUrl: "",
                            comment: "",
                            emails: [],
                            isPublic: false,
                        });
                        setShowShare(false);
                        setIsChecked(false);
                    }}
                >
                    <CloseSvg />
                </span>
            </div>
            <div className="shareLink_card_container paddingLR25">
                <div className="font14 marginB12">Analytics Comment</div>
                <div className="marginB24 width100p">
                    <TextArea
                        className="flex comment_input"
                        rows={2}
                        placeholder="Write a comment..."
                        onBlur={({ target: { value } }) =>
                            setForm({ ...form, comment: value })
                        }
                        value={form.comment}
                        onChange={({ target: { value } }) =>
                            setForm({ ...form, comment: value })
                        }
                    />
                </div>
                <div className="font14 marginB12">Share to</div>
                {mailError && (
                    <Alert
                        message="Please enter a valid email id"
                        type="error"
                        showIcon
                        closable
                    />
                )}
                <div
                    className="flex alignCenter justifySpaceBetween width100p paddingLR6 paddingTB4"
                    style={{
                        border: "1px solid rgba(153, 153, 153, 0.2)",
                        borderRadius: "5px",
                    }}
                >
                    <div className="select_container width100p">
                        <Select
                            mode="tags"
                            placeholder="Enter email and press enter"
                            onSelect={handleEmails}
                            onDeselect={removeEmails}
                            value={form.emails}
                            className="email_container width100p"
                        >
                            {users.map((user) => (
                                <Select.Option key={user.email}>
                                    {user?.first_name || user?.email}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <button
                        className="link_btn paddingTB8 paddingLR25 goodblue_cl goodblue_bg"
                        onClick={() => {
                            submitForm(false);
                        }}
                    >
                        SHARE
                    </button>
                </div>
                <div className="flex marginT18 marginB50  bold400 font12">
                    <span>
                        <CircleInfoSvg />
                    </span>
                    <span className="marginL10">
                        A public Link will be shared with the listed Analytics
                        to the above mentioned email.
                    </span>
                </div>
            </div>

            <div
                className="flex alignCenter justifySpaceBetween paddingLR25 paddingB12 width100p"
                style={{
                    borderBottom: "1px solid rgba(153, 153, 153, 0.2)",
                }}
            >
                <div className="bold600 font18">
                    <LinkSvg />
                    <span className="marginL14">Create a Shareable Link</span>
                </div>
                <div>
                    <span className="bold600 font14 marginR17">
                        Generate public link
                    </span>
                    <span>
                        <Switch
                            checked={isChecked}
                            onChange={onToggle}
                            loading={isSharing}
                        />
                    </span>
                </div>
            </div>

            <div className="paddingLR25 paddingB24">
                <div
                    className="flex alignCenter justifySpaceBetween width100p paddingLR6 paddingTB4 marginT9"
                    style={{
                        border: "1px solid rgba(153, 153, 153, 0.2)",
                        borderRadius: "5px",
                    }}
                >
                    <input
                        type="text"
                        className="link_input bold400 font14"
                        value={form.isPublic ? form.publicUrl : ""}
                    />
                    <button
                        className="link_btn paddingTB8 paddingLR25 goodblue_cl goodblue_bg"
                        onClick={() => {
                            if (form.isPublic) {
                                navigator.clipboard.writeText(
                                    form.publicUrl,
                                    100
                                );
                                setshowAlret(true);
                            }
                        }}
                    >
                        Copy Link
                    </button>
                </div>
                <div className="flex marginT18 bold400 font12 width100p">
                    <span>
                        <CircleInfoSvg />
                    </span>
                    <span className="marginL10">
                        A public link will be generated and can be shared with
                        anyone.
                    </span>
                </div>
                {showAlret && form.publicUrl ? (
                    <div className="alert_container marginT24">
                        <Alert
                            message={
                                <div className="flex alignCenter justifyCenter">
                                    <TickSvg
                                        style={{
                                            color: "#52C41A",
                                            marginRight: "8px",
                                        }}
                                    />
                                    <div className="goodcolor_cl">
                                        Link has been copied to clipboard
                                    </div>
                                </div>
                            }
                            type="success"
                            className="share_message_close"
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </Modal>
    );
}
