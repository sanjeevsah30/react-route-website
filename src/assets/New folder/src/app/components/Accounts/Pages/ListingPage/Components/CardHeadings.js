import {
    AI_SCORE_SORT_KEY,
    DEAL_SIZE_SORT_KEY,
    START_DATE_SORT_KEY,
    LAST_CONTACTED_SORT_KEY,
} from "@constants/Account/index";
import { setSortKeyAccounts } from "@store/accounts/actions";
import { Col, Row } from "antd";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import SortArrow from "app/components/Resuable/SortArrow/SortArrow";
import { AccountsContext } from "../../../Accounts";

function CardHeadings(props) {
    const { sortKey } = useContext(AccountsContext);
    const dispatch = useDispatch();
    const versionData = useSelector((state) => state.common.versionData);

    return (
        <Col
            span={24}
            className="paddingLR25  borderRadius6 bold600 dove_gray_cl uppercase font12"
        >
            <Row>
                <Col
                    span={versionData?.domain_type === "b2c" ? 6 : 8}
                    className="flex alignCenter"
                >
                    <div className="heading">Account Name</div>
                </Col>

                <Col
                    xl={4}
                    lg={4}
                    md={4}
                    sm={4}
                    xs={4}
                    className="flex alignCenter paddingLR16"
                >
                    <div className="heading">Owner</div>
                </Col>
                <Col
                    xl={3}
                    lg={3}
                    md={3}
                    sm={3}
                    xs={3}
                    className="flex alignCenter curPoint"
                    onClick={() => {
                        if (sortKey === START_DATE_SORT_KEY.dsc) {
                            return dispatch(
                                setSortKeyAccounts(START_DATE_SORT_KEY.asc)
                            );
                        }

                        dispatch(setSortKeyAccounts(START_DATE_SORT_KEY.dsc));
                    }}
                >
                    <div className="heading">Created Date</div>
                    <SortArrow
                        active={
                            sortKey === START_DATE_SORT_KEY.dsc ||
                            sortKey === START_DATE_SORT_KEY.asc
                        }
                        isDsc={sortKey === START_DATE_SORT_KEY.dsc}
                    />
                </Col>
                <Col
                    xl={3}
                    lg={3}
                    md={3}
                    sm={3}
                    xs={3}
                    className="flex alignCenter curPoint"
                    onClick={() => {
                        if (sortKey === LAST_CONTACTED_SORT_KEY.dsc) {
                            return dispatch(
                                setSortKeyAccounts(LAST_CONTACTED_SORT_KEY.asc)
                            );
                        }

                        dispatch(
                            setSortKeyAccounts(LAST_CONTACTED_SORT_KEY.dsc)
                        );
                    }}
                >
                    <div className="heading">Last Contacted</div>
                    <SortArrow
                        active={
                            sortKey === LAST_CONTACTED_SORT_KEY.dsc ||
                            sortKey === LAST_CONTACTED_SORT_KEY.asc
                        }
                        isDsc={sortKey === LAST_CONTACTED_SORT_KEY.dsc}
                    />
                </Col>
                <Col
                    xl={2}
                    lg={2}
                    md={2}
                    sm={2}
                    xs={2}
                    className="flex alignCenter curPoint"
                    onClick={() => {
                        if (sortKey === DEAL_SIZE_SORT_KEY.dsc) {
                            return dispatch(
                                setSortKeyAccounts(DEAL_SIZE_SORT_KEY.asc)
                            );
                        }

                        dispatch(setSortKeyAccounts(DEAL_SIZE_SORT_KEY.dsc));
                    }}
                >
                    <div className="heading">Deal Size</div>
                    <SortArrow
                        active={
                            sortKey === DEAL_SIZE_SORT_KEY.dsc ||
                            sortKey === DEAL_SIZE_SORT_KEY.asc
                        }
                        isDsc={sortKey === DEAL_SIZE_SORT_KEY.dsc}
                    />
                </Col>
                <Col
                    xl={3}
                    lg={3}
                    md={3}
                    sm={3}
                    xs={3}
                    className="flex alignCenter"
                >
                    <div className="heading">Status/Stage</div>
                </Col>
                {versionData?.domain_type === "b2c" && (
                    <Col
                        xl={2}
                        lg={2}
                        md={2}
                        sm={2}
                        xs={2}
                        className="flex alignCenter curPoint"
                        onClick={() => {
                            if (sortKey === AI_SCORE_SORT_KEY.dsc) {
                                return dispatch(
                                    setSortKeyAccounts(AI_SCORE_SORT_KEY.asc)
                                );
                            }

                            dispatch(setSortKeyAccounts(AI_SCORE_SORT_KEY.dsc));
                        }}
                    >
                        <div className="heading">Acc Score</div>
                        <SortArrow
                            active={
                                sortKey === AI_SCORE_SORT_KEY.dsc ||
                                sortKey === AI_SCORE_SORT_KEY.asc
                            }
                            isDsc={sortKey === AI_SCORE_SORT_KEY.dsc}
                        />
                    </Col>
                )}
            </Row>
        </Col>
    );
}

export default CardHeadings;
