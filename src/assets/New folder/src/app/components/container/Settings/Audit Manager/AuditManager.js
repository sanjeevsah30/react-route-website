import React, { createContext, useEffect, useState } from "react";

import "./auditManager.scss";
import auditConfig from "@constants/Audit";
import CreateTemplate from "./Create Template/CreateTemplate";
import TemplateList from "./Templates/TemplateList";
import CategorySettings from "./Categories/CategorySettings";
import QuestionSettings from "./Questions/QuestionSettings";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@presentational/reusables/Spinner";
import { resetCallAudit } from "@store/call_audit/actions";
import { getTags } from "@store/common/actions";

export const AuditContext = createContext();

function AuditManager(props) {
    const { showLoader } = useSelector((state) => state.common);
    const {
        templates,
        nonAvailableTeams,
        availableTeams,
        categories,
        questions,
        disableLoading,
    } = useSelector((state) => state.callAudit);
    const [currentTemplate, setCurrentTemplate] = useState({});
    const [currentCategory, setCurrentCategory] = useState({});
    const { teams } = useSelector((state) => state.common);

    const {
        NO_TEMPLATES,
        CREATE_TEMPLATE,
        VIEW_TEMAPLATES,
        VIEW_CATEGORIES,
        VIEW_QUESTIONS,
        BOOLEAN_TYPE,
        RATING_TYPE,
        CRITICAL,
        RED_ALERT,
        ZERO_TOLERANCE,
        CUSTOM_TYPE,
        FATAL,
        NONE,
    } = auditConfig;
    const [activeTab, setActiveTab] = useState(VIEW_TEMAPLATES);
    const allTags = useSelector((state) => state.common.tags);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!allTags.length) {
            dispatch(getTags());
        }
        return () => dispatch(resetCallAudit());
    }, []);

    useEffect(() => {
        if (activeTab === CREATE_TEMPLATE) {
            setActiveTab(VIEW_TEMAPLATES);
        }
    }, [templates.length]);

    //Drawer state
    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    return (
        <AuditContext.Provider
            value={{
                activeTab,
                setActiveTab,
                templates,
                categories,
                teams,
                nonAvailableTeams,
                NO_TEMPLATES,
                CREATE_TEMPLATE,
                VIEW_TEMAPLATES,
                VIEW_CATEGORIES,
                VIEW_QUESTIONS,
                BOOLEAN_TYPE,
                RATING_TYPE,
                CRITICAL,
                RED_ALERT,
                ZERO_TOLERANCE,
                availableTeams,
                currentTemplate,
                setCurrentTemplate,
                currentCategory,
                setCurrentCategory,
                questions,
                disableLoading,
                visible,
                setVisible,
                showDrawer,
                onClose,
                CUSTOM_TYPE,
                FATAL,
                NONE,
            }}
        >
            <Spinner loading={showLoader}>
                <div className="audit__manager__container flex column">
                    {activeTab === CREATE_TEMPLATE && <CreateTemplate />}
                    {activeTab === VIEW_TEMAPLATES && <TemplateList />}
                    {activeTab === VIEW_CATEGORIES && <CategorySettings />}
                    {activeTab === VIEW_QUESTIONS && <QuestionSettings />}
                </div>
                {/* <div className="audit__manager__container flex column">
                    <div
                        className="flexShrink"
                        style={{
                            height: '100px',
                            width: '100%',
                            background: 'blue',
                        }}
                    ></div>
                    <div
                        className="flex1"
                        style={{
                            width: '100%',

                            overflow: 'scroll',
                        }}
                    >
                        <div
                            className="flex1"
                            style={{
                                width: '100%',
                                height: '1000px',
                                background: 'black',
                            }}
                        ></div>
                    </div>
                    <div
                        className="flexShrink"
                        style={{
                            height: '100px',
                            width: '100%',
                            background: 'blue',
                        }}
                    ></div>
                </div> */}
            </Spinner>
        </AuditContext.Provider>
    );
}

export default AuditManager;
