import React from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import { Button } from "antd";

export default function CalenderLogoCard(props) {
    return (
        <div
            className={
                props.logoRef.isDisabled ? "disabled logo-card" : "logo-card"
            }
            onClick={() =>
                props.logoRef.isDisabled
                    ? null
                    : props.handleLogoClick(props.logoRef.ref, props.noRedirect)
            }
            ref={props.logoRef.ref}
            data-card={props.dataCard}
        >
            {props.logoRef.isComingSoon && (
                <span className="coming-soon">Coming Soon</span>
            )}
            {props.isIntegrated && (
                <>
                    <span className="integrated">
                        <CheckCircleFilled />
                    </span>
                    <div className="disconnect-overlay">
                        <Button
                            type={"danger"}
                            shape={"round"}
                            onClick={(evt) =>
                                props.handleCalenderDisconnect(
                                    evt,
                                    props.dataCard
                                )
                            }
                        >
                            Disconnect
                        </Button>
                        {props.showSettings && (
                            <Button
                                type={"primary"}
                                shape={"round"}
                                onClick={(evt) => props.showSettingsClick(evt)}
                            >
                                SETTINGS
                            </Button>
                        )}
                    </div>
                </>
            )}
            <img
                className="logo-card-image"
                src={
                    require(`../../../static/images/${props.logoFileName}`)
                        .default
                }
                alt={props.alt ? props.alt : "logo"}
            />
        </div>
    );
}

CalenderLogoCard.defaultProps = {
    showSettingsClick: () => {},
};
