import React, { useEffect, useState, useContext, useCallback } from "react";
import config from "@constants/IndividualCall";
import { Button, message, Modal, Tooltip } from "antd";
import Icon, { CommentOutlined, ShareAltOutlined } from "@ant-design/icons";

import { useHistory } from "react-router";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import { TickSvg } from "app/static/svg/TickSvg";
import AskFeedback from "./AskfeedbackModal/AskFeedback";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { CallContext } from "./IndividualCall";
import { HomeContext } from "@container/Home/Home";
import { formatFloat } from "@tools/helpers";
import { completeMeetingAudit } from "@store/auditSlice/auditSlice";
import apiErrors from "@apis/common/errors";
import { openNotification } from "@store/common/actions";

// reducers

const AddSvg = () => (
    <svg
        width="1em"
        height="1em"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1.875 18.125V5.625H0.625V18.4375C0.625279 18.6861 0.724141 18.9243 0.899896 19.1001C1.07565 19.2759 1.31395 19.3747 1.5625 19.375H14.375V18.125H1.875Z"
            fill="black"
        />
        <path
            d="M5.625 15.625H4.375V3.125H3.125V15.9375C3.12528 16.1861 3.22414 16.4243 3.3999 16.6001C3.57565 16.7759 3.81395 16.8747 4.0625 16.875H16.875V15.625H5.625Z"
            fill="black"
        />
        <path
            d="M18.4375 0.625H6.5625C6.31395 0.625279 6.07565 0.724141 5.8999 0.899896C5.72414 1.07565 5.62528 1.31395 5.625 1.5625V13.4375C5.62528 13.6861 5.72414 13.9243 5.8999 14.1001C6.07565 14.2759 6.31395 14.3747 6.5625 14.375H18.4375C18.6861 14.3747 18.9243 14.2759 19.1001 14.1001C19.2759 13.9243 19.3747 13.6861 19.375 13.4375V1.5625C19.3747 1.31395 19.2759 1.07565 19.1001 0.899896C18.9243 0.724141 18.6861 0.625279 18.4375 0.625ZM18.125 13.125H6.875V1.875H18.125V13.125Z"
            fill="black"
        />
        <path
            d="M11.875 11.25H13.125V7.96875H16.4062V6.71875H13.125V3.4375H11.875V6.71875H8.59375V7.96875H11.875V11.25Z"
            fill="black"
        />
    </svg>
);

const AddIcon = () => <Icon component={AddSvg} />;

const CallTabBar = (props) => {
    const tabClass = "individualcall-tabbar";

    const history = useHistory();
    const { versionData } = useSelector((state) => state.common);
    const {
        auth: { role },
    } = useSelector((state) => state);
    const dispatch = useDispatch();

    const { ai_score, manual_score, audit_template, score_objects } =
        useSelector((state) => state.auditSlice);

    const { toggleAudit, showAuditDrawer, callId, showAcknowledgeBtn } = props;

    const { activeTemplate, activeCategories, auditStartTime } =
        useContext(CallContext);

    const { is_Auditor } = useContext(HomeContext);

    const [submitVisible, setSubmitModalVisible] = useState(false);

    const handleSubmit = useCallback(
        (payload) => {
            setSubmitModalVisible(false);
            dispatch(
                completeMeetingAudit({
                    id: callId,
                    payload: {
                        ...payload,
                        template_id: audit_template?.id,
                        ...((manual_score?.data?.audit_time === null ||
                            manual_score?.data?.audit_time === undefined) &&
                            !!auditStartTime && {
                                audit_time:
                                    formatFloat(
                                        (new Date().getTime() -
                                            auditStartTime) /
                                            1000
                                    ) || 0,
                            }),
                    },
                    submit: true,
                })
            ).then(({ payload }) => {
                if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                    toggleAudit(false);
                    message.success({
                        content: "Audit submitted successfully",
                        className: "toast-success",
                    });
                }
            });
        },
        [auditStartTime, manual_score?.data]
    );

    useEffect(() => {
        if (showAuditDrawer) return;
        const sp = new URLSearchParams(history.location.search);
        if (sp.get("tab") === "audit") {
            audit_template && toggleAudit(false, true);
        }
    }, [audit_template, showAuditDrawer]);

    // modal
    const [visible, setVisible] = useState(false);
    const showModal = () => {
        setVisible(true);
    };

    return (
        <div
            className={`${tabClass} ${props.className ? props.className : ""}`}
        >
            <div className={`${tabClass}-options`}>
                {props.chat || (
                    <>
                        <div
                            className={`${tabClass}-options-option`}
                            title={config.LISTENLATER}
                        >
                            <Button
                                icon={<ShareAltOutlined />}
                                type={"text"}
                                shape={"round"}
                                onClick={() => {
                                    props.sharerHandler(props.callId, true);
                                }}
                            />
                        </div>
                        <div
                            className={`${tabClass}-options-option addToLib`}
                            title={config.ADDTOLIB}
                        >
                            <Button
                                type={"text"}
                                shape={"round"}
                                icon={<AddIcon />}
                                onClick={props.handleShowAddToLib}
                                // disabled={props.isProcessing}
                            />
                        </div>
                    </>
                )}
                <div
                    className={`${tabClass}-options-option`}
                    title={config.COMMENTS}
                >
                    <Button
                        type={"text"}
                        shape={"round"}
                        icon={<CommentOutlined />}
                        onClick={props.toggleComments}
                    />
                </div>
                <div
                    className={`${tabClass}-options-option marginR8 marginL40`}
                    title={config.ASKFORFEEDBACK}
                >
                    <button
                        onClick={() => {
                            showModal();
                        }}
                        className="audit_btn"
                    >
                        <div className="flex alignCenter">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.668 0.666992H2.33464C1.41797 0.666992 0.676302 1.41699 0.676302 2.33366L0.667969 17.3337L4.0013 14.0003H15.668C16.5846 14.0003 17.3346 13.2503 17.3346 12.3337V2.33366C17.3346 1.41699 16.5846 0.666992 15.668 0.666992ZM15.668 12.3337H3.30964L2.81797 12.8253L2.33464 13.3087V2.33366H15.668V12.3337ZM8.16797 9.00033H9.83463V10.667H8.16797V9.00033ZM8.16797 4.00033H9.83463V7.33366H8.16797V4.00033Z"
                                    fill="#333333"
                                />
                            </svg>

                            <span className="mine_shaft_cl bold600 font12 marginLR6">
                                Get Feedback
                            </span>
                        </div>
                    </button>
                    <AskFeedback
                        visible={visible}
                        setVisible={setVisible}
                        callId={callId}
                    />
                </div>

                {activeTemplate && (
                    <div className={`${tabClass}-options-option`}>
                        {showAuditDrawer &&
                        !!activeCategories?.length &&
                        is_Auditor(role?.code_names) &&
                        !showAcknowledgeBtn ? (
                            <Tooltip
                                title={
                                    score_objects?.data?.find(
                                        (s) => s.error === true
                                    ) ? (
                                        <div>
                                            We failed to record response for a
                                            few quetions. Kindly go through the
                                            audit sheet again
                                        </div>
                                    ) : score_objects?.data.find(
                                          (s) =>
                                              s?.question_data?.is_mandatory &&
                                              s?.score_given === null &&
                                              s?.question_data
                                                  ?.question_type !== "none"
                                      ) ? (
                                        "Kindly fill the mandatory questions"
                                    ) : null
                                }
                            >
                                <Button
                                    onClick={() => {
                                        const scoreObj =
                                            score_objects?.data.filter(
                                                (s) =>
                                                    s.question_data.is_mandatory
                                            );
                                        if (
                                            scoreObj.filter((s) =>
                                                s?.question_data
                                                    .question_type === "none"
                                                    ? s.notes?.length ||
                                                      s.media?.length
                                                        ? false
                                                        : true
                                                    : false
                                            ).length
                                        )
                                            return message.error({
                                                content:
                                                    "Note is mandatory for this response",
                                                className: "audit-message",
                                            });
                                        if (
                                            scoreObj.filter(
                                                (s) =>
                                                    s?.question_data
                                                        .question_type !==
                                                        "none" &&
                                                    s.score_given === null
                                            ).length
                                        ) {
                                            return message.error({
                                                content:
                                                    "Please fill the Mandatory Questions!",
                                                className: "audit-message",
                                            });
                                        }

                                        if (manual_score?.data?.status)
                                            return handleSubmit();
                                        const filter_objects =
                                            score_objects.data
                                                .filter(
                                                    (e) =>
                                                        e?.question_data
                                                            ?.question_type !==
                                                        "none"
                                                )
                                                .filter(
                                                    (e) =>
                                                        e?.score_given === null
                                                );
                                        if (filter_objects.length)
                                            setSubmitModalVisible(true);
                                        else handleSubmit();
                                    }}
                                    className="submit_button"
                                    style={{ borderRadius: 6 }}
                                    type="primary"
                                >
                                    Submit Audit
                                </Button>
                            </Tooltip>
                        ) : manual_score?.data?.status ? (
                            <button
                                onClick={() => {
                                    toggleAudit();
                                }}
                                className={"audit_btn audit_done_btn"}
                            >
                                <TickSvg
                                    style={{
                                        color: "#52C41A",
                                    }}
                                />
                                <span>Audit Done</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    toggleAudit();
                                }}
                                className="audit_btn"
                            >
                                <div className="flex alignCenter">
                                    <span className="mine_shaft_cl bold600 font12 marginLR6">
                                        {!!manual_score?.data?.scores
                                            ?.template_ques_audited ? (
                                            `Resume ${
                                                versionData?.domain_type !==
                                                "b2c"
                                                    ? "Scoring Call"
                                                    : "Audit"
                                            }`
                                        ) : (
                                            <span className="flex alignCenter">
                                                <svg
                                                    width="17"
                                                    height="19"
                                                    viewBox="0 0 17 19"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M15.5941 1.40655L15.5938 1.40624C15.0101 0.825122 14.2223 0.499609 13.4008 0.499609H13.3852H13.3695H13.3538H13.3381H13.3223H13.3065H13.2907H13.2748H13.2589H13.243H13.227H13.211H13.1949H13.1788H13.1627H13.1465H13.1304H13.1141H13.0979H13.0816H13.0653H13.0489H13.0325H13.0161H12.9996H12.9831H12.9666H12.95H12.9334H12.9168H12.9001H12.8835H12.8667H12.85H12.8332H12.8164H12.7995H12.7826H12.7657H12.7488H12.7318H12.7148H12.6977H12.6807H12.6636H12.6464H12.6293H12.6121H12.5949H12.5776H12.5603H12.543H12.5257H12.5083H12.4909H12.4735H12.456H12.4386H12.421H12.4035H12.3859H12.3683H12.3507H12.3331H12.3154H12.2977H12.2799H12.2622H12.2444H12.2266H12.2087H12.1908H12.1729H12.155H12.1371H12.1191H12.1011H12.0831H12.065H12.0469H12.0288H12.0107H11.9925H11.9744H11.9562H11.9379H11.9197H11.9014H11.8831H11.8648H11.8464H11.828H11.8096H11.7912H11.7728H11.7543H11.7358H11.7173H11.6988H11.6802H11.6616H11.643H11.6244H11.6058H11.5871H11.5684H11.5497H11.5309H11.5122H11.4934H11.4746H11.4558H11.437H11.4181H11.3992H11.3803H11.3614H11.3424H11.3235H11.3045H11.2855H11.2665H11.2474H11.2284H11.2093H11.1902H11.1711H11.152H11.1328H11.1136H11.0944H11.0752H11.056H11.0368H11.0175H10.9982H10.9789H10.9596H10.9403H10.9209H10.9016H10.8822H10.8628H10.8434H10.824H10.8045H10.7851H10.7656H10.7461H10.7266H10.7071H10.6875H10.668H10.6484H10.6288H10.6092H10.5896H10.57H10.5503H10.5307H10.511H10.4913H10.4717H10.4519H10.4322H10.4125H10.3927H10.373H10.3532H10.3334H10.3136H10.2938H10.274H10.2542H10.2343H10.2145H10.1946H10.1747H10.1548H10.1349H10.115H10.0951H10.0751H10.0552H10.0352H10.0153H9.99529H9.97531H9.95531H9.9353H9.91529H9.89526H9.87523H9.85519H9.83513H9.81507H9.795H9.77493H9.75484H9.73475H9.71464H9.69453H9.67441H9.65429H9.63415H9.61401H9.59387H9.57371H9.55355H9.53338H9.5132H9.49302H9.47283H9.45264H9.43244H9.41223H9.39202H9.3718H9.35158H9.33135H9.31112H9.29088H9.27063H9.25038H9.23013H9.20987H9.18961H9.16935H9.14908H9.1288H9.10852H9.08824H9.06796H9.04767H9.02738H9.00708H8.98679H8.96649H8.94618H8.92588H8.90557H8.88526H8.86495H8.84464H8.82432H8.804H8.78369H8.76337H8.74305H8.72272H8.7024H8.68208H8.66175H8.64143H8.62111H8.60078H8.58046H8.56013H8.53981H8.51948H8.49916H8.47884H8.45852H8.4382H8.41788H8.39756H8.37724H8.35693H8.33661H8.3163H8.29599H8.27568H8.25538H8.23508H8.21478H8.19448H8.17418H8.15389H8.13361H8.11332H8.09304H8.07276H8.05249H8.03222H8.01195H7.99169H7.97143H7.95118H7.93093H7.91069H7.89045H7.87021H7.84998H7.82976H7.80954H7.78933H7.76912H7.74892H7.72873H7.70854H7.68836H7.66818H7.64801H7.62785H7.6077H7.58755H7.56741H7.54728H7.52715H7.50703H7.48692H7.46682H7.44672H7.42664H7.40656H7.38649H7.36643H7.34638H7.32633H7.3063H7.28627H7.26626H7.24625H7.22626H7.20627H7.18629H7.16633H7.14637H7.12642H7.10649H7.08657H7.06665H7.04675H7.02686H7.00698H6.98711H6.96725H6.9474H6.92757H6.90775H6.88794H6.86814H6.84835H6.82858H6.80882H6.78907H6.76934H6.74962H6.72991H6.71022H6.69054H6.67087H6.65121H6.63158H6.61195H6.59234H6.57274H6.55316H6.53359H6.51404H6.4945H6.47498H6.45547H6.43598H6.41651H6.39704H6.3776H6.35817H6.33876H6.31936H6.29998H6.28062H6.26127H6.24194H6.22263H6.20334H6.18406H6.1648H6.14556H6.12633H6.10712H6.08793H6.06876H6.04961H6.03047H6.01136H5.99226H5.97318H5.95412H5.93508H5.91606H5.89706H5.87808H5.85912H5.84018H5.82126H5.80235H5.78347H5.76461H5.74577H5.72695H5.70815H5.68937H5.67062H5.65188H5.63317H5.61448H5.59581H5.57716H5.55853H5.53993H5.52135H5.50279H5.48425H5.46574H5.44725H5.42878H5.41033H5.39191H5.37352H5.35514H5.33679H5.31847H5.30016H5.28188H5.26363H5.2454H5.2272H5.20902H5.19086H5.17273H5.15463H5.13655H5.1185H5.10047H5.08247H5.06449H5.04654H5.02862H5.01072H4.99285H4.975H4.95719H4.93939H4.92163H4.9039H4.88619H4.86851H4.85085H4.83323H4.81563H4.79806H4.78052H4.763H4.74552H4.72806H4.71064H4.69324H4.67587H4.65853H4.64122H4.62394H4.60669H4.58947H4.57228H4.55512H4.53799H4.52089H4.50382H4.48678H4.46977H4.45279H4.43585H4.41893H4.40205H4.3852H4.36838H4.35159H4.33483H4.31811H4.30142H4.28476H4.26813H4.25154H4.23498H4.21845H4.20195H4.18549H4.16906H4.15267H4.13631H4.11998H4.10369H4.08743H4.07121H4.05502H4.03886H4.02274H4.00665H3.9906H3.97459H3.95861H3.94266H3.92675H3.91088H3.89504H3.87924H3.86348H3.84775H3.83206H3.8164H3.80078C2.97928 0.499609 2.19143 0.825122 1.60773 1.40624L1.60741 1.40656C1.02629 1.99026 0.700781 2.77811 0.700781 3.59961V15.5996C0.700781 16.4211 1.02629 17.209 1.60741 17.7927L1.60773 17.793C2.19143 18.3741 2.97928 18.6996 3.80078 18.6996H3.8164H3.83206H3.84775H3.86348H3.87924H3.89504H3.91088H3.92675H3.94266H3.95861H3.97459H3.9906H4.00665H4.02274H4.03886H4.05502H4.07121H4.08743H4.10369H4.11998H4.13631H4.15267H4.16906H4.18549H4.20195H4.21845H4.23498H4.25154H4.26813H4.28476H4.30142H4.31811H4.33483H4.35159H4.36838H4.3852H4.40205H4.41893H4.43585H4.45279H4.46977H4.48678H4.50382H4.52089H4.53799H4.55512H4.57228H4.58947H4.60669H4.62394H4.64122H4.65853H4.67587H4.69324H4.71064H4.72806H4.74552H4.763H4.78052H4.79806H4.81563H4.83323H4.85085H4.86851H4.88619H4.9039H4.92163H4.93939H4.95719H4.975H4.99285H5.01072H5.02862H5.04654H5.06449H5.08247H5.10047H5.1185H5.13655H5.15463H5.17273H5.19086H5.20902H5.2272H5.2454H5.26363H5.28188H5.30016H5.31847H5.33679H5.35514H5.37352H5.39191H5.41033H5.42878H5.44725H5.46574H5.48425H5.50279H5.52135H5.53993H5.55853H5.57716H5.59581H5.61448H5.63317H5.65188H5.67062H5.68937H5.70815H5.72695H5.74577H5.76461H5.78347H5.80235H5.82126H5.84018H5.85912H5.87808H5.89706H5.91606H5.93508H5.95412H5.97318H5.99226H6.01136H6.03047H6.04961H6.06876H6.08793H6.10712H6.12633H6.14556H6.1648H6.18406H6.20334H6.22263H6.24194H6.26127H6.28062H6.29998H6.31936H6.33876H6.35817H6.3776H6.39704H6.41651H6.43598H6.45547H6.47498H6.4945H6.51404H6.53359H6.55316H6.57274H6.59234H6.61195H6.63158H6.65121H6.67087H6.69054H6.71022H6.72991H6.74962H6.76934H6.78907H6.80882H6.82858H6.84835H6.86814H6.88794H6.90775H6.92757H6.9474H6.96725H6.98711H7.00698H7.02686H7.04675H7.06665H7.08657H7.10649H7.12642H7.14637H7.16633H7.18629H7.20627H7.22626H7.24625H7.26626H7.28627H7.3063H7.32633H7.34638H7.36643H7.38649H7.40656H7.42664H7.44672H7.46682H7.48692H7.50703H7.52715H7.54728H7.56741H7.58755H7.6077H7.62785H7.64801H7.66818H7.68836H7.70854H7.72873H7.74892H7.76912H7.78933H7.80954H7.82976H7.84998H7.87021H7.89045H7.91069H7.93093H7.95118H7.97143H7.99169H8.01195H8.03222H8.05249H8.07276H8.09304H8.11332H8.13361H8.15389H8.17418H8.19448H8.21478H8.23508H8.25538H8.27568H8.29599H8.3163H8.33661H8.35693H8.37724H8.39756H8.41788H8.4382H8.45852H8.47884H8.49916H8.51948H8.53981H8.56013H8.58046H8.60078H8.62111H8.64143H8.66175H8.68208H8.7024H8.72272H8.74305H8.76337H8.78369H8.804H8.82432H8.84464H8.86495H8.88526H8.90557H8.92588H8.94618H8.96649H8.98679H9.00708H9.02738H9.04767H9.06796H9.08824H9.10852H9.1288H9.14908H9.16935H9.18961H9.20987H9.23013H9.25038H9.27063H9.29088H9.31112H9.33135H9.35158H9.3718H9.39202H9.41223H9.43244H9.45264H9.47283H9.49302H9.5132H9.53338H9.55355H9.57371H9.59387H9.61401H9.63415H9.65429H9.67441H9.69453H9.71464H9.73475H9.75484H9.77493H9.795H9.81507H9.83513H9.85519H9.87523H9.89526H9.91529H9.9353H9.95531H9.97531H9.99529H10.0153H10.0352H10.0552H10.0751H10.0951H10.115H10.1349H10.1548H10.1747H10.1946H10.2145H10.2343H10.2542H10.274H10.2938H10.3136H10.3334H10.3532H10.373H10.3927H10.4125H10.4322H10.4519H10.4717H10.4913H10.511H10.5307H10.5503H10.57H10.5896H10.6092H10.6288H10.6484H10.668H10.6875H10.7071H10.7266H10.7461H10.7656H10.7851H10.8045H10.824H10.8434H10.8628H10.8822H10.9016H10.9209H10.9403H10.9596H10.9789H10.9982H11.0175H11.0368H11.056H11.0752H11.0944H11.1136H11.1328H11.152H11.1711H11.1902H11.2093H11.2284H11.2474H11.2665H11.2855H11.3045H11.3235H11.3424H11.3614H11.3803H11.3992H11.4181H11.437H11.4558H11.4746H11.4934H11.5122H11.5309H11.5497H11.5684H11.5871H11.6058H11.6244H11.643H11.6616H11.6802H11.6988H11.7173H11.7358H11.7543H11.7728H11.7912H11.8096H11.828H11.8464H11.8648H11.8831H11.9014H11.9197H11.9379H11.9562H11.9744H11.9925H12.0107H12.0288H12.0469H12.065H12.0831H12.1011H12.1191H12.1371H12.155H12.1729H12.1908H12.2087H12.2266H12.2444H12.2622H12.2799H12.2977H12.3154H12.3331H12.3507H12.3683H12.3859H12.4035H12.421H12.4386H12.456H12.4735H12.4909H12.5083H12.5257H12.543H12.5603H12.5776H12.5949H12.6121H12.6293H12.6464H12.6636H12.6807H12.6977H12.7148H12.7318H12.7488H12.7657H12.7826H12.7995H12.8164H12.8332H12.85H12.8667H12.8835H12.9001H12.9168H12.9334H12.95H12.9666H12.9831H12.9996H13.0161H13.0325H13.0489H13.0653H13.0816H13.0979H13.1141H13.1304H13.1465H13.1627H13.1788H13.1949H13.211H13.227H13.243H13.2589H13.2748H13.2907H13.3065H13.3223H13.3381H13.3538H13.3695H13.3852H13.4008C14.2223 18.6996 15.0101 18.3741 15.5938 17.793L15.5941 17.7927C16.1753 17.209 16.5008 16.4211 16.5008 15.5996V3.59961C16.5008 2.77811 16.1753 1.99026 15.5941 1.40655ZM3.80078 1.89961H4.30078V2.39961C4.30078 3.44984 5.15055 4.29961 6.20078 4.29961H11.0008C12.051 4.29961 12.9008 3.44984 12.9008 2.39961V1.89961H13.4008C13.8517 1.89961 14.2838 2.07903 14.6026 2.39782C14.9214 2.71661 15.1008 3.1487 15.1008 3.59961V15.5996C15.1008 16.0505 14.9214 16.4826 14.6026 16.8014C14.2838 17.1202 13.8517 17.2996 13.4008 17.2996H3.80078C3.34987 17.2996 2.91778 17.1202 2.59899 16.8014C2.2802 16.4826 2.10078 16.0505 2.10078 15.5996V3.59961C2.10078 3.1487 2.2802 2.71661 2.59899 2.39782C2.91778 2.07903 3.34987 1.89961 3.80078 1.89961ZM11.5008 1.89961V2.39961C11.5008 2.67688 11.2781 2.89961 11.0008 2.89961H6.20078C5.92351 2.89961 5.70078 2.67688 5.70078 2.39961V1.89961H11.5008Z"
                                                        fill="#333333"
                                                        stroke="#333333"
                                                        strokeWidth="0.2"
                                                    />
                                                    <path
                                                        d="M10.8718 8.2088L8.0241 11.2795L7.12823 10.3135C6.87037 10.0351 6.45148 10.0351 6.19363 10.3135C5.93546 10.5919 5.93546 11.0429 6.19363 11.3213L7.5568 12.7912C7.68572 12.9304 7.85499 13 8.0241 13C8.1932 13 8.36247 12.9304 8.49139 12.7912L11.8064 9.21659C12.0645 8.9382 12.0645 8.48719 11.8064 8.2088C11.5485 7.9304 11.1296 7.9304 10.8718 8.2088Z"
                                                        fill="#333333"
                                                    />
                                                </svg>
                                                <span className="marginL5">
                                                    Start Audit
                                                </span>
                                            </span>
                                        )}
                                    </span>

                                    <span className="bolder mine_shaft_cl font12">
                                        <ChevronRightSvg />
                                    </span>
                                </div>
                            </button>
                        )}
                    </div>
                )}
            </div>
            <Modal
                title="SUBMIT AUDIT"
                visible={submitVisible}
                footer={[
                    <Button
                        key="na_no"
                        onClick={() => setSubmitModalVisible(false)}
                    >
                        Continue Auditing
                    </Button>,
                    <Button
                        key="na_yes"
                        type="primary"
                        onClick={() => {
                            handleSubmit({ mark_na: true });
                        }}
                    >
                        Submit
                    </Button>,
                ]}
                onCancel={() => setSubmitModalVisible(false)}
                maskClosable={true}
                keyboard={true}
            >
                <div className="bold paddingL16 font16">
                    <ExclamationCircleOutlined /> Do you want to mark all the
                    unmarked questions with the default response
                </div>
            </Modal>
        </div>
    );
};

// ask for feedback modal

export default CallTabBar;
