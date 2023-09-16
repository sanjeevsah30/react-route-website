import React from "react";
import isEmpty from "lodash/isEmpty";
import { Carousel } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getBillingAds } from "@store/billing/billing";
import Spinner from "@presentational/reusables/Spinner";
import { Link } from "react-router-dom";

export default function BillingAdsCarousel() {
    const dispatch = useDispatch();
    const { loading, data } = useSelector((state) => state.billing.ads);
    useEffect(() => {
        if (isEmpty(data.carousel)) {
            dispatch(getBillingAds());
        }
    }, []);
    return (
        <>
            {!isEmpty(data.carousel) && (
                <div className="billing__carousel">
                    <div className="billing__carousel--circleAbs billing__carousel--circleAbsLeft" />
                    <div className="billing__carousel--circleAbs" />
                    <Carousel autoplay>
                        {data.carousel.map((item, idx) => (
                            <div
                                key={`billing__carousel--slide${idx}`}
                                className="billing__carousel--slide"
                            >
                                <p className="billing__carousel--text">
                                    {item.addescription}
                                </p>
                                {item.is_external ? (
                                    <a
                                        href={item.cta_link}
                                        className="billing__carousel--cta"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item.cta_text}
                                    </a>
                                ) : (
                                    <Link
                                        to={item.cta_link}
                                        className="billing__carousel--cta"
                                    >
                                        {item.cta_text}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </Carousel>
                </div>
            )}
        </>
    );
}
