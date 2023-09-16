import {
    deleteAssessment,
    getGoogleForm,
    setInitialState,
} from "@store/library/librarySlice";
import { getDMYDate } from "@tools/helpers";
import { Popconfirm, Popover } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MoreSvg from "app/static/svg/MoreSvg";
import "./assessmentCard_style.scss";

function AssessmentCard({ assessmet }) {
    const [clicked, setClicked] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <div
            className="assessment_card curPoint"
            onClick={() => {
                dispatch(setInitialState({}));
                history.push("/library/assessment/create");
                // dispatch(getGoogleForm({ assessment_id: assessmet.id }))
            }}
        >
            <div className="card_body">
                <div className="min_width_0_flex_child">
                    <div className="card_title assess_name elipse_text font18 bold600">
                        {assessmet.title}
                    </div>
                    <div className="creation_data font12">
                        <span className="creaton_date dusty_gray_cl">
                            {getDMYDate(assessmet.created)}
                        </span>
                        {assessmet.created_by != null ? (
                            <>
                                <span>{" |  "}</span>
                                <span className="creator_name dove_gray_cl bold600 elipse_text">
                                    {assessmet.created_by.first_name}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div
                    className="icon_container"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Popover
                        title={`Select Options`}
                        placement="bottomRight"
                        trigger="click"
                        visible={clicked}
                        onVisibleChange={(visible) => setClicked(visible)}
                        overlayClassName={"library_card_more_options_popover"}
                        content={
                            <div className="popover_content bold400">
                                <Popconfirm
                                    title="Are you sure to delete this form?"
                                    onConfirm={(e) => {
                                        e.stopPropagation();
                                        setClicked(false);
                                        dispatch(
                                            deleteAssessment(assessmet.id)
                                        );
                                    }}
                                    onCancel={(e) => {
                                        setClicked(false);
                                        e.stopPropagation();
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <div className="option">Delete</div>
                                </Popconfirm>
                                {assessmet.destination_id && (
                                    <div className="option">
                                        <a
                                            target="_blank"
                                            href={`https://docs.google.com/spreadsheets/d/${assessmet.destination_id}`}
                                            style={{
                                                color: "inherit",
                                            }}
                                        >
                                            Responses
                                        </a>
                                    </div>
                                )}
                            </div>
                        }
                    >
                        <span onClick={(e) => e.stopPropagation()}>
                            <MoreSvg />
                        </span>
                    </Popover>
                </div>
            </div>
            <div className="card_fotter primary bold600 font14">
                {`${
                    assessmet?.question === 1 ? 0 : assessmet?.question - 1
                } Questions - ${assessmet?.total} Points`}
            </div>
        </div>
    );
}

export default AssessmentCard;
