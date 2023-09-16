import StepContent from "../presentational/reusables/StepContent";
import { Button, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import Steps from "../presentational/reusables/Steps";
import { FiltersForm } from "../container/Settings/SamplingManager/forms/index";
import Loader from "../presentational/reusables/Loader";
import ConfigureForm from "./forms/ConfigureForm";
import TargetForm from "./forms/TargetForm";
import DatasetModalProvider, {
    DatasetModalContext,
} from "./DatasetModalContext";
import { useDispatch, useSelector } from "react-redux";
import convinGptConfig from "../../constants/ConvinGpt/index";
import {
    getAllTeams,
    getTopics,
    openNotification,
} from "../../../store/common/actions";
import { encodeFilterData } from "../../../tools/searchFactory";
import { createGptDataSet } from "@store/gpt/gptSlice";
import apiErrors from "@apis/common/errors";

const { steps } = convinGptConfig;

const CreateDatasetModal = ({ visible, onCancel, datasetId: id }) => {
    const {
        teams,
        users,
        tags,
        topics,
        versionData: { stats_threshold, has_chat },
    } = useSelector((state) => state.common);
    const reduxDispatch = useDispatch();

    const { currentStep, dispatch, ...state } = useContext(DatasetModalContext);

    const [loading, setIsLoading] = useState(false);
    const [editing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!teams.length) {
            reduxDispatch(getAllTeams());
        }
        if (!topics.length) {
            reduxDispatch(getTopics());
        }
    }, []);

    useEffect(() => {
        dispatch({
            type: "INITIALISE_FILTERS",
            payload: { teams, tags, reps: users, filterReps: users },
        });
    }, [teams, tags, users]);
    useEffect(() => {
        if (id && visible) {
            setIsLoading(true);
        }
    }, [visible]);

    const createDataset = () => {
        let requestData = {
            name: state.name,
            description: state.description,
            filters: encodeFilterData({ ...state, stats_threshold, has_chat }),
            target: state.target.quantity,
        };
        reduxDispatch(createGptDataSet(requestData)).then(({ payload }) => {
            if (payload.status === apiErrors.AXIOSCOMMONERROR) {
                return;
            }
            dispatch({
                type: "RESET_MODAL",
            });
            onCancel();
        });
        if (id) {
            // setIsEditing(true);
        } else {
            // setIsEditing(true);
        }
    };

    return (
        <Modal
            open={visible}
            centered
            onCancel={onCancel}
            title={`${id ? "Edit" : "Create"} Dataset`}
            width="1000px"
            footer={
                !loading && (
                    <>
                        {currentStep !== 0 && (
                            <Button
                                type="default"
                                onClick={() => {
                                    dispatch({ type: "PREV_STEP" });
                                }}
                            >
                                BACK
                            </Button>
                        )}
                        <Button
                            type="primary"
                            onClick={() => {
                                if (currentStep === 0 && !state.name) {
                                    return openNotification(
                                        "error",
                                        "Error",
                                        "Enter a name for the dataset."
                                    );
                                }
                                if (currentStep === 2) {
                                    if (!state.target?.quantity) {
                                        return openNotification(
                                            "error",
                                            "Error",
                                            "Enter a valid target quantity."
                                        );
                                    }
                                    createDataset();
                                    return;
                                }
                                dispatch({ type: "NEXT_STEP" });
                            }}
                            loading={editing}
                            disabled={editing}
                        >
                            {currentStep === steps.length - 1
                                ? `${id ? "EDIT" : "CREATE"} DATASET`
                                : "NEXT"}
                        </Button>
                    </>
                )
            }
            wrapClassName="step_modal"
        >
            <Loader loading={loading}>
                <div className="step_modal--body">
                    <div className="step_modal--steps">
                        <Steps
                            items={steps}
                            current={currentStep}
                            setCurrent={(value) => {
                                if (currentStep === 0 && !state.name) {
                                    return openNotification(
                                        "error",
                                        "Error",
                                        "Enter a name for the dataset."
                                    );
                                }
                                dispatch({
                                    type: "SET_STEP",
                                    payload: value,
                                });
                            }}
                            alignment="vertical"
                        />
                    </div>
                    <div className="step_modal--content">
                        {currentStep === 0 ? (
                            <StepContent
                                title="Configure"
                                description="Give Dataset name and description"
                                form={<ConfigureForm />}
                            />
                        ) : currentStep === 1 ? (
                            <StepContent
                                title="Filters"
                                description="Choose filters for this Dataset."
                                form={
                                    <FiltersForm
                                        context={DatasetModalContext}
                                    />
                                }
                            />
                        ) : (
                            <StepContent
                                title="Set Target"
                                form={<TargetForm />}
                            />
                        )}
                    </div>
                </div>
            </Loader>
        </Modal>
    );
};

const withContextModal = (props) => {
    return (
        <DatasetModalProvider>
            <CreateDatasetModal {...props} />
        </DatasetModalProvider>
    );
};

export default withContextModal;
