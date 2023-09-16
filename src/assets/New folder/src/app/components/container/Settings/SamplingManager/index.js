import { Button, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getSalesTasks,
    openNotification,
} from "../../../../../store/common/actions";
import {
    getConfTools,
    getSamplingRules,
} from "../../../../../store/search/actions";
import { getAuditors } from "../../../../../store/userManagerSlice/userManagerSlice";
import { uid, flattenTeams } from "../../../../../tools/helpers";
import { decodeTracker } from "../../../../../tools/searchFactory";
import apiErrors from "../../../../ApiUtils/common/errors";
import { deleteSamplingRuleApi } from "../../../../ApiUtils/settings/index";
import PlusSvg from "../../../../static/svg/PlusSvg";
import CreateRuleModal from "./CreateRuleModal";
import SamplingRuleCard from "./SamplingRuleCard";
import "./sampling_manager.style.scss";
import { NoData } from "@presentational/reusables/index";

const SamplingManager = () => {
    const [modalVisible, isModalVisible] = useState(false);
    // const [samplingRules, setSamplingRules] = useState([]);
    const {
        domain,
        filterTeams: { teams },
        filterReps: { reps },
        salesTasks,
    } = useSelector((state) => state.common);
    const { auditors } = useSelector((state) => state.userManagerSlice);
    const { confTools, samplingRules, samplingRulesLoading } = useSelector(
        (state) => state.search
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (!samplingRules.length) {
            dispatch(getSamplingRules());
        }
    }, []);

    useEffect(() => {
        if (!salesTasks.length) {
            dispatch(getSalesTasks({}));
        }
        if (!confTools.length) {
            dispatch(getConfTools());
        }
        if (!auditors.length) {
            dispatch(getAuditors());
        }
    }, []);

    const onDeleteRule = (id) => {
        deleteSamplingRuleApi(domain, id)
            .then((res) => {
                if (res?.status === apiErrors.AXIOSERRORSTATUS) {
                    return openNotification("error", "Error", res.message);
                }
                dispatch(getSamplingRules());
                openNotification(
                    "success",
                    "Success",
                    "Sampling rule deleted successfully"
                );
            })
            .catch((err) => openNotification("success", "Success", err));
    };

    const getCardInfo = (rules) => {
        return rules?.map(
            ({ id, name, audit_type: auditType, dist_or_alloc, filters }) => {
                const decodedFilters = decodeTracker(filters);
                if (auditType === "manual") {
                    const auditorIds = dist_or_alloc.reduce((ids, alloc) => {
                        return [...ids, ...alloc.auditors];
                    }, []);
                    return {
                        id,
                        name,
                        auditType,
                        reps: getNames(decodedFilters.repId, reps, "name"),
                        teams: getNames(
                            decodedFilters.teamId,
                            flattenTeams(teams),
                            "name"
                        ),
                        auditors: getNames(auditorIds, auditors, "first_name"),
                    };
                }
                return {
                    id,
                    name,
                    auditType,
                    reps: getNames(decodedFilters.repId, reps, "name"),
                    teams: getNames(
                        decodedFilters.teamId,
                        flattenTeams(teams),
                        "name"
                    ),
                };
            }
        );
    };

    const getNames = (ids, data, field) => {
        const idSet = new Set(ids);
        return data
            ?.filter(({ id }) => idSet.has(String(id)) || idSet.has(id))
            ?.map((data) => data[field]);
    };

    return (
        <>
            <div className="sampling_manager">
                <div className="sampling_manager--header">
                    <span className="sampling_manager--title">
                        Sampling Manager
                    </span>
                    <Button type="primary" onClick={() => isModalVisible(true)}>
                        <PlusSvg />
                        Create Rule
                    </Button>
                </div>
                <Row
                    gutter={[0, 24]}
                    className="sampling_manager--rule_card_container"
                >
                    {samplingRulesLoading ? (
                        Array(4)
                            .fill(0)
                            .map((_) => (
                                <div className="card_skeleton" key={uid()}>
                                    <Skeleton active />
                                </div>
                            ))
                    ) : samplingRules?.length ? (
                        getCardInfo(samplingRules)?.map((rule, idx) => (
                            <SamplingRuleCard
                                key={idx}
                                {...rule}
                                onDelete={onDeleteRule}
                            />
                        ))
                    ) : (
                        <div className="width100p height100p flex alignCenter justifyCenter marginT20">
                            <NoData description="Create A Sampling rule" />
                        </div>
                    )}
                </Row>
            </div>
            <CreateRuleModal
                onCancel={() => isModalVisible(false)}
                visible={modalVisible}
            />
        </>
    );
};

export default SamplingManager;
