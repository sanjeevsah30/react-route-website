import { setIsSignUp } from "@store/auth/actions";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import MailSvg from "../../app/static/images/mailSent.svg";

import "./success.scss";
export default function SuccessInvitation() {
    const dispatch = useDispatch();
    //If user sign up from black friday page show a different success message to the user
    const [showOfferAppliedMessage, setShowOfferAppliedMessage] =
        useState(false);
    const location = useLocation();

    useLayoutEffect(() => {
        const offer = new URLSearchParams(location.search).get("offer");
        if (offer === "true") {
            setShowOfferAppliedMessage(true);
        }
    }, []);

    useEffect(() => {
        dispatch(setIsSignUp(false));
    }, []);
    return (
        <div className="successWrapper">
            <img src={MailSvg} alt="" className="success_icon" />
            {showOfferAppliedMessage ? (
                <>
                    <p className="font24 bold">
                        Congratulations! You've unlocked Convin's Real Black
                        Friday Offer.
                    </p>
                    <p className="font18">
                        Enjoy your 15-day free trial and 30% OFF on the annual
                        subscription.
                    </p>
                    <p className="font14">
                        We've sent you an email. Verify your email address to
                        get started.
                    </p>
                </>
            ) : (
                <>
                    <p className="font24 bold">Successfully sent mail</p>
                    <p className="font14">
                        Please open mail sent to you and verify your mail id.
                    </p>
                </>
            )}
        </div>
    );
}
