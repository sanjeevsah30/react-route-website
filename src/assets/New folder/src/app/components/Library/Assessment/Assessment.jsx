import routes from "@constants/Routes/index";
import { getAssessmentList } from "@store/library/librarySlice";
import { Card, Skeleton } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./assessment.scss";
import AssessmentCard from "./AssessmentCard/AssessmentCard";

function Assessment() {
    const dispatch = useDispatch();
    const { assessmentsList, loader } = useSelector(
        (state) => state.librarySlice.assessment
    );
    useEffect(() => {
        dispatch(getAssessmentList());
    }, []);

    return loader ? (
        <div className="library_folders_container paddingLR36 paddingTB36 row">
            <Card
                className="addFolder folder"
                hoverable
                style={{ width: 198, borderRadius: 12 }}
            >
                <div className="folder-top">
                    <Skeleton
                        active
                        avatar={{
                            shape: "square",
                            size: "small",
                        }}
                        paragraph={{ rows: 2 }}
                    />
                </div>
            </Card>
            <Card
                className="addFolder folder"
                hoverable
                style={{ width: 198, borderRadius: 12 }}
            >
                <div className="folder-top">
                    <Skeleton
                        active
                        avatar={{
                            shape: "square",
                            size: "small",
                        }}
                        paragraph={{ rows: 2 }}
                    />
                </div>
            </Card>
            <Card
                className="addFolder folder"
                hoverable
                style={{ width: 198, borderRadius: 12 }}
            >
                <div className="folder-top">
                    <Skeleton
                        active
                        avatar={{
                            shape: "square",
                            size: "small",
                        }}
                        paragraph={{ rows: 2 }}
                    />
                </div>
            </Card>
            <Card
                className="addFolder folder"
                hoverable
                style={{ width: 198, borderRadius: 12 }}
            >
                <div className="folder-top">
                    <Skeleton
                        active
                        avatar={{
                            shape: "square",
                            size: "small",
                        }}
                        paragraph={{ rows: 2 }}
                    />
                </div>
            </Card>
        </div>
    ) : (
        <div className="overflowYscroll" style={{ height: "95%" }}>
            <div className="assessment_container row">
                {assessmentsList.map((assessmet) => (
                    <Link
                        to={`${routes.LIBRARY.assessment}/create/${assessmet.id}`}
                    >
                        <AssessmentCard assessmet={assessmet} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default React.memo(Assessment);
