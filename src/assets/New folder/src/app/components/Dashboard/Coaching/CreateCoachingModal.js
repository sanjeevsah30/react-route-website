import { getDateTime, getDisplayName } from "@tools/helpers";
import { Button, Checkbox, DatePicker, Input, Modal } from "antd";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarSvg from "app/static/svg/CalendarSvg";
import CloseSvg from "app/static/svg/CloseSvg";
import CustomMultipleSelect from "../../Resuable/Select/CustomMultipleSelect";
import CustomTreeMultipleSelect from "../../Resuable/Select/CustomTreeMultipleSelect";
import moment from "moment";
import "./coaching.style.scss";

import { VideoSvg, Mp3Svg, DocSvg, SnippetSvg } from "./MediaTypes";
import {
    createCoaching,
    setCoachingCreated,
} from "@store/coaching/createCoachingSlice";
import SearchSvg from "app/static/svg/SearchSvg";
import Spinner from "@presentational/reusables/Spinner";
import { openNotification } from "@store/common/actions";
import { CustomSelect } from "../../Resuable/index";
import { getCoachingSessionList } from "@store/coaching/coaching.store";

const Context = createContext();

const TABS = {
    resources: "resources",
    assessments: "assessments",
};
export default function CreateCoachingModal({
    open,
    handleClose,
    filtersPayload,
}) {
    const {
        common: { teams, users },
        createCoachingSlice: {
            libraryModules,
            is_creating,
            loading,
            successCreated,
        },
    } = useSelector((state) => state);
    const [team_ids, setTeam_ids] = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [date, setDate] = useState(null);
    const [activeAssessment, setActiveAssessment] = useState(null);

    const dispatch = useDispatch();

    const {
        common: { filterTeams, filterReps },
        coaching_dashboard: { assesments },
    } = useSelector((state) => state);

    const onChange = (date, dateString) => {};

    const [libraryIds, setLirarayIds] = useState([]);
    const [sessionName, setSessionName] = useState("");

    useEffect(() => {
        if (filterTeams.active?.length) {
            setTeam_ids(filterTeams?.active);
        }
        if (filterReps.active[0]) {
            setUserIds([filterReps.active[0]]);
        }
    }, []);

    useEffect(() => {
        if (successCreated) {
            handleClose();
            setTeam_ids([]);
            setUserIds([]);
            setLirarayIds([]);
            setDate(null);
            setSessionName("");
            dispatch(setCoachingCreated(false));
            setActiveAssessment(null);
        }
    }, [successCreated]);

    const handleAddModule = useCallback(
        (id) => {
            if (libraryIds?.includes(id)) {
                setLirarayIds((prev) => prev?.filter((e) => e !== id));
            } else {
                setLirarayIds([...libraryIds, id]);
            }
        },
        [libraryIds]
    );

    const [searchTerm, setSearchTem] = useState("");
    const [activeTab, setActiveTab] = useState(TABS.resources);

    return (
        <Modal
            title="Create Coaching"
            visible={open}
            onCancel={handleClose}
            closeIcon={<CloseSvg />}
            width={1327}
            destroyOnClose={true}
            className="create_coaching_modal mine_shaft_cl"
        >
            <Spinner loading={loading || is_creating}>
                <div className="flex  height100p">
                    <Context.Provider
                        value={{
                            handleAddModule,
                            libraryIds,
                            searchTerm,
                        }}
                    >
                        <div className="filesContainer">
                            <div className="flex justifySpaceBetween alignCenter marginB20">
                                <div>
                                    <ul className="tabs">
                                        <li
                                            className={
                                                activeTab === TABS.resources
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() => {
                                                setActiveTab(TABS.resources);
                                            }}
                                        >
                                            Resources
                                        </li>
                                        <li
                                            className={
                                                activeTab === TABS.assessments
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() => {
                                                setActiveTab(TABS.assessments);
                                            }}
                                        >
                                            Assessment
                                        </li>
                                    </ul>
                                </div>
                                <Input
                                    className="common_input"
                                    placeholder="Search Folder or Files"
                                    style={{
                                        flex: 0.6,
                                        gap: 8,
                                        height: "44px",
                                        padding: "0 0 0 10px",
                                        fontSize: "16px",
                                    }}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTem(e.target.value)
                                    }
                                    prefix={<SearchSvg />}
                                />
                            </div>

                            <div className="flex justifySpaceBetween">
                                {activeTab === TABS.resources ? (
                                    <div>
                                        <div className="bold600 font18">
                                            Choose a file or multiple files
                                        </div>
                                        <div className="dove_gray_cl">
                                            {libraryIds?.length} selected
                                        </div>
                                        {libraryModules
                                            ?.filter((e) => {
                                                if (searchTerm) {
                                                    return (
                                                        e?.name
                                                            ?.toLowerCase()
                                                            ?.includes(
                                                                searchTerm?.toLowerCase()
                                                            ) ||
                                                        e.library_meetings
                                                            .map((e) =>
                                                                e.file_name?.toLowerCase()
                                                            )
                                                            ?.filter((e) =>
                                                                e?.includes(
                                                                    searchTerm?.toLowerCase()
                                                                )
                                                            )?.length
                                                    );
                                                }
                                                return true;
                                            })
                                            ?.map((e) => {
                                                return e?.library_meetings
                                                    ?.length ? (
                                                    <Category
                                                        {...e}
                                                        key={e.id}
                                                    />
                                                ) : null;
                                            })}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="bold600 font18 marginB20">
                                            Choose an Assessment to assign
                                        </div>

                                        {assesments
                                            ?.filter((e) =>
                                                searchTerm
                                                    ? e?.title
                                                          ?.toLowerCase()
                                                          ?.includes(
                                                              searchTerm?.toLowerCase()
                                                          )
                                                    : true
                                            )
                                            ?.map(({ title, id, created }) => {
                                                return (
                                                    <div
                                                        className="marginB14"
                                                        key={id}
                                                    >
                                                        <div className="flex alignCenter">
                                                            <span className="marginR16 flex alignCenter">
                                                                <Checkbox
                                                                    checked={
                                                                        activeAssessment ===
                                                                        id
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setActiveAssessment(
                                                                            e
                                                                                .target
                                                                                .checked
                                                                                ? id
                                                                                : null
                                                                        );
                                                                    }}
                                                                    className="marginR10"
                                                                />
                                                                <span className="type_svg flex alignCenter">
                                                                    <AssessmetSvg />
                                                                </span>
                                                            </span>
                                                            <div>
                                                                <div>
                                                                    <span className="font14 bold600">
                                                                        {title}{" "}
                                                                    </span>
                                                                    <span className="dusty_gray_cl  font14">
                                                                        |{" "}
                                                                        {getDateTime(
                                                                            created,
                                                                            undefined,
                                                                            undefined,
                                                                            "dd MM, YY"
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Context.Provider>

                    <div className="flex column settingsContainer alignCenter justifySpaceBetween">
                        <div className="flex1 width100p">
                            <div className="bold600 font18 ">Assign To</div>
                            <div className="create_parameters">
                                <div className="title">Session Name</div>
                                <Input
                                    className="common_input"
                                    placeholder="Enter Session name"
                                    style={{
                                        width: "100%",
                                        height: "46px",
                                    }}
                                    value={sessionName}
                                    onChange={(e) =>
                                        setSessionName(e.target.value)
                                    }
                                />
                            </div>
                            <div className="create_parameters">
                                <div className="title">
                                    Applicable Teams/Sub-teams
                                </div>
                                <CustomTreeMultipleSelect
                                    data={teams}
                                    value={team_ids}
                                    onChange={(values) => {
                                        setUserIds([]);
                                        setTeam_ids([...values]);
                                    }}
                                    placeholder="Select Teams"
                                    select_placeholder="Select Teams"
                                    style={{
                                        width: "100%",

                                        height: "auto",
                                        padding: "0",
                                    }}
                                    className=" multiple__select"
                                    fieldNames={{
                                        label: "name",
                                        value: "id",
                                        children: "subteams",
                                    }}
                                    option_name="name"
                                    type="team"
                                    treeNodeFilterProp="name"
                                />
                            </div>
                            <div className="create_parameters">
                                <div className="title">
                                    Applicable Representatives
                                </div>
                                <CustomTreeMultipleSelect
                                    data={[
                                        ...users
                                            ?.filter(
                                                ({ team }) =>
                                                    !team_ids.length ||
                                                    !team_ids.includes(team)
                                            )
                                            .map((e) => ({
                                                ...e,
                                                name: getDisplayName(e),
                                            })),
                                    ]}
                                    value={userIds}
                                    onChange={(userIds) => setUserIds(userIds)}
                                    placeholder={"Select Users"}
                                    select_placeholder={"Select Users"}
                                    className=" multiple__select"
                                    fieldNames={{
                                        label: "name",
                                        value: "id",
                                        children: "",
                                    }}
                                    option_name="name"
                                    type="user"
                                    treeNodeFilterProp="name"
                                    style={{
                                        width: "100%",

                                        height: "auto",
                                        padding: "0",
                                    }}
                                />
                            </div>
                            <div className="create_parameters">
                                <div className="title">Due Date</div>
                                <DatePicker
                                    onChange={(date, dateString) => {
                                        setDate(date);
                                    }}
                                    format="DD/MM/YY"
                                    suffixIcon={<CalendarSvg />}
                                    value={date}
                                    disabledDate={(current) => {
                                        return (
                                            current &&
                                            current < moment().add(0, "month")
                                        );
                                    }}
                                />
                            </div>
                            {/* <div className="create_parameters">
                                <div className="title">Choose Assessment</div>
                                <CustomSelect
                                    data={assesments}
                                    option_name={'title'}
                                    select_placeholder={'Select Assessment'}
                                    placeholder={'Select Assessment'}
                                    style={{
                                        width: '100%',
                                    }}
                                    value={activeAssessment}
                                    onChange={(value) => {
                                        console.log(value);
                                        setActiveAssessment(value);
                                    }}
                                    className={'custom__select'}
                                    option_key={'id'}
                                />
                            </div> */}
                        </div>

                        {activeTab === TABS.resources ? (
                            <Button
                                loading={is_creating}
                                className="borderRadius6 marginB20"
                                type="primary"
                                onClick={() => {
                                    if (!libraryIds.length) {
                                        return openNotification(
                                            "error",
                                            "Error",
                                            "Please select altleast one media file from the Resources Tab"
                                        );
                                    }
                                    setActiveTab(TABS.assessments);
                                }}
                                disabled={!sessionName}
                                style={{
                                    width: "40%",
                                }}
                            >
                                NEXT
                            </Button>
                        ) : (
                            <Button
                                loading={is_creating}
                                className="borderRadius6 marginB20"
                                type="primary"
                                onClick={() => {
                                    if (!libraryIds.length) {
                                        return openNotification(
                                            "error",
                                            "Error",
                                            "Please select altleast one media file from the Resources Tab"
                                        );
                                    }
                                    dispatch(
                                        createCoaching({
                                            library_meeting_ids: libraryIds,
                                            team_ids: team_ids,
                                            rep_ids: userIds,
                                            session_name: sessionName,
                                            ...(date && {
                                                due_date: new Date(
                                                    date
                                                )?.toISOString(),
                                            }),
                                            ...(activeAssessment && {
                                                assessment: activeAssessment,
                                            }),
                                        })
                                    ).then((res) => {
                                        dispatch(
                                            getCoachingSessionList(
                                                filtersPayload
                                            )
                                        );
                                    });
                                }}
                                disabled={!sessionName}
                                style={{
                                    width: "40%",
                                }}
                            >
                                CREATE
                            </Button>
                        )}
                    </div>
                </div>
            </Spinner>
        </Modal>
    );
}

const Category = ({ name, id, library_meetings }) => {
    const [showAll, setShowAll] = useState(false);
    const { searchTerm } = useContext(Context);
    return (
        <div className="marginTB18">
            <div>
                <div className="flex marginB20 alignCenter">
                    <span className="marginR12">
                        <Folder />
                    </span>
                    <span className="bold600 mine_shaft_cl">{name}</span>
                    <div className="hr" />
                </div>
                {library_meetings
                    ?.filter((e) =>
                        searchTerm
                            ? e?.file_name
                                  ?.toLowerCase()
                                  ?.includes(searchTerm?.toLowerCase())
                            : true
                    )
                    ?.slice(0, showAll ? library_meetings?.length : 5)
                    .map((e) => (
                        <Media key={e.id} {...e} />
                    ))}
            </div>
            {library_meetings?.filter((e) =>
                searchTerm
                    ? e?.file_name
                          ?.toLowerCase()
                          ?.includes(searchTerm?.toLowerCase())
                    : true
            ).length > 5 && (
                <div
                    onClick={() => setShowAll((prev) => !prev)}
                    className="primary_cl font12 marginL46 curPoint"
                >
                    {showAll ? "Show Less" : "Show All"}
                </div>
            )}
        </div>
    );
};

const Media = ({ file_name, note, created, file_type, id }) => {
    const { handleAddModule, libraryIds } = useContext(Context);

    return (
        <div className="marginB14">
            <div className="flex alignCenter">
                <span className="marginR16 flex alignCenter">
                    <Checkbox
                        checked={libraryIds?.includes(id)}
                        onChange={(e) => handleAddModule(id)}
                        className="marginR10"
                    />
                    <span className="type_svg">
                        {file_type === "Snippet" ? (
                            <SnippetSvg />
                        ) : ["mp3", "wav"]?.includes(file_type) ? (
                            <Mp3Svg />
                        ) : ["mp4"]?.includes(file_type) ? (
                            <VideoSvg />
                        ) : (
                            <DocSvg />
                        )}
                    </span>
                </span>
                <div>
                    <div>
                        <span className="font14 bold600">{file_name} </span>
                        <span className="dusty_gray_cl  font14">
                            |{" "}
                            {getDateTime(
                                created,
                                undefined,
                                undefined,
                                "dd MM, YY"
                            )}
                        </span>
                    </div>
                    <div className="dove_gray_cl font14">{note}</div>
                </div>
            </div>
        </div>
    );
};

const Folder = () => (
    <svg
        width="26"
        height="21"
        viewBox="0 0 26 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1.80974 5.305L1.74974 4C1.74974 3.20435 2.06581 2.44129 2.62842 1.87868C3.19102 1.31607 3.95409 1 4.74974 1H10.2577C11.0533 1.00017 11.8163 1.31635 12.3787 1.879L13.6207 3.121C14.1832 3.68365 14.9462 3.99983 15.7417 4H21.7147C22.1316 3.99996 22.5439 4.0868 22.9254 4.25499C23.3068 4.42317 23.649 4.66902 23.9302 4.97683C24.2113 5.28465 24.4252 5.64768 24.5582 6.04276C24.6912 6.43785 24.7405 6.85633 24.7027 7.2715L23.7472 17.7715C23.6795 18.5169 23.3356 19.21 22.783 19.7148C22.2305 20.2197 21.5092 20.4997 20.7607 20.5H5.23874C4.49029 20.4997 3.76899 20.2197 3.21643 19.7148C2.66387 19.21 2.31997 18.5169 2.25224 17.7715L1.29674 7.2715C1.23282 6.57667 1.41433 5.88141 1.80974 5.3065V5.305ZM4.28474 5.5C4.07636 5.49999 3.87028 5.54339 3.67961 5.62744C3.48894 5.71149 3.31787 5.83434 3.17732 5.98816C3.03676 6.14199 2.92979 6.32341 2.86323 6.52086C2.79667 6.71832 2.77198 6.92747 2.79074 7.135L3.74624 17.635C3.77991 18.0077 3.95168 18.3543 4.22782 18.6069C4.50396 18.8594 4.86453 18.9996 5.23874 19H20.7607C21.1349 18.9996 21.4955 18.8594 21.7717 18.6069C22.0478 18.3543 22.2196 18.0077 22.2532 17.635L23.2087 7.135C23.2275 6.92747 23.2028 6.71832 23.1362 6.52086C23.0697 6.32341 22.9627 6.14199 22.8222 5.98816C22.6816 5.83434 22.5105 5.71149 22.3199 5.62744C22.1292 5.54339 21.9231 5.49999 21.7147 5.5H4.28474ZM11.3197 2.9395C11.1803 2.80002 11.0147 2.68941 10.8325 2.614C10.6503 2.53858 10.455 2.49984 10.2577 2.5H4.74974C4.3568 2.49993 3.97953 2.65405 3.69903 2.92922C3.41853 3.20439 3.2572 3.57864 3.24974 3.9715L3.25874 4.18C3.57974 4.063 3.92474 4 4.28474 4H12.3787L11.3182 2.9395H11.3197Z"
            fill="#1A62F2"
            stroke="#1A62F2"
            strokeWidth="0.6"
        />
    </svg>
);

const AssessmetSvg = () => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="30" height="30" rx="6" fill="#01C9EC" fillOpacity="0.1" />
        <path
            d="M10.6284 11.2433H17.2093V12.1294H10.6284V11.2433Z"
            fill="#01C9EC"
        />
        <path
            d="M10.6284 14.8172H17.2093V15.7033H10.6284V14.8172Z"
            fill="#01C9EC"
        />
        <path
            d="M9.31593 21.494C8.6266 21.494 8.06622 20.9336 8.06622 20.2442V8.98028C8.06622 8.29095 8.6266 7.73056 9.31593 7.73056H10.559C10.7293 8.1306 11.1244 8.41163 11.5856 8.41163H16.2522C16.7134 8.41163 17.1101 8.1306 17.2787 7.73056H18.5218C19.2112 7.73056 19.7715 8.29095 19.7715 8.98028V15.1776L20.6576 15.5909V8.98028C20.6576 7.79999 19.7021 6.84452 18.5218 6.84452H17.2721C17.1002 6.45275 16.7084 6.17999 16.2538 6.17999H11.5856C11.1293 6.17999 10.7392 6.45275 10.5656 6.84452H9.31593C8.13565 6.84452 7.18018 7.79999 7.18018 8.98028V20.2442C7.18018 21.4245 8.13565 22.38 9.31593 22.38H15.0157L14.3247 21.494H9.31593Z"
            fill="#01C9EC"
        />
        <path
            d="M16.8307 20.0227L14.7892 17.9035L13.8403 18.7267L17.0522 22.0494L23.3801 13.6783L16.8307 20.0227Z"
            fill="#01C9EC"
        />
    </svg>
);
