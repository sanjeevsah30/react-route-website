import "./Onboarding.scss";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Progress } from "antd";
import {
    LeftOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
    RightOutlined,
    RightCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeContext } from "@container/Home/Home";

const SIDEBAR_SELECTOR = ".ant-menu-item.onboard-user";
export default function Onboarding() {
    const {
        common: { versionData },
    } = useSelector((state) => state);
    const [isOpened, setIsOpened] = useState(false);
    const onboardingData = useSelector(
        (state) => state.auth.onboarding_progress
    );
    const domain = useSelector((state) => state.common.domain);
    const [contentClientData, setContentClientData] = useState({});
    const [sidebarClientData, setSidebarClientData] = useState({});
    const onboardingRef = useRef(null);
    useEffect(() => {
        if (onboardingRef.current) {
            setContentClientData(onboardingRef.current.getBoundingClientRect());
            setSidebarClientData(
                document.querySelector(SIDEBAR_SELECTOR).getBoundingClientRect()
            );
        }
    }, [isOpened]);
    useEffect(() => {
        const handleEsc = (evt) => {
            if (evt.key === "Escape" || evt.keyCode === 27) {
                setIsOpened(false);
            }
        };
        if (
            onboardingData &&
            onboardingData?.completed !== onboardingData.total
        ) {
            onboardingRef.current &&
                setContentClientData(
                    onboardingRef.current.getBoundingClientRect()
                );
            setSidebarClientData(
                document.querySelector(SIDEBAR_SELECTOR).getBoundingClientRect()
            );
            document.addEventListener("keyup", handleEsc);
        }
        return () => {
            document.addEventListener("keyup", handleEsc);
        };
    }, [onboardingData]);

    const getLink = (link) => {
        const url = new URL(link);
        let data = {};
        if (url.hostname === `${domain}.convin.ai`) {
            data.updatedLink = `${url.pathname}${url.search}`;
            data.isSameLink = true;
        } else {
            data.updatedLink = link;
            data.isSameLink = false;
        }
        return data;
    };
    return (
        <>
            {onboardingData &&
            onboardingData?.completed !== onboardingData.total ? (
                <div
                    className={`onboarding_Wrapper ${isOpened ? "opened" : ""}`}
                    ref={onboardingRef}
                    style={{
                        top: `${
                            sidebarClientData?.top -
                            contentClientData.height +
                            150
                        }px`,
                        left: isOpened
                            ? `${sidebarClientData.width}px`
                            : `-${
                                  contentClientData.width -
                                  sidebarClientData.width -
                                  25
                              }px`,
                    }}
                >
                    <div className="onboarding__content">
                        <div className="onboarding__content--top">
                            <p className="font22 bolder margin0 lineHightN">
                                Getting Started
                            </p>
                            <p className="font14 margin0">
                                Here are a few things to get you started
                            </p>
                            <Progress
                                status="active"
                                percent={
                                    (onboardingData.completed /
                                        onboardingData.total) *
                                    100
                                }
                            />
                        </div>
                        <ul className="onboarding__stepsList">
                            {onboardingData.steps.map((step, idx) => {
                                const linkData = getLink(step.link);
                                return (
                                    <li
                                        // key={step.name}
                                        key={`onboarding__stepsList--item${idx}`}
                                        className={`onboarding__stepsList--item ${
                                            step.done ? "done" : ""
                                        }`}
                                    >
                                        {linkData.isSameLink ? (
                                            <Link
                                                to={linkData.updatedLink}
                                                onClick={() =>
                                                    setIsOpened(false)
                                                }
                                            >
                                                <span className="onboarding__listItem--iconWrapper">
                                                    {step.done ? (
                                                        <CheckCircleFilled />
                                                    ) : (
                                                        <ClockCircleFilled />
                                                    )}
                                                </span>
                                                <span className="font14 flex1">
                                                    {step.msg}
                                                </span>
                                                {!step.done && (
                                                    <span className="onboarding__listItem--iconWrapperRight">
                                                        <RightCircleOutlined />
                                                    </span>
                                                )}
                                            </Link>
                                        ) : (
                                            <a
                                                href={linkData.updatedLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span className="onboarding__listItem--iconWrapper">
                                                    {step.done ? (
                                                        <CheckCircleFilled />
                                                    ) : (
                                                        <ClockCircleFilled />
                                                    )}
                                                </span>
                                                <span className="font15">
                                                    {step.msg}
                                                </span>
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {versionData.logo ? (
                        <></>
                    ) : (
                        <Button
                            className="boxShadow"
                            onClick={() => {
                                setIsOpened((s) => !s);
                            }}
                        >
                            {isOpened ? <LeftOutlined /> : <RightOutlined />}
                        </Button>
                    )}
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
