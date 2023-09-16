import React, { useCallback, useContext, useEffect, useState } from "react";
import { Input, Collapse, Skeleton, Button } from "antd";
import ParticipantsCard from "./ParticipantsCard";
import { useDispatch } from "react-redux";
import { checkArray } from "@tools/helpers";
import Dot from "@presentational/reusables/Dot";
import { AccountsContext, useParticipantsHook } from "../../../Accounts";
import { setAccountSearchFilter } from "@store/accounts/actions";
import { PARTICIPANTS, TOPICS_DISCUSSED } from "@constants/Account";
import NoTopicsSvg from "app/static/svg/NoTopicsSvg";
import NoParticipantsSvg from "app/static/svg/NoParticipantsSvg";
import SearchSvg from "app/static/svg/SearchSvg";
import ResetSvg from "app/static/svg/ResetSvg";

const { Panel } = Collapse;
function LeftSection({ availableHeight }) {
    const {
        accountDetails: { topics = [], owner, reps, client },
        searchFilters,
        loaders,
    } = useContext(AccountsContext);

    const [participants, setParticipants] = useParticipantsHook({
        owner: [],
        client: [],
        reps: [],
    });

    const [toSearch, setToSearch] = useState("");
    const [participantsOpen, setParticipantsOpen] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        let participants = [];
        if (reps && client) {
            participants = [...participants, ...client, ...reps];
        }
        if (owner) {
            participants = [...participants, owner];
        }

        setParticipants(participants);
    }, [owner, reps, client]);

    const isPresent = (arr, id_to_find) => {
        return arr?.find(({ id }) => id === id_to_find);
    };

    const isActive = useCallback((id, type) => {
        const { clients, reps, topics } = searchFilters;
        if (type === "client") {
            return clients.find((client) => client.id === id);
        }
        if (type === "topic") {
            return topics.find((topic) => topic.id === id);
        }
        return reps.find((reps) => reps.id === id);
    });

    const setFilter = useCallback(
        ({ id, type, name }) => {
            switch (type) {
                case "topic":
                    if (isPresent(searchFilters.topics, id)) {
                        const topics = searchFilters.topics.filter(
                            (topic) => topic.id !== id
                        );
                        dispatch(
                            setAccountSearchFilter({
                                topics,
                            })
                        );
                    } else {
                        dispatch(
                            setAccountSearchFilter({
                                topics: [
                                    ...searchFilters.topics,
                                    { id, name, type: "topic" },
                                ],
                            })
                        );
                    }

                    break;
                case "client":
                    if (isPresent(searchFilters.clients, id)) {
                        const clients = searchFilters.clients.filter(
                            (client) => client.id !== id
                        );
                        dispatch(
                            setAccountSearchFilter({
                                clients,
                            })
                        );
                    } else {
                        dispatch(
                            setAccountSearchFilter({
                                clients: [
                                    ...searchFilters.clients,
                                    { id, name, type: "client" },
                                ],
                            })
                        );
                    }

                    break;
                case "owner":
                case "reps":
                    if (isPresent(searchFilters.reps, id)) {
                        const reps = searchFilters.reps.filter(
                            (rep) => rep.id !== id
                        );
                        dispatch(
                            setAccountSearchFilter({
                                reps,
                            })
                        );
                    } else {
                        dispatch(
                            setAccountSearchFilter({
                                reps: [
                                    ...searchFilters.reps,
                                    { id, name, type: "reps" },
                                ],
                            })
                        );
                    }

                    break;
                default:
            }
        },
        [searchFilters]
    );

    return (
        <>
            <div className="left__section left__section__topics ">
                <Collapse
                    expandIconPosition="right"
                    bordered={false}
                    defaultActiveKey={[TOPICS_DISCUSSED]}
                    onChange={(e) => {}}
                    className={"topics__accordian  white_bg"}
                >
                    <Panel
                        header={TOPICS_DISCUSSED}
                        key={TOPICS_DISCUSSED}
                        className=""
                        extra={
                            searchFilters.topics.length ? (
                                <Button
                                    className="borderRadius5"
                                    icon={<ResetSvg />}
                                    size={22}
                                    onClick={(e) => {
                                        dispatch(
                                            setAccountSearchFilter({
                                                topics: [],
                                            })
                                        );
                                        e.stopPropagation();
                                    }}
                                />
                            ) : (
                                <></>
                            )
                        }
                    >
                        <div>
                            {loaders.mainLoader ? (
                                <Skeleton
                                    className="paddingR16"
                                    active
                                    title={false}
                                    paragraph={{
                                        rows: 5,
                                    }}
                                />
                            ) : checkArray(topics).length ? (
                                topics
                                    ?.sort((a, b) => a?.count - b?.count)
                                    .map(({ id, ...rest }) => (
                                        <TopicCard
                                            {...rest}
                                            key={id}
                                            isActive={isActive}
                                            setFilter={setFilter}
                                            id={id}
                                        />
                                    ))
                            ) : (
                                <div className="flex column alignCenter justifyCenter height100p">
                                    <NoTopicsSvg />
                                    <div className="bolder black_cl marginT10">
                                        No Topics Found!
                                    </div>
                                </div>
                            )}
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <div className="left__section left__section__participants">
                <Collapse
                    expandIconPosition="right"
                    bordered={false}
                    defaultActiveKey={[PARTICIPANTS]}
                    onChange={(e) => {
                        if (e.length) {
                            setParticipantsOpen(true);
                        } else setParticipantsOpen(false);
                    }}
                    className={`${
                        participantsOpen ? "participants__accordian" : ""
                    }`}
                >
                    <Panel
                        header={PARTICIPANTS}
                        key={PARTICIPANTS}
                        className={` accordian white_bg`}
                        extra={
                            searchFilters.reps.length ||
                            searchFilters.clients.length ? (
                                <Button
                                    className="borderRadius5"
                                    icon={<ResetSvg />}
                                    size={22}
                                    onClick={(e) => {
                                        dispatch(
                                            setAccountSearchFilter({
                                                reps: [],
                                                clients: [],
                                            })
                                        );
                                        toSearch && setToSearch("");
                                        e.stopPropagation();
                                    }}
                                />
                            ) : (
                                <></>
                            )
                        }
                    >
                        <div className="paddingR4 input_container">
                            <Input
                                size="large"
                                placeholder="Find a Contact"
                                prefix={
                                    <SearchSvg
                                        style={{
                                            marginRight: "12px",
                                        }}
                                    />
                                }
                                className="borderRadius5 marginB10 flexShrink"
                                onChange={(e) => setToSearch(e.target.value)}
                                value={toSearch}
                                autoFocus={true}
                            />
                        </div>

                        <div className="participants_container overflowYauto flex1 overflowXHidden">
                            {loaders.mainLoader ? (
                                <Skeleton
                                    className="paddingR16"
                                    active
                                    title={false}
                                    paragraph={{
                                        rows: 5,
                                    }}
                                />
                            ) : toSearch ? (
                                participants
                                    ?.filter(
                                        ({ first_name, last_name, email }) =>
                                            first_name
                                                ?.toLowerCase()
                                                .includes(
                                                    toSearch.toLowerCase()
                                                ) ||
                                            last_name
                                                ?.toLowerCase()
                                                .includes(
                                                    toSearch.toLowerCase()
                                                ) ||
                                            email
                                                ?.toLowerCase()
                                                .includes(
                                                    toSearch.toLowerCase()
                                                )
                                    )
                                    .map((data) => (
                                        <ParticipantsCard
                                            key={data.id}
                                            {...data}
                                            setFilter={setFilter}
                                            isActive={isActive}
                                        />
                                    ))
                            ) : participants.length ? (
                                participants.map((data) => (
                                    <ParticipantsCard
                                        key={data.id}
                                        {...data}
                                        setFilter={setFilter}
                                        isActive={isActive}
                                    />
                                ))
                            ) : (
                                <div className="flex column alignCenter justifyCenter height100p">
                                    <NoParticipantsSvg />
                                    <div className="bolder black_cl marginT10">
                                        No Participants Found!
                                    </div>
                                </div>
                            )}
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </>
    );
}

const TopicCard = React.memo(({ name, count, isActive, setFilter, id }) => {
    const type = "topic";

    return (
        <div
            className={`flex alignCenter justifySpaceBetween paddingR24 component--hover--active curPoint ${
                isActive(id, type) ? "call__active" : ""
            }`}
            onClick={() => {
                setFilter({ id, type, name });
            }}
        >
            <div className="flex alignCenter">
                <Dot
                    height="8px"
                    width="8px"
                    className="primary_bg marginL10 marginR14 marginTB10"
                />
                <span className="capitalize">{name}</span>
            </div>
            <div className="bold600 mine_shaft_cl">{count || 0}</div>
        </div>
    );
});

export default LeftSection;
