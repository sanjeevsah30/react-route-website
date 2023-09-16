import {
    clearCISnippets,
    getCIInsightCompetition,
    getCIInsightFeature,
    getCIInsightObjection,
    getCIInsightQuestion,
    getCIInsightReasons,
    getCIInsightSentiment,
    getCIInsightSnippets,
    setSnippetsInitialLoad,
} from "@store/cutsomerIntelligence/ciInsightsSlice";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { CIMainContext } from "./CIDashboard";
import InsightCard from "./CIInsights/InsightCard";
import MonologueDrawer from "./MonologueDrawer";
import { HomeContext } from "app/components/container/Home/Home";

/*
{
    "data": [
        {
            "insight__name": "Sound Issue",
            "occurance": 0,
            "calls": 0,
            "account": 0
        },
        {
            "insight__name": "",
            "occurance": 0,
            "calls": 0,
            "account": 0
        },
        {
            "insight__name": "Sound Issue 1",
            "occurance": 0,
            "calls": 0,
            "account": 0
        }
    ],
    "analyzed_calls": 0,
    "total_calls": 4408,
    "insights": ""
}

*/

export default function CIInsightsDashborad() {
    const dispatch = useDispatch();
    const {
        common: {
            filterReps,
            filterDates,
            filterCallDuration,
            filterTeams,
            activeCallTag,
            teams,
        },
        CIInsightsSlice: {
            reasons,
            objection,
            question,
            feature,
            competition,
            sentiment,
            snippets,
            nextSnippetsUrl,
            snippetsInitialLoad,
        },
    } = useSelector((state) => state);

    const { getPayload, activeStage } = useContext(CIMainContext);
    const { meetingType } = useContext(HomeContext);

    useEffect(() => {
        if (!teams?.length) {
            return;
        }
        const payload = getPayload();
        const api1 = dispatch(getCIInsightReasons(payload));
        const api2 = dispatch(getCIInsightObjection(payload));
        const api3 = dispatch(getCIInsightQuestion(payload));
        const api4 = dispatch(getCIInsightFeature(payload));

        const api5 = dispatch(getCIInsightCompetition(payload));
        const api6 = dispatch(getCIInsightSentiment(payload));

        return () => {
            api1?.abort();
            api2?.abort();
            api3?.abort();
            api4?.abort();
            api5?.abort();
            api6?.abort();
        };
    }, [
        teams,
        filterTeams.active,
        filterReps.active,
        filterCallDuration.active,
        filterDates.active,
        activeStage,
        activeCallTag,
        meetingType,
    ]);

    const [showDrawer, setShowDrawer] = useState(false);

    const handleSnippetClick = (id) => {
        setShowDrawer(true);
        dispatch(setSnippetsInitialLoad(true));
        dispatch(getCIInsightSnippets({ id, payload: getPayload() }));
    };

    const getNext = useCallback(() => {
        dispatch(
            getCIInsightSnippets({
                next: nextSnippetsUrl,
                payload: getPayload(),
            })
        );
    }, [nextSnippetsUrl]);

    const handleClose = () => {
        setShowDrawer(false);
        dispatch(clearCISnippets());
    };
    return (
        <>
            <div className="ci_cards_container paddingR8">
                <InsightCard
                    change={reasons.analyzed_calls / reasons.total_calls}
                    data={reasons.data}
                    total={reasons.analyzed_calls}
                    title="Conversation Reasons"
                    loading={reasons.loading}
                    onSnippetClick={handleSnippetClick}
                    total_acc={reasons.total_accounts}
                />
                <InsightCard
                    change={objection.analyzed_calls / objection.total_calls}
                    data={objection.data}
                    total={objection.analyzed_calls}
                    color="#7030FE"
                    title="Objections"
                    type="objection"
                    loading={objection.loading}
                    onSnippetClick={handleSnippetClick}
                    total_acc={objection.total_accounts}
                />
                <InsightCard
                    change={question.analyzed_calls / question.total_calls}
                    data={question.data}
                    total={question.analyzed_calls}
                    title="Questions"
                    color="#F564A9"
                    loading={question.loading}
                    type="question"
                    onSnippetClick={handleSnippetClick}
                    total_acc={question.total_accounts}
                />
                {/* <GeoInsightCard
                change={geo.analyzed_calls / geo.total_calls}
                data={geo.data}
                total={geo.analyzed_calls}
                title="Regions"
            /> */}
                <InsightCard
                    change={feature.analyzed_calls / feature.total_calls}
                    data={feature.data}
                    total={feature.analyzed_calls}
                    title="Product Features"
                    color="#FE654F"
                    loading={feature.loading}
                    type="feature"
                    onSnippetClick={handleSnippetClick}
                    total_acc={feature.total_accounts}
                />
                <InsightCard
                    change={
                        competition.analyzed_calls / competition.total_calls
                    }
                    data={competition.data?.slice(0, 5)}
                    total={competition.analyzed_calls}
                    title="Competition"
                    color="#333333"
                    loading={competition.loading}
                    type="competition"
                    onSnippetClick={handleSnippetClick}
                    total_acc={competition.total_accounts}
                />
                <InsightCard
                    change={sentiment.analyzed_calls / sentiment.total_calls}
                    data={sentiment.data}
                    total={sentiment.analyzed_calls}
                    title="Sentiment"
                    color="#333333"
                    loading={sentiment.loading}
                    type="sentiment"
                    onSnippetClick={handleSnippetClick}
                    total_acc={sentiment.total_accounts}
                />
            </div>
            <MonologueDrawer
                isVisible={showDrawer}
                handleClose={handleClose}
                snippets={snippets}
                getNext={getNext}
                snippetLoading={snippetsInitialLoad}
                nextSnippetsUrl={nextSnippetsUrl}
            />
        </>
    );
}
