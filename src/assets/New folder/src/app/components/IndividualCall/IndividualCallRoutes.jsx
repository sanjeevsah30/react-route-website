import React, { useLayoutEffect } from "react";
import { Helmet } from "react-helmet";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import routes from "@constants/Routes/index";
import ActiveCallView from "./ActiveCallView";
import NotFound from "@presentational/reusables/NotFound";
import QmsView from "./Qms/QmsView";

export default function IndividualCallRoute() {
    const location = useLocation();
    const history = useHistory();

    useLayoutEffect(() => {
        const id = new URLSearchParams(location.search).get("id");
        const searchParams = location.search
            .split("&")
            .filter((e) => e.includes("ack_template_id") || !e.includes("id"))
            .join("&");
        if (id) {
            history.push(
                `/${location.pathname.split("/")[1]}/${id}?${searchParams}`
            );
        }
    }, []);
    return (
        <Switch>
            <Route
                path={[`${routes.CALL}/qms`, `${routes.CHAT}/qms`]}
                render={() => (
                    <>
                        <Helmet>
                            <meta charSet="utf-8" />
                            <title>QMS</title>
                        </Helmet>
                        <QmsView />
                    </>
                )}
            />
            <Route
                exact
                path={[
                    `${routes.CALL}/:id`,
                    `${routes.CHAT}/:id`,
                    `${routes.EMAIL}/:id`,
                ]}
                render={() => (
                    <>
                        <ActiveCallView />
                    </>
                )}
            />
            <Route
                render={() => {
                    return <NotFound backLink={routes.CALLS} />;
                }}
            />
        </Switch>
    );
}
