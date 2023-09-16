import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { getTopics } from "@store/common/actions";
import { getDurationAggregationsById } from "@store/stats/actions";
import RepTopicData from "@presentational/Statistics/TopicMolecules/repTopicData";
import { getTopbarFilters, searchTagsFilters } from "@tools/searchFactory";
import UserMonologues from "@presentational/Statistics/UserMonologues/UserMonologues";
import { getMappedReps, TOPICS_DUMMY } from "./__mock__/mock";
import SampleDataBanner from "@presentational/reusables/SampleDataBanner";

const TopicCard = React.lazy(() =>
    import("@presentational/Statistics/TopicCard")
);
const TopicCompareModal = React.lazy(() =>
    import("@presentational/Statistics/TopicMolecules/TopicCompareModal")
);

export default function Topics(props) {
    const dispatch = useDispatch();
    const topics = useSelector((state) => state.common.topics);
    const [reps, setReps] = useState({});
    const [fetchingData, setFetchingData] = useState(false);
    const [showInfoForRep, setShowInfoForRep] = useState("");
    const [filters, setFilters] = useState({});
    const [showSampleData, setShowSampleData] = useState(false);

    const {
        common: {
            filterTeams,
            filterReps,
            filterDates,
            filterCallDuration,
            activeCallTag,
        },
    } = useSelector((state) => state);

    useEffect(() => {
        if (isEmpty(topics)) {
            dispatch(getTopics()).then((res) => {
                if (res.status || !res.length) {
                    setShowSampleData(true);
                } else {
                    setShowSampleData(false);
                }
            });
        }
    }, []);

    useEffect(() => {
        setReps(getRepsWithIdsnName(props.repsOptions));
    }, [props.repsOptions]);

    useEffect(() => {
        setFetchingData(true);
        const searchData = getSearchData();
        setFilters(searchData);
        dispatch(
            getDurationAggregationsById(false, searchData, true, null)
        ).then(() => {
            setFetchingData(false);
        });
    }, [
        filterReps.active,
        filterTeams.active,
        filterCallDuration.active,
        filterDates.active,
        activeCallTag,
    ]);

    const getRepsWithIdsnName = (reps) => {
        let updatedData = {};

        for (const rep of reps) {
            let repId = rep.id;
            let repName = rep.name;
            updatedData[repId] = {
                repId: repId,
                repName: repName,
            };
        }
        return updatedData;
    };

    const getSearchData = () => {
        if (props.repsOptions.length > 0) {
            const topbarData = {
                callDuration: props.callDuration,
                repId: props.repId || 0,
                teamId: +props.activeTeamIdx === 0 ? [0] : props.teamId,
                startDate: props.startDate,
                endDate: props.endDate,
            };

            return [
                ...getTopbarFilters(topbarData),
                ...searchTagsFilters(
                    activeCallTag.length ? activeCallTag : null
                ),
            ];
        } else {
            return {};
        }
    };

    const users = useSelector((state) => state.common.users);
    const findTeam = (repId) => {
        const user = users.find((user) => user.id === +repId);
        if (user) {
            return user.team?.id;
        }
        return 0;
    };

    const [showMonologueModal, setShowMonologueModal] = useState(false);
    const [activeTopic, setActiveTopic] = useState({
        id: 0,
        name: "",
    });
    const [activeRep, setActiveRep] = useState({
        repId: 0,
        repName: "",
    });
    const toggleMonologueModal = (evt, name, topicData, index) => {
        evt.stopPropagation();
        setActiveRep(name || "");
        setActiveTopic(topicData || { id: 0, name: "" });
    };

    useEffect(() => {
        if (activeRep.repId) {
            setShowMonologueModal((status) => !status);
        }
    }, [activeRep]);

    return (
        <>
            {showSampleData && <SampleDataBanner />}
            <div className="row topic-container ">
                {!showSampleData && (
                    <TopicCompareModal reps={props.repsOptions} />
                )}
                <RepTopicData
                    rep={props.repsOptions.find(
                        (rep) => Object.keys(rep)[0] === showInfoForRep
                    )}
                    showInfoForRep={showInfoForRep}
                    setShowInfoForRep={setShowInfoForRep}
                />
                {!showSampleData
                    ? topics.map((topic, index) => (
                          <TopicCard
                              key={topic.id}
                              topic={topic}
                              callDuration={props.callDuration}
                              startDate={props.startDate}
                              endDate={props.endDate}
                              activeTeamIdx={props.activeTeamIdx}
                              reps={reps}
                              fetchingData={fetchingData}
                              setShowInfoForRep={setShowInfoForRep}
                              filters={filters}
                              index={index}
                              toggleMonologueModal={toggleMonologueModal}
                          />
                      ))
                    : TOPICS_DUMMY.map((topic, index) => (
                          <TopicCard
                              key={topic.id}
                              topic={topic}
                              callDuration={props.callDuration}
                              startDate={props.startDate}
                              endDate={props.endDate}
                              activeTeamIdx={props.activeTeamIdx}
                              reps={getRepsWithIdsnName(getMappedReps())}
                              fetchingData={fetchingData}
                              setShowInfoForRep={setShowInfoForRep}
                              filters={filters}
                              index={index}
                              toggleMonologueModal={toggleMonologueModal}
                              isSample
                          />
                      ))}
                <UserMonologues
                    isVisible={showMonologueModal}
                    toggleModal={toggleMonologueModal}
                    title={`${activeTopic.name} by ${activeRep.repName}`}
                    topicId={activeTopic.id}
                    filters={filters}
                    repId={activeRep.repId}
                    index={props.index}
                    setShowMonologueModal={setShowMonologueModal}
                    meetings={activeRep.meetings}
                    nextUrl={activeRep.nextUrl}
                />
            </div>
        </>
    );
}
