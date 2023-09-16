import * as types from "./types";
import apiErrors from "@apis/common/errors";
import commonConfig from "@constants/common/index";
import { checkUser, createAdmin, getToken } from "@apis/authentication";
import { setLoader, openNotification } from "../common/actions";
import authFormConfig from "@constants/AuthForm";
import { createNewDomain } from "@apis/domain";
import { getActiveUrl } from "@apis/common";
import routes from "@constants/Routes/index";
import { retrieveMailId } from "@apis/authentication/index";
import { eraseCookie, getCookie, setCookie } from "@tools/helpers";
import { setUserProperties } from "@tools/freshChat";
import { getDomainName } from "@apis/domain/index";
import axios from "axios";
import apiConfigs from "@apis/common/commonApiConfig";
import { useHistory } from "react-router-dom";
let retries = 0;
const maxRetries = 8;

export function setFormError(error) {
    return {
        type: types.SETFORMERROR,
        error,
    };
}

export function storeUser(userData) {
    return { type: types.STOREUSER, userData };
}

export function setIsAuthenticated(isAuthenticated) {
    return { type: types.ISAUTHENTICATED, isAuthenticated };
}

export function setIsSignUp(isSignUp) {
    return { type: types.IS_SIGNUP, isSignUp };
}
export function setIsSignUpConflict(hasConflict) {
    return { type: types.IS_SIGNUP_CONFLICT, hasConflict };
}

export function logoutUser() {
    // localStorage.clear();
    eraseCookie("authTokens");
    return { type: types.LOGOUTUSER };
}

export function checkAuth() {
    return async (dispatch, getState) => {
        const token = localStorage.getItem("at");
        let authTokens = localStorage.getItem("authTokens");
        if (token) {
            try {
                let res = await axios.post(
                    `${apiConfigs.HTTPS}${getState().common.domain}.${
                        apiConfigs.BASEURL
                    }/person/new_token/`,
                    { jwt_token: token }
                );
                localStorage.setItem("authTokens", JSON.stringify(res.data));
                authTokens = res.data;
                localStorage.removeItem("at");
            } catch (err) {}
        }

        if (!authTokens) {
            dispatch(setIsAuthenticated(false));
            return;
        }

        checkUser().then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                dispatch(setIsAuthenticated(false));
                dispatch(
                    setFormError({
                        status: true,
                        message: res.message,
                    })
                );
            } else {
                const userData = {
                    id: res.id,
                    email: res.email,
                    first_name: res.first_name
                        ? res.first_name.split(" ")[0]
                        : "",
                    full_name: res.first_name,
                    designation: res.designation,
                    timezone: res.timezone,
                    team: res.team,
                    ...res,
                };
                dispatch(setIsAuthenticated(true));
                localStorage.setItem("isTokenExpired", false);
                setUserProperties({
                    id: res.id,
                    email: res.email,
                    name: `${res.first_name} ${res.last_name}`,
                    domain: getState().common.domain,
                    team: res.team,
                });
                dispatch(storeUser(userData));
            }
        });
    };
}

export function createNewOrg(domain, authForm, email) {
    return (dispatch) => {
        dispatch(setLoader(true));
        if (domain === "") {
            dispatch(
                setFormError({
                    status: true,
                    message: authFormConfig.DOMAIN_EMPTY_ERROR,
                })
            );
            dispatch(setLoader(false));
        } else {
            if (authForm === authFormConfig.AUTHFORM_SIGNIN) {
                getDomainName(email).then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        dispatch(
                            setFormError({
                                status: true,
                                message:
                                    "Hmm.. Looks like you are not registered with us. Try to signup from below link ",
                            })
                        );
                        dispatch(setLoader(false));
                    } else if (res?.data?.domain) {
                        window.location = `${getActiveUrl(res.data.domain)}${
                            routes.SIGNIN
                        }?email=${email}`;
                        dispatch(setLoader(false));
                    } else {
                        dispatch(
                            setFormError({
                                status: true,
                                message: "Something went wrong!",
                            })
                        );
                        dispatch(setLoader(false));
                    }
                });
            } else {
                createNewDomain(domain, email).then((dcRes) => {
                    if (dcRes?.error_status === 409) {
                        dispatch(setIsSignUpConflict(true));
                        dispatch(setLoader(false));
                        dispatch(
                            setFormError({
                                status: true,
                                message:
                                    "Looks like org with same name exists. Please choose another org name.",
                            })
                        );
                        return;
                    }
                    if (dcRes.status === apiErrors.AXIOSERRORSTATUS) {
                        dispatch(
                            setFormError({
                                status: true,
                                message: dcRes.message,
                            })
                        );
                    } else if (dcRes.status === commonConfig.ERRORSTATUS) {
                        dispatch(
                            setFormError({
                                status: true,
                                message: authFormConfig.AUTH_DC_ERROR,
                            })
                        );
                    } else {
                        dispatch(setIsSignUp(true));
                    }
                    dispatch(setLoader(false));
                });
            }
        }
    };
}

export function signup(domain, details, invitationId, history) {
    return (dispatch) => {
        dispatch(setLoader(true));
        createAdmin(domain, details, invitationId).then((res) => {
            dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                if (retries < maxRetries) {
                    retries += 1;
                    dispatch(signup(domain, details, invitationId, history));
                } else {
                    dispatch(
                        setFormError({
                            status: true,
                            message: res.message,
                        })
                    );
                }
            } else {
                // setCookie(
                //     commonConfig.ACCESS_TOKEN,
                //     res.token,
                //     commonConfig.ACCESS_TOKEN_EXPIRE
                // );

                if (res?.token) {
                    localStorage.setItem(
                        "authTokens",
                        JSON.stringify(res?.token)
                    );
                    dispatch(checkAuth());
                }
            }
        });
    };
}

export function signin({ domain, details, suffix, history, email }) {
    return (dispatch) => {
        dispatch(setLoader(true));
        console.log(details);
        getToken(domain, details, suffix).then((res) => {
            console.log(res);
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                if (res?.is_redirect) {
                    history.push(res.redirect_url);
                }
                dispatch(
                    setFormError({
                        status: true,
                        message: res.message,
                    })
                );
            } else {
                console.log(res.data);
                if (res?.data?.access) {
                    localStorage.setItem(
                        "authTokens",
                        JSON.stringify(res.data)
                    );
                    dispatch(checkAuth());
                } else {
                    history.push(`/verify_otp/?email=${email}`);
                }
            }
            dispatch(setLoader(false));
        });
    };
}

export function retrieveEmailFromInvitationId(invitation_id) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        return retrieveMailId(getState().common.domain, invitation_id).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification(
                        "error",
                        "Invalid Invitation Id",
                        "Please double check your invitation link."
                    );
                }
                dispatch(setLoader(false));
                return res;
            }
        );
    };
}
