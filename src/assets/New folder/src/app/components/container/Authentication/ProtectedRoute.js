import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import Authentication from "./Authentication";
import authFormConfig from "@constants/AuthForm";
import { checkAuth } from "@store/auth/actions";
import { setCookie } from "@tools/helpers";
import commonConfig from "@constants/common/index";

const Landing = React.lazy(() => import("@container/Authentication/Landing"));

const ProtectedRoute = ({ component: Component, componentProps, ...rest }) => {
    const domain = useSelector((state) => state.common.domain);
    const isChecking = useSelector((state) => state.auth.isChecking);
    const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     // const params = new URLSearchParams(window.location.search);
    //     // const token = params.get('at');
    //     // if (token) {
    //     //     setCookie(commonConfig.ACCESS_TOKEN, token);
    //     // }
    //     dispatch(checkAuth());
    // }, []);

    return (
        <>
            {!isChecking ? (
                isLoggedIn ? (
                    <Route
                        {...rest}
                        render={() => <Component {...componentProps} />}
                    />
                ) : process.env.REACT_APP_APP_DOMAIN.split(" ").includes(
                      domain
                  ) ? (
                    <Landing renderForm={authFormConfig.AUTHFORM_REG} />
                ) : (
                    <Authentication
                        renderForm={authFormConfig.AUTHFORM_SIGNIN}
                    />
                )
            ) : null}
        </>
    );
};

export default ProtectedRoute;
