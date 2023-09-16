import {
    getAuditTemplateRequestForFilterSettings,
    getDeletedSubFiltersRequest,
    getQuestionSubFiltersRequest,
} from "@store/call_audit/actions";

import React, { createContext, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import auditConfig from "@constants/Audit";
import Spinner from "@presentational/reusables/Spinner";

import FallbackUI from "@presentational/reusables/FallbackUI";
import "./style.scss";
import ErrorCheckModal from "./ErrorCheckModal";
import CIFiltersHome from "./CIFiltersHome";

const Filter = React.lazy(() => import("./CIFilter"));

export const FilterSettingsContext = createContext();

function CIFiltersSettings(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [questionToEdit, setQuestionToEdit] = useState(null);
    const [editFilters, setEditFilters] = useState(false);
    const [template_id, setTemplate_id] = useState(null);
    const {
        EDIT_FILTERS_TAB,
        CREATE_FILTERS_TAB,
        DELETED_FILTERS_TAB,
        CATEGORY_LIST_TAB,
    } = auditConfig;

    const { showLoader, domain } = useSelector((state) => state.common);
    const {
        filter,
        filtersSettings: { template },
    } = useSelector((state) => state.callAudit);

    const [activeTab, setActiveTab] = useState(CATEGORY_LIST_TAB);

    const getQuestionSubFilters = (id, cb) => {
        dispatch(getQuestionSubFiltersRequest(id, cb));
    };

    useEffect(() => {
        // if (history?.location?.pathname && activeTab === CATEGORY_LIST_TAB) {
        //     const temp = history.location.pathname.split('/');
        //     const [temp_id] = temp.reverse();
        //     if (typeof parseInt(temp_id) === 'number') {
        //         setTemplate_id(temp_id);
        //         dispatch(getAuditTemplateRequestForFilterSettings(temp_id));
        //     }
        // }
        // if (activeTab === EDIT_FILTERS_TAB) {
        //     getQuestionSubFilters(questionToEdit.id);
        // }
        // if (activeTab === DELETED_FILTERS_TAB) {
        //     dispatch(getDeletedSubFiltersRequest(filter.id));
        // }
    }, [activeTab]);

    const handleClick = (tab, question) => {
        setActiveTab(tab);
        setQuestionToEdit(question);
    };

    const [errorCmdVisible, setErrorCmdVisible] = useState(false);

    return (
        <Spinner loading={false}>
            <Suspense fallback={<FallbackUI />}>
                <FilterSettingsContext.Provider
                    value={{
                        setErrorCmdVisible,
                        errorCmdVisible,
                        template,
                        template_id,
                    }}
                >
                    <div className="audit__manager__container hidden__manager flex column">
                        {activeTab === CATEGORY_LIST_TAB && (
                            <CIFiltersHome
                                handleClick={handleClick}
                                getQuestionSubFilters={getQuestionSubFilters}
                                template_id={template_id}
                                setActiveTab={setActiveTab}
                            />
                        )}

                        {activeTab === CREATE_FILTERS_TAB && (
                            <Filter
                                handleActiveTab={setActiveTab}
                                questionToEdit={questionToEdit}
                                editFilters={editFilters}
                                setEditFilters={setEditFilters}
                                activeTab={activeTab}
                            />
                        )}
                        {activeTab === EDIT_FILTERS_TAB && (
                            <Filter
                                handleActiveTab={setActiveTab}
                                questionToEdit={questionToEdit}
                                editFilters={editFilters}
                                setEditFilters={setEditFilters}
                                editEnable={true}
                                activeTab={activeTab}
                            />
                        )}
                        {activeTab === DELETED_FILTERS_TAB && (
                            <Filter
                                handleActiveTab={setActiveTab}
                                questionToEdit={questionToEdit}
                                editFilters={editFilters}
                                setEditFilters={setEditFilters}
                                editEnable={true}
                                activeTab={activeTab}
                            />
                        )}
                    </div>
                    <ErrorCheckModal />
                </FilterSettingsContext.Provider>
            </Suspense>
        </Spinner>
    );
}

export default CIFiltersSettings;
