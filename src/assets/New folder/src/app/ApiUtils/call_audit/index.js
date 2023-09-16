import apiConfigs from "../common/commonApiConfig";
import { getError } from "../common";
import {
    getAccountAuditTopbarFilters,
    getTopbarFilters,
} from "@tools/searchFactory";
import { axiosInstance } from "@apis/axiosInstance";

export const getAuditTemplates = (domain, team_id) => {
    const url = +team_id
        ? `/audit/template/list_all/?team_id=${team_id}`
        : "/audit/template/list_all/";
    return axiosInstance
        .get(`${url}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAllMeetingAuditTemplates = (domain, id) => {
    const url = `/audit/templates/${id}/`;
    return axiosInstance
        .get(`${url}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createAuditTemplate = (domain, template) => {
    return axiosInstance
        .post(`/audit/template/create/`, template)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateAuditTemplate = (domain, id, template) => {
    return axiosInstance
        .patch(`/audit/template/update/${id}/`, template)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchSingleAuditTemplate = (domain, id) => {
    return axiosInstance
        .get(`/audit/template/retrieve/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteAuditTemplate = (domain, id) => {
    return axiosInstance
        .delete(`/audit/template/destroy/${id}/`)
        .then((res) => id)
        .catch((err) => getError(err));
};

export const fetchTemplateCategories = (domain, id) => {
    return axiosInstance
        .get(`/audit/category/list_all/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createTemplateCategory = (domain, category) => {
    return axiosInstance
        .post(`/audit/category/create/`, category)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateTemplateCategory = (domain, id, category) => {
    return axiosInstance
        .patch(`/audit/category/update/${id}/`, category)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchCategoryQuestion = (domain, id) => {
    return axiosInstance
        .get(`/audit/question/list_all/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createCategoryQuestion = (domain, question) => {
    return axiosInstance
        .post(`/audit/question/create/`, question)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateCategoryQuestion = (domain, id, category) => {
    return axiosInstance
        .patch(`/audit/question/update/${id}/`, category)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAuditScoreDetails = (domain, id) => {
    return axiosInstance
        .get(`/audit/score/list_all/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAuditScoreDetailsWithCreateApi = (domain, id, template) => {
    let url = `/audit/score/create_list/${id}/`;
    if (template) {
        url += `?template_id=${template}`;
    }
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createCallAuditScore = (domain, score) => {
    return axiosInstance
        .post(`/audit/score/create/`, score)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateCallAuditScore = (domain, id, score) => {
    return axiosInstance
        .patch(`/audit/score/update/${id}/`, score)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateCallAuditNotesMediaApi = (domain, id, media) => {
    return axiosInstance
        .patch(`audit/score/media/${id}/`, media, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteCallAuditNotesMediaApi = (domain, id) => {
    return axiosInstance
        .delete(`audit/score/media/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getCallAuditSatus = (domain, id, submit, payload = {}) => {
    let url = `/audit/score/status/${id}/`;
    if (submit) {
        payload = {
            ...payload,
            submit: 1,
        };
    }
    return axiosInstance
        .post(url, { ...payload, status_for: "manual" })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createQuestionSubFilters = (domain, payload) => {
    return axiosInstance
        .post(`/audit/filter/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const editQuestionSubFilters = (domain, payload, id) => {
    return axiosInstance
        .patch(`/audit/filter/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getQuestionSubFilters = (domain, id) => {
    return axiosInstance
        .get(`/audit/filter/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getDeletedSubFilters = (domain, id) => {
    return axiosInstance
        .get(`/audit/filter/recently-deleted-subfilters/?filter_id=${id}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const restoreSubFilter = (domain, id) => {
    return axiosInstance
        .post(`/audit/filter/recently-deleted-subfilters/`, {
            subfilter_id: id,
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createGlobalExpression = (domain, payload) => {
    return axiosInstance
        .post(`/audit/template_variable/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getGlobalExpression = (domain, id, nextUrl) => {
    return axiosInstance
        .get(nextUrl || `/audit/template_variable/?template_id=${id}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateGlobalExpression = (domain, id, payload) => {
    return axiosInstance
        .patch(`/audit/template_variable/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteGlobalExpression = (domain, id, payload) => {
    return axiosInstance
        .delete(`/audit/template_variable/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAiAuditScore = (domain, id, payload) => {
    return axiosInstance
        .post(`/audit/score/status/${id}/`, {
            ...payload,
            status_for: "ai",
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getCallAuditOverallDetails = (
    domain,
    topBarFilter,
    template_id,
    status_for
) => {
    return axiosInstance
        .post(`/audit/template/overall_score/`, {
            search_data: topBarFilter,
            template_id,
            status_for,
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAccountAuditOverallDetails = (
    domain,
    topBarFilter,
    template_id,
    status_for
) => {
    return axiosInstance
        .post(`/account/overall_score/`, {
            search_data: topBarFilter,
            template_id,
            status_for,
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getMeetingAuditTemplate = (domain, id) => {
    return axiosInstance
        .get(`/audit/template/retrieve-info/?meeting_id=${id}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const bulkUpdateCategories = (domain, data) => {
    return axiosInstance
        .patch(`/audit/category/seq_no/bulk_update/`, {
            categories_data: data,
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const bulkUpdateQuestions = (domain, data) => {
    return axiosInstance
        .patch(`/audit/question/seq_no/bulk_update/`, {
            questions_data: data,
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getSearchAuditTemplate = (domain, id, allQuestions) => {
    let url = `/audit/template/retrieve-info/?template_id=${id}`;
    url += allQuestions ? "&questions=all" : "";
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchCalibration = (domain, cid, qid) => {
    let url = `/audit/calibration/${cid}/?type=question_report&qid=${qid}`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAuditManagerCalibrationList = (domain) => {
    let url = `/audit/calibration/list_all/`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const removeCalibrationMeetings = (payload, id) => {
    let url = `/audit/calibration/update/${id}`;
    return axiosInstance
        .post(url, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const reCalibration = (domain, cid) => {
    let url = `https://${domain}.api.convin.ai/audit/calibration/${cid}/?type=calibrate`;
    return url;
};

export const singleCalibration = (domain, callid) => {
    let url = `/audit/template/run?type=audit&id=${callid}`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
export const createLeadScoreApi = (domain, formData) => {
    return axiosInstance
        .post(`/audit/lead_score/`, formData)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateLeadScoreApi = (domain, formData, id) => {
    return axiosInstance
        .patch(`/audit/lead_score/${id}/`, formData)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getLeadScoreApi = (domain, id) => {
    return axiosInstance
        .get(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/audit/lead_score/${id}/`
        )
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteLeadScoreApi = (domain, id) => {
    return axiosInstance
        .delete(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/audit/lead_score/${id}/`
        )
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteQuestionFilters = (domain, id) => {
    return axiosInstance
        .delete(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/audit/filter/destroy/${id}/`
        )
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const downloadReport = (domain, cid) => {
    let url = `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/audit/calibration/${cid}/?type=report&group_by_template=True`;
    return url;
};

export const createManualCall = (payload) => {
    return axiosInstance
        .post(`calendar/qms/`, payload)
        .then((res) => res)
        .catch((err) => getError(err));
};
