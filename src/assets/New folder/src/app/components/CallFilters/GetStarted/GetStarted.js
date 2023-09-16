import React from "react";
import { useSelector } from "react-redux";
import commonConfig from "@constants/common/index";
import NothingHere from "app/static/svg/NothingHere";

function GetStarted({ handleActiveTab }) {
    const { designation } = useSelector((state) => state.auth);
    return (
        <div
            className="get_started  flex column alignCenter justifyCenter posRel"
            style={{
                height: "100%",
            }}
        >
            {designation === commonConfig.ADMIN ||
            designation === commonConfig.MANAGER ? (
                <div className="flex column alignCenter text-center">
                    <h3>Welcome To Convin’s Automated Call Analysis</h3>
                    <div className="get_started_steps">
                        <div className="stepnumber flex">
                            <div className="stepcircle">
                                <span>1</span>
                            </div>
                            <span className="steptext">
                                Create a call scoring template
                            </span>
                        </div>
                        <div className="stepdot">
                            <div></div>
                        </div>
                        <div className="stepnumber flex">
                            <div className="stepcircle">
                                <span>2</span>
                            </div>
                            <span className="steptext">
                                Define call scoring criterias
                            </span>
                        </div>
                        <div className="stepdot">
                            <div></div>
                        </div>
                        <div className="stepnumber flex">
                            <div className="stepcircle">
                                <span>3</span>
                            </div>
                            <span className="steptext">
                                Analyse calls automatically
                            </span>
                        </div>
                        <div className="stepdot">
                            <div></div>
                        </div>
                        <div className="stepnumber flex">
                            <div className="stepcircle">
                                <span>4</span>
                            </div>
                            <span className="steptext">
                                Find the right calls to listen to
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="get_started_nothinghere flex column alignCenter">
                        <NothingHere style={{ color: "#B3B6CC" }} />
                        <h3>Nothing to show in here</h3>
                    </div>
                    <h3>Contact the Admin or Manager to create a template</h3>
                </>
            )}
        </div>
    );
}

export default GetStarted;
