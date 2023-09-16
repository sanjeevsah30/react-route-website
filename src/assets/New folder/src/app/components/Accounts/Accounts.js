import React, {
    createContext,
    useEffect,
    useLayoutEffect,
    useReducer,
    useState,
    Suspense,
} from "react";
import { useSelector } from "react-redux";
import "./accounts.scss";
import { LIST_VIEW_PAGE, DETAILED_VIEW_PAGE } from "@constants/Account";
import { useLocation } from "react-router";
import Spinner from "@presentational/reusables/Spinner";
import FallbackUI from "@presentational/reusables/FallbackUI";
const ListingPage = React.lazy(() => import("./Pages/ListingPage"));
const DetailsPage = React.lazy(() => import("./Pages/DetailsPage"));

export const AccountsContext = createContext();

const initState = {
    activeTab: LIST_VIEW_PAGE,
    commentsCollapse: true,
    aiScoreCollpase: true,
    leadScoreCollpase: true,
    activeCall: null,
    activeCallTranscripts: null,
    currentAccountId: null,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case LIST_VIEW_PAGE:
            return { ...state, activeTab: LIST_VIEW_PAGE };
        case DETAILED_VIEW_PAGE:
            return {
                ...state,
                activeTab: DETAILED_VIEW_PAGE,
                currentAccountId: action.value,
            };
        case "SET_COMMENTS_SIDER_COLLAPSE":
            return { ...state, commentsCollapse: !state.commentsCollapse };
        case "SET_AI_SIDER_COLLAPSE":
            return {
                ...state,
                aiScoreCollpase: !state.aiScoreCollpase,
            };
        case "SET_LEAD_SCORE_SIDER_COLLAPSE":
            return {
                ...state,
                leadScoreCollpase: !state.leadScoreCollpase,
            };
        case "SET_ACTIVE_CALL":
            return {
                ...state,
                activeCall: action.data,
            };
        case "SET_ACTIVE_TRANSCRIPTS":
            return {
                ...state,
                activeCallTranscripts: action.data,
            };
        default:
            throw new Error("Unidentified action type");
    }
};

/*  Send each prop as Array 
    For removing diplicates
    client if individual object you will send it like [client]
    Make sure to do a null check before pushing it in an array
*/
export function useParticipantsHook({ client = [], owner = [], reps = [] }) {
    const [data, setData] = useState([...client, ...owner, ...reps]);
    const [dataNoDuplicates, setDataNoDuplicates] = useState(data);

    useEffect(() => {
        const ids = {};
        const newData = [];

        data.forEach((per) => {
            if (!ids[per.id]) {
                ids[per.id] = per.id;
                newData.push(per);
            }
        });

        setDataNoDuplicates(newData);
    }, [data]);

    return [dataNoDuplicates, setData];
}

function Accounts(props) {
    const [state, setState] = useReducer(reducer, initState);
    const location = useLocation();

    const {
        common: {
            domain,
            users,
            showLoader: transcriptsLoader,
            filterDates,
            filterTeams,
            filterReps,
            filterCallDuration,
        },
        auth: { id: loggedUserId },
        individualcall,
        accounts: {
            accountDetails,
            accountCalls,
            graph,
            comments,
            activeComment,
            searchFilters,
            loaders,
            aiData,
            searchText,
            sortKey,
            filters,
            activeFilters,
            leadScoreData,
        },

        accountListSlice,
    } = useSelector((state) => state);

    const setListPage = () => setState({ type: LIST_VIEW_PAGE });
    const setActiveCall = (data) => setState({ type: "SET_ACTIVE_CALL", data });
    const setActiveTranscripts = (data) =>
        setState({ type: "SET_ACTIVE_TRANSCRIPTS", data });

    const viewAccount = (id) => {
        const win = window.open(`accounts/?acc_id=${id}`);
        win.focus();
    };

    useLayoutEffect(() => {
        const acc_id = new URLSearchParams(location.search).get("acc_id");
        if (acc_id) {
            setState({ type: DETAILED_VIEW_PAGE, value: acc_id });
        }
    }, []);

    const checkIsPhoneNumber = (ch) =>
        ch === "+" || !isNaN(parseInt(ch)) ? true : false;

    return (
        <AccountsContext.Provider
            value={{
                filterDates,
                filterTeams,
                filterReps,
                accountListSlice,
                state,
                setState,
                viewAccount,
                setListPage,
                setActiveCall,
                setActiveTranscripts,
                domain,
                accountDetails,
                individualcall,
                accountCalls,
                graph,
                comments,
                loggedUserId,
                users,
                activeComment,
                searchFilters,
                loaders,
                transcriptsLoader,
                aiData,
                filterCallDuration,
                searchText,
                sortKey,
                checkIsPhoneNumber,
                filters,
                activeFilters,
                leadScoreData,
            }}
        >
            <div
                className="accounts accounts_scrollbar__style"
                data-testid="component-accounts"
            >
                {state.activeTab === LIST_VIEW_PAGE ? (
                    <Spinner loading={accountListSlice?.loading}>
                        <Suspense fallback={<FallbackUI />}>
                            <ListingPage />
                        </Suspense>
                    </Spinner>
                ) : state.activeTab === DETAILED_VIEW_PAGE ? (
                    <Suspense fallback={<FallbackUI />}>
                        <DetailsPage />
                    </Suspense>
                ) : (
                    <></>
                )}
            </div>
        </AccountsContext.Provider>
    );
}

export default Accounts;
