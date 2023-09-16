import "./applyCoupon.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    LoadingOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import coupon, {
    applyCoupon,
    clearCoupon,
    clearError,
} from "@store/coupon/coupon";

export default function ApplyCoupon({
    billingCycle,
    nol,
    enteredCode,
    setEnteredCode,
}) {
    const dispatch = useDispatch();
    const { loading, data, error } = useSelector((state) => state.coupon);

    const handleCodeChange = ({ target: { value } }) => {
        if (error?.is_error) {
            dispatch(clearError());
        }
        setEnteredCode(value.toUpperCase());
    };
    const handleApplyCoupon = () => {
        if (enteredCode) {
            dispatch(
                applyCoupon({
                    plan_id: billingCycle,
                    licenses: nol,
                    coupon: enteredCode,
                })
            );
        }
    };

    useEffect(() => {
        if (error?.is_error || data.coupon_applied) {
            setEnteredCode("");
        }
    }, [data?.error, data]);

    const ButtonContent = () => {
        if (loading) {
            return <LoadingOutlined />;
        }
        if (!!error?.is_error) {
            return (
                <>
                    <CloseOutlined
                        onClick={(e) => {
                            e.stopPropagation();
                            if (error?.is_error) {
                                dispatch(clearError());
                            }
                        }}
                    />
                    <span className="marginL12">COUPON INVALID</span>
                </>
            );
        }
        if (data.coupon_valid) {
            return (
                <>
                    <CheckOutlined />
                    <span className="marginL12">COUPON APPLIED</span>
                </>
            );
        } else {
            return "Apply Coupon";
        }
    };
    return (
        <div className="applyCoupon">
            <p className="applyCoupon__label">Apply Coupon Code</p>
            <div className="applyCoupon__inputContainer">
                <input
                    type="text"
                    name="applyCoupon__input"
                    placeholder="Enter Coupon code"
                    value={enteredCode}
                    onChange={handleCodeChange}
                    autoComplete="off"
                />
                <button
                    className={`applyCoupon__inputContainer--btn ${
                        data?.coupon_applied ? "applied" : ""
                    } ${error?.is_error ? "error" : ""} ${
                        enteredCode || billingCycle === -1 ? "" : "disabled"
                    }`}
                    onClick={handleApplyCoupon}
                >
                    <ButtonContent />
                </button>
            </div>
            {data.coupon_valid && (
                <div
                    className="primary curPoint"
                    onClick={() => {
                        setEnteredCode("");
                        dispatch(clearCoupon());
                    }}
                >
                    Remove Coupon
                </div>
            )}
        </div>
    );
}

ApplyCoupon.defaultProps = {
    billingCycleObj: { id: -1 },
    nol: 5,
};
