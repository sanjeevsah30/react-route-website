import { Button, Form, Modal, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";
import { uid } from "@tools/helpers";
import settingsConfig from "@constants/Settings/index";
import "./battle_card.scss";
import BasicInfoForm from "./Forms/BasicInfoForm";
import TriggerConfigurationForm from "./Forms/TriggerConfigurationForm";
import ActionConfigurationForm from "./Forms/ActionConfigurationForm";
import { BattleCardContext } from "./BattleCardContext";
import { openNotification } from "@store/common/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    createUpdateBattleCard,
    getBattleCardDataToUpdate,
    listLiveAssistBattleCardCtegories,
} from "@store/liveAssistSlice/liveAssistSlice";
import apiErrors from "@apis/common/errors";
import { BattleCardTypeConfig } from "./BattleCardConfigModalReducer";

const CreateBattleCardModal = () => {
    const { BATTLE_CARDS_STEPS: steps } = settingsConfig;
    const [form] = Form.useForm();
    const {
        liveAssistSlice: { loading, activeBattleCard },
    } = useSelector((state) => state);
    const { HINT, CHECKLIST, GUIDED_WORKFLOW } = BattleCardTypeConfig;
    const {
        battleCardModalVisible: visible,
        handleBattleCardModal,
        modalState: {
            currentStep,
            name,
            category,
            team_ids,
            phrases,
            type,
            hint,
            check_list,
            guided_workflow,
            mentioned_by,
        },
        modalDispatch,
        battleCardToEditId,
        setBattleCardToEditId,
    } = useContext(BattleCardContext);
    const dispatch = useDispatch();
    const handleNext = ({ value, isSetStep }) => {
        if (value < currentStep) {
            return modalDispatch({ type: "SET_STEP", payload: value });
        }
        if (currentStep === 0) {
            if (!name) {
                return openNotification(
                    "error",
                    "Error",
                    "Enter the name of the battle card"
                );
            }
            if (!category) {
                return openNotification("error", "Error", "Enter a category");
            }
            if (!team_ids.length) {
                return openNotification("error", "Error", "Select a team");
            }
        } else if (currentStep === 1) {
            if (!phrases.length) {
                return openNotification("error", "Error", "Enter a phrase");
            }
        }
        if (isSetStep) modalDispatch({ type: "SET_STEP", payload: value });
        else modalDispatch({ type: "NEXT_STEP" });
    };
    const handleSave = () => {
        if (type === HINT) {
            if (!hint.length)
                return openNotification("error", "Error", "Enter a hint");
        }
        if (type === CHECKLIST) {
            if (check_list.findIndex((e) => e === "") > -1) {
                return openNotification(
                    "error",
                    "Error",
                    "Make sure to input all the check list"
                );
            }
        }
        if (type === GUIDED_WORKFLOW) {
            if (guided_workflow.findIndex((e) => e === "") > -1) {
                return openNotification(
                    "error",
                    "Error",
                    "make sure to input all the steps for guided workflow"
                );
            }
        }
        dispatch(
            createUpdateBattleCard({
                ...(battleCardToEditId && {
                    id: battleCardToEditId,
                }),

                name,
                category:
                    typeof category?.id === "string"
                        ? { name: category.name }
                        : category,
                teams: team_ids,
                type,
                phrases: phrases.join(" OR "),
                metadata: {
                    phrase_list: phrases,
                    said_by: mentioned_by,
                    ...(type === HINT && { hint }),
                    ...(type === CHECKLIST && {
                        check_list,
                    }),
                    ...(type === GUIDED_WORKFLOW && {
                        guided_workflow,
                    }),
                },
            })
        ).then(({ payload }) => {
            if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                dispatch(listLiveAssistBattleCardCtegories());
                handleBattleCardModal();
                modalDispatch({
                    type: "RESET_STATE",
                });
            }
        });
    };

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (battleCardToEditId) {
            setIsFetching(true);
            dispatch(getBattleCardDataToUpdate(battleCardToEditId)).then(
                ({ payload }) => {
                    setIsFetching(false);
                    if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                        if (payload?.id) {
                            modalDispatch({
                                type: "UPDATE_MODAL_STATE",
                                payload: {
                                    name: payload.name,
                                    category: payload.category,
                                    team_ids: payload.teams.map((e) => e.id),
                                    phrases: payload.metadata.phrase_list,
                                    mentioned_by: payload.metadata.said_by,
                                    type: payload.type,
                                    ...(payload.type === HINT && {
                                        hint: payload.metadata.hint,
                                    }),
                                    ...(payload.type === CHECKLIST && {
                                        check_list: payload.metadata.check_list,
                                    }),
                                    ...(payload.type === GUIDED_WORKFLOW && {
                                        guided_workflow:
                                            payload.metadata.guided_workflow,
                                    }),
                                },
                            });
                        }
                    }
                }
            );
        }
    }, [battleCardToEditId]);

    return (
        <Modal
            open={visible}
            centered
            onCancel={() => {
                if (battleCardToEditId) {
                    setBattleCardToEditId(null);
                    modalDispatch({
                        type: "RESET_STATE",
                    });
                }
                handleBattleCardModal();
            }}
            title={`${battleCardToEditId ? "Edit" : "Create"} Battle Card`}
            width="1000px"
            footer={
                <>
                    {currentStep !== 0 ? (
                        <Button
                            type="secondary"
                            onClick={() => {
                                modalDispatch({ type: "PREV_STEP" });
                            }}
                        >
                            BACK
                        </Button>
                    ) : (
                        <></>
                    )}
                    {currentStep !== 2 ? (
                        <Button
                            type="primary"
                            onClick={() => handleNext({ value: currentStep })}
                            loading={loading}
                        >
                            NEXT
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={handleSave}
                            loading={loading}
                        >
                            SAVE
                        </Button>
                    )}
                </>
            }
            wrapClassName="rule_modal"
        >
            {isFetching ? (
                <Skeleton
                    active
                    paragraph={{ rows: 8 }}
                    title={false}
                    style={{ marginTop: "10px" }}
                />
            ) : (
                <div className="flex">
                    <div className="flexShrink">
                        <Steps
                            items={steps}
                            current={currentStep}
                            setCurrent={(value) => {
                                handleNext({ value, isSetStep: true });
                            }}
                            alignment="vertical"
                        />
                    </div>
                    <div className="flex1">
                        {currentStep === 0 ? (
                            <StepContent
                                title="Basic Info"
                                description="Names and other basic config."
                                form={<BasicInfoForm form={form} />}
                            />
                        ) : currentStep === 1 ? (
                            <StepContent
                                title="Trigger Configuration"
                                description="Names and other basic config."
                                form={<TriggerConfigurationForm />}
                            />
                        ) : (
                            <StepContent
                                title="Action Configuration"
                                description="Names and other basic config."
                                form={<ActionConfigurationForm form={form} />}
                            />
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};

const Steps = ({ items, current, alignment, setCurrent }) => {
    return (
        <div className="steps_container" alignment={alignment}>
            {items.map((item, idx) => (
                <div
                    className="step_button"
                    current={`${current === idx}`}
                    onClick={() => {
                        setCurrent(idx);
                    }}
                    key={uid()}
                >
                    <div className="step_index">{idx + 1}</div>
                    <div className="step_title flex1">{item}</div>
                </div>
            ))}
        </div>
    );
};

const StepContent = ({
    title,
    description,
    form,
    additionalTitle,
    additionalContent,
}) => {
    return (
        <div className="step_content">
            <div className="step_content--header">
                <div>
                    <span className="step_content--title">
                        {title}
                        {additionalTitle ? (
                            <span>
                                {" "}
                                -{" "}
                                <span style={{ color: "#666" }}>
                                    {additionalTitle}
                                </span>
                            </span>
                        ) : null}
                    </span>
                    <span className="step_content--description">
                        {description}
                    </span>
                </div>
                {additionalContent ? (
                    <div className="step_content--header_additional">
                        {additionalContent}
                    </div>
                ) : null}
            </div>
            {form}
        </div>
    );
};

export default CreateBattleCardModal;
