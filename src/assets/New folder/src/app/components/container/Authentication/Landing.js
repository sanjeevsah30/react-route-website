import React, { useState, useEffect } from "react";
import { Redirect, withRouter } from "react-router-dom";
import AuthForm from "@presentational/Authentication/AuthForm";
import authFormConfig from "@constants/AuthForm";
import commonConfig from "@constants/common";
import { useSelector, useDispatch } from "react-redux";
import { setFormError, createNewOrg } from "@store/auth/actions";
import { extractDomain } from "@tools/helpers";
import routes from "@constants/Routes/index";
import useSearchParams from "hooks/useSearchParams";

const Landing = (props) => {
    const dispatch = useDispatch();
    const { formError, isSignUp } = useSelector((state) => state.auth);
    const isLoading = useSelector((state) => state.common.showLoader);
    const initFormError = {
        status: false,
        message: "",
    };
    const [authForm, setauthForm] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        return () => {
            dispatch(setFormError(initFormError));
        };
    }, []);

    useEffect(() => {
        if (searchParams.get("error")) {
            dispatch(
                setFormError({
                    status: true,
                    message: searchParams.get("error"),
                })
            );
        }
        if (searchParams.get("isUser") === "true") {
            setauthForm(authFormConfig.AUTHFORM_SIGNIN);
        }
    }, [searchParams]);

    useEffect(() => {
        setauthForm(props.renderForm);
    }, [props.renderForm]);

    const handleAuthForm = () => {
        dispatch(setFormError(initFormError));

        if (authForm === authFormConfig.AUTHFORM_SIGNIN) {
            setauthForm(authFormConfig.AUTHFORM_REG);
        } else {
            setauthForm(authFormConfig.AUTHFORM_SIGNIN);
        }
    };

    const handleSubmit = (values) => {
        let domain =
            !values.domain && values.email
                ? extractDomain(values.email)
                : values.domain;
        dispatch(createNewOrg(domain, authForm, values.email));
    };

    return (
        <>
            {isSignUp && <Redirect to={routes.SUCCESS_MAIL} />}
            {authForm === authFormConfig.AUTHFORM_SIGNIN ? (
                <AuthForm
                    handleAuthForm={handleAuthForm}
                    formCallout={authFormConfig.SIGNIN_CALLOUT}
                    formLabel={authFormConfig.FORM_LABEL_SIGNIN}
                    formCta={authFormConfig.SIGNIN_CTA_CALLOUT}
                    fromNavLabel={authFormConfig.AUTH_SIGNIN_NAV_LABEL}
                    fromNavLink={authFormConfig.AUTH_SIGNIN_NAV_LINK}
                    handleSubmit={handleSubmit}
                    formError={formError}
                    isLoading={isLoading}
                />
            ) : (
                <AuthForm
                    handleAuthForm={handleAuthForm}
                    formCallout={authFormConfig.REG_CALLOUT}
                    formLabel={authFormConfig.FORM_LABEL_SIGNUP}
                    formCta={commonConfig.CTA_CALLOUT}
                    fromNavLabel={authFormConfig.AUTH_REG_NAV_LABEL}
                    fromNavLink={authFormConfig.AUTH_REG_NAV_LINK}
                    handleSubmit={handleSubmit}
                    formError={formError}
                    isLoading={isLoading}
                    isSignup
                />
            )}
        </>
    );
};

export default withRouter(Landing);
