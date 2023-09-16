import React, { createContext } from "react";
import useHandleActiveCall from "./Hooks/useHandleActiveCall";
import { Link, useParams } from "react-router-dom";
import { Button, Result } from "antd";
import routes from "@constants/Routes/index";
import Spinner from "@presentational/reusables/Spinner";
import "./activeCallView.scss";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { getDomainMappingName } from "@tools/helpers";

const IndividualCall = React.lazy(() => import("./IndividualCall"));
export const ActiveCallContext = createContext();

export default function ActiveCallView() {
    const { id } = useParams();
    const { activeCall, updateCall, hasError, isLoadingCall } =
        useHandleActiveCall({ id });
    const { domain } = useSelector((state) => state.common);
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{`${getDomainMappingName(domain)}-${id}`}</title>
            </Helmet>

            <ActiveCallContext.Provider value={{ activeCall, updateCall }}>
                {hasError ? (
                    <Result
                        status="404"
                        title="404"
                        subTitle="Sorry, the meeting you were looking for does not exist."
                        extra={
                            <Link to={routes.HOME}>
                                {" "}
                                <Button type="primary">Back Home</Button>
                            </Link>
                        }
                    />
                ) : (
                    <Spinner loading={isLoadingCall} className="call_loader">
                        {activeCall.id ? <IndividualCall /> : <></>}
                    </Spinner>
                )}
            </ActiveCallContext.Provider>
        </>
    );
}
