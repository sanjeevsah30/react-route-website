import "./settingUpAccount.scss";
import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useLocation } from "react-router";
import { startDomainCreation } from "@apis/authentication/index";
import { useSelector } from "react-redux";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function SettingUpAccount() {
    const domain = useSelector((state) => state.common.domain);
    const location = useLocation();
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        const urlSearchParamsObj = new URLSearchParams(location.search);
        if (urlSearchParamsObj.get("provider")) {
            startDomainCreation(
                domain,
                urlSearchParamsObj.get("provider"),
                location.search
            ).then((res) => {
                if (res.status) {
                    setHasError(true);
                    setTimeout(() => {
                        window.location.href = window.location.origin;
                    }, 1500);
                } else {
                    window.location.href = res.redirect;
                }
            });
        } else {
            setHasError(true);
            setTimeout(() => {
                window.location.href = window.location.origin;
            }, 1500);
        }
    }, [location]);
    return (
        <div className="suaWrapper">
            <div className="animated_loading">
                <i class="fa fa-calendar" aria-hidden="true"></i>
                <i class="fa fa-file-text-o" aria-hidden="true"></i>
                <i class="fa fa-phone" aria-hidden="true"></i>
                <i class="fa fa-video-camera" aria-hidden="true"></i>
            </div>
            {hasError ? (
                <p className="font24 ">Error occurred rolling back changes</p>
            ) : (
                <p className="font24 ">
                    Please <span className="bolder">do not refresh</span> the
                    page and wait while we setup your account
                </p>
            )}
            <Spin indicator={antIcon} />
        </div>
    );
}
