import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { withRouter, Redirect } from "react-router-dom";
import SignInForm from "@presentational/Authentication/SignInForm";
import SignUpForm from "@presentational/Authentication/SignUpForm";
import authFormConfig from "@constants/AuthForm";
import routes from "@constants/Routes/index";
import {
    checkAuth,
    signup,
    setFormError,
    signin,
    retrieveEmailFromInvitationId,
} from "@store/auth/actions";
import { getActiveUrl } from "@apis/common/index";

const Authentication = (props) => {
    const domain = useSelector((state) => state.common.domain);
    const isLoading = useSelector((state) => state.common.showLoader);
    const isUserAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );
    const apiError = useSelector((state) => state.auth.formError);
    const dispatch = useDispatch();
    const [invitationId, setInvitationId] = useState(false);
    const [invitedUserMailId, setInvitedUserMailId] = useState("");
    const [invitedUserName, setInvitedUserName] = useState("");
    const [provider, setProvider] = useState("");
    const history = useHistory();

    useEffect(() => {
        let params = new URLSearchParams(props.location.search);
        if (params.get("invitation_id")) {
            setInvitationId(params.get("invitation_id"));
            dispatch(
                retrieveEmailFromInvitationId(params.get("invitation_id"))
            ).then((res) => {
                if (!res.status) {
                    setInvitedUserMailId(res.email);
                }
            });
        }
        // if (
        //     props.renderForm === authFormConfig.AUTHFORM_REG &&
        //     !params.get('invitation_id')
        // ) {
        //     window.location = `${getActiveUrl('app')}`;
        // }
        if (params.get("email")) {
            setInvitedUserMailId(params.get("email"));
        }
        if (params.get("first_name")) {
            setInvitedUserName(params.get("first_name"));
        }
        if (params.get("provider")) {
            setProvider(params.get("provider"));
            if (props.renderForm === authFormConfig.AUTHFORM_SIGNIN) {
                dispatch(
                    signin({
                        domain,
                        details: {},
                        suffix: props.location.search,
                        history,
                        email: params.get("email"),
                    })
                );
            }
        }
        if (!isUserAuthenticated) {
            dispatch(checkAuth());
        }
        return () => {
            dispatch(
                setFormError({
                    status: false,
                    message: "",
                })
            );
        };
    }, []);

    const submitForm = (values) => {
        dispatch(setFormError({ status: false }));
        let data = prepareData(values);
        if (props.renderForm === authFormConfig.AUTHFORM_REG) {
            dispatch(signup(domain, data, invitationId, props.history));
        } else {
            dispatch(
                signin({
                    domain,
                    details: data,
                    suffix: props.location.search,
                    history,
                    email: values.email,
                })
            );
        }
    };

    const prepareData = (values) => {
        var data = new FormData();
        if (props.renderForm === authFormConfig.AUTHFORM_REG) {
            data.append("first_name", values.first_name);
            data.append("password", values.password);
            data.append("email", values.email);
            data.append("username", values.email.toLowerCase());
            data.append("timezone", values.time_zone);
            if (provider) {
                data.append("provider", provider);
            }
        } else {
            data.append("password", values.password);
            data.append("email", values.email);
        }
        return data;
    };

    return (
        <>
            {isUserAuthenticated && <Redirect to={routes.CALLS} />}
            {props.renderForm === authFormConfig.AUTHFORM_SIGNIN ? (
                <SignInForm
                    orgName={domain}
                    handleSubmit={submitForm}
                    isLoading={isLoading}
                    apiError={apiError}
                    invitedUserMailId={invitedUserMailId}
                />
            ) : (
                <SignUpForm
                    orgName={domain}
                    handleSubmit={submitForm}
                    isLoading={isLoading}
                    apiError={apiError}
                    invitedUserMailId={invitedUserMailId}
                    invitedUserName={invitedUserName}
                />
            )}
        </>
    );
};

export default withRouter(Authentication);
