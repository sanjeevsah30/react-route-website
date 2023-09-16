import { START_DATE_SORT_KEY } from "@constants/Account/index";
import callsConfig from "@constants/MyCalls/index";
import TopbarConfig from "@constants/Topbar/index";

export const USER_TYPES = {
    observer: 0,
    product: 1,
};

const initStae = {
    common: {
        gsText: "",
        showLoader: false,
        domain: "app",
        tags: [],
        call_types: [],
        clients: [],
        nextClientsUrl: null,
        topics: [],
        fields: {},
        users: [],
        teams: [],
        salesTasks: [],
        nextSalesTaskUrl: null,
        salesTaskNextLoading: false,
        activeReportType: null,
        activeCallTag: [],
        filterTeams: {
            teams: [{ id: 0, name: "All Teams" }],
            active: [],
        },
        filterReps: {
            reps: [{ id: 0, name: "All" }],
            active: [],
            loading: false,
        },
        filterCallTypes: {
            callTypes: [{ 0: "All" }],
            active: 0,
        },
        filterAuditTemplates: {
            templates: [],
            active: null,
        },
        filterCallDuration: {
            options: {
                0: {
                    value: [0, null],
                    text: "Any",
                },
                1: {
                    value: [0, 2],
                    text: ["Below 2 min"],
                },
                2: {
                    value: [2, null],
                    text: ["Above 2 min"],
                },
                3: {
                    value: [0, 5],
                    text: ["Below 5 min"],
                },
                4: {
                    value: [5, null],
                    text: ["Above 5 min"],
                },
                5: {
                    value: [10, null],
                    text: ["Above 10 min"],
                },
                6: {
                    value: [15, null],
                    text: ["Above 15 min"],
                },
            },
            active: TopbarConfig.defaultDuration,
        },
        filterDates: {
            dates: {
                [TopbarConfig.dateKeys.all]: {
                    name: TopbarConfig.ALLLABEL,
                    dateRange: TopbarConfig.ALLDATERANGE,
                },
                [TopbarConfig.dateKeys.today]: {
                    name: TopbarConfig.TODAYLABEL,
                    dateRange: TopbarConfig.TODAYDATERANGE,
                    label: "Today from midnight until the current time",
                },
                [TopbarConfig.dateKeys.yesterday]: {
                    name: TopbarConfig.YESTERDAYLABEL,
                    dateRange: TopbarConfig.YESTERDAYDATERANGE,
                    label: "The previous 24 hour day",
                },
                [TopbarConfig.dateKeys.week]: {
                    name: TopbarConfig.WEEKLABEL,
                    dateRange: TopbarConfig.WEEKDATERANGE,
                    label: "The current calendar week",
                },
                [TopbarConfig.dateKeys.last_week]: {
                    name: TopbarConfig.LASTWEEKLABEL,
                    dateRange: TopbarConfig.LASTWEEKDATERANGE,
                    label: "The previous calendar week",
                },
                [TopbarConfig.dateKeys.last30days]: {
                    name: TopbarConfig.LAST30DAYS,
                    dateRange: TopbarConfig.LAST30DAYSRANGE,
                    label: "The Previous 30 Days Including Today",
                },
                [TopbarConfig.dateKeys.month]: {
                    name: TopbarConfig.MONTHLABEL,
                    dateRange: TopbarConfig.MONTHDATERANGE,
                    label: "The current calendar month",
                },
                [TopbarConfig.dateKeys.last_month]: {
                    name: TopbarConfig.LASTMONTHLABEL,
                    dateRange: TopbarConfig.LASTMONTHDATERANGE,
                    label: "The previous month",
                },
                [TopbarConfig.dateKeys.current_quater]: {
                    name: TopbarConfig.CURRENTQUATERLABEL,
                    dateRange: TopbarConfig.CURRENTQUATER,
                    label: "The current quarter",
                },
                [TopbarConfig.dateKeys.prevs_quater]: {
                    name: TopbarConfig.PREVQUATERLABEL,
                    dateRange: TopbarConfig.PREVQUATER,
                    label: "The previous full quarter",
                },
                [TopbarConfig.dateKeys.custom]: {
                    name: TopbarConfig.CUSTOMLABEL,
                    dateRange: [],
                },
                [TopbarConfig.dateKeys.rd7]: {
                    name: TopbarConfig.RD7DAYS,
                    dateRange: TopbarConfig.RD7RANGE,
                    is_roling_date: true,
                    label: "The Previous 07 Days Excluding Today",
                },
                [TopbarConfig.dateKeys.rd14]: {
                    name: TopbarConfig.RD14DAYS,
                    dateRange: TopbarConfig.RD14RANGE,
                    is_roling_date: true,
                    label: "The Previous 14 Days Excluding Today",
                },
                [TopbarConfig.dateKeys.rd30]: {
                    name: TopbarConfig.RD30DAYS,
                    dateRange: TopbarConfig.RD30RANGE,
                    is_roling_date: true,
                    label: "The Previous 30 Days Excluding Today",
                },
                [TopbarConfig.dateKeys.rd60]: {
                    name: TopbarConfig.RD60DAYS,
                    dateRange: TopbarConfig.RD60RANGE,
                    is_roling_date: true,
                    label: "The Previous 60 Days Excluding Today",
                },
            },
            active: TopbarConfig.defaultDate,
        },
        didFiltersChange: false,
        versionData: {},
    },
    auth: {
        username: "",
        email: "",
        first_name: "",
        isAuthenticated: false,
        isChecking: true,
        formError: {
            status: false,
            message: "",
        },
        isSignUp: false,
        hasConflict: false,
    },
    feedback: {
        error: {
            status: false,
            message: "",
        },
        questions: [],
        responseTypes: [
            {
                id: "1",
                name: "Scale 1 - 10",
            },
            {
                id: "2",
                name: "True/False",
            },
        ],
        all_feedbacks: [],
        user_feedbacks: {},
        all_notes: {},
        all_categories: [],
        active_category: 0,
        loading: false,
        isNotesLoading: false,
    },
    library: {
        categories: [],
        subcategories: [],
        selectedFolder: 0,
        activeSubCategory: 0,
        error: {
            status: false,
            message: "",
        },
        create_success: false,
        meetings: [],
        sample: false,
    },
    calls: {
        loading: true,
        updatingCall: false,
        updatingSidebar: true,
        updatingTags: false,
        error: {
            status: false,
            message: "",
        },
        fields: {},
        completed: [],
        upcomingCalls: {
            next: null,
            prev: null,
            results: [],
            count: 0,
        },
        completedNextUrl: "",
        upcomingCallsFilters: {
            filterTeams: {
                teams: [{ id: 0, name: "All Teams" }],
                active: 0,
            },
            filterReps: {
                reps: [],
                active: [],
            },
        },
        sidebar: {
            callId: 0,
            note: "",
            isReadOnly: false,
            noteDate: "",
            [callsConfig.UPCOMING_TYPE]: false,
            [callsConfig.COMPLETED_TYPE]: false,
            [callsConfig.ONGOING_TYPE]: false,
            showAddTag: false,
            showMoreComments: false,
            comments: [],
            tags: [],
        },
    },
    search: {
        fetchingCalls: false,
        fields: {},
        calls: [],
        count: 0,
        next_url: "",
        trackers: {
            count: 0,
            next: null,
            prev: null,
            results: [],
        },
        searchUrls: {},
        confTools: [],
        searchFilters: {
            client: null,
            keywords: [],
            keyword_present_in_call: true,
            keyword_said_by_rep: null,
            keyword_said_by_others: null,
            call_tags: [],
            call_types: [],
            // call_types: null,
            no_of_questions_by_rep: [0, 100],
            no_of_questions_by_others: [0, 100],
            topic: null,
            topic_in_call: true,
            interactivity: {
                clientLongestMonologue: [0, 100],
                clientTalkRatio: [0, 100],
                interactivity: [-10, 10],
                ownerLongestMonologue: [0, 100],
                ownerTalkRatio: [0, 100],
            },
            recording_medium: null,
            processing_status: "processed",
            template: null,
            activeTemplate: null,
            activeQuestions: {},
            auditQuestions: [],
            audit_filter: {
                audit_type: null,
                auditors: [],
                manualAuditDateRange: [null, null],
            },
            min_aiscore: null,
            max_aiscore: null,
            min_patience: 0,
            max_patience: 100,
            min_interruption_count: null,
            max_interruption_count: null,
            sortKey: null,
            stage: null,
            min_talktime: null,
            max_talktime: null,
            lead_config: {
                is_hot: false,
                is_warm: false,
                is_cold: false,
            },
            audit_feedback_status: undefined,
        },
        defaultSearchFilters: {
            client: null,
            keywords: [],
            keyword_present_in_call: true,
            keyword_said_by_rep: null,
            keyword_said_by_others: null,
            call_tags: [],
            call_types: [],
            no_of_questions_by_rep: [0, 100],
            no_of_questions_by_others: [0, 100],
            topic: null,
            topic_in_call: true,
            interactivity: {
                clientLongestMonologue: [0, 100],
                clientTalkRatio: [0, 100],
                interactivity: [-10, 10],
                ownerLongestMonologue: [0, 100],
                ownerTalkRatio: [0, 100],
            },
            recording_medium: null,
            processing_status: "processed",
            auditQuestions: [],
            activeQuestions: {},
            template: null,
            activeTemplate: null,
            audit_filter: {
                audit_type: null,
                auditors: [],
                manualAuditDateRange: [null, null],
            },
            min_aiscore: null,
            max_aiscore: null,
            min_patience: 0,
            max_patience: 100,
            min_interruption_count: null,
            max_interruption_count: null,
            sortKey: null,
            stage: null,
            min_talktime: null,
            max_talktime: null,
            lead_config: {
                is_hot: false,
                is_warm: false,
                is_cold: false,
            },
            audit_feedback_status: undefined,
        },
        activeFilters: [],
        views: [
            {
                id: 0,
                name: "Completed Calls",
                is_default: false,
            },
        ],
        samplingRules: [],
        activeSamplingRule: null,
        samplingRulesLoading: false,
        defaultView: null,
    },
    assistant: {
        bot: {},
        recorder: {},
    },
    settings: {
        designations: [],
        invited: [],
        available_subscriptions: [],
        third_party_integrations: [],
        user_types: [
            {
                id: USER_TYPES.observer,
                name: "Observer",
            },
            {
                id: USER_TYPES.product,
                name: "Product User",
            },
        ],
        crm_sheets: [],
        default_crm_sheet: null,
    },
    stats: {
        idealRanges: [],
        topicDuration: {},
        loading: false,
    },
    individualcall: {
        0: {
            questions: {},
            importantMoments: {},
            callTopics: [],
            actionItems: {},
            transcripts: [],
            renderedTranscript: [],
            monologues: {},
            monologueTopics: [],
            speaker_stats: {},
            transcript_speaker_ids: {},
            leadScoreInsights: [],
            sentiment: { positive: 0, negative: 0, neutral: 0 },
            original_transcripts: [],
        },
        callComments: {
            loading: false,
            comments: {
                results: [],
                count: 0,
                prev: null,
                next: null,
            },
            activeComment: {
                comment: null,
                replies: null,
            },
        },
        snippets: {
            results: null,
            count: 0,
            prev: null,
            next: null,
            loading: false,
        },
        snippetToUpdate: null,
    },

    ci: {
        isLoading: false,
        snippetLoading: false,
        graphLoading: false,
        error: {
            status: false,
            message: "",
        },
        tabs: [],
        graphData: {
            percentageGraphData: [],
            occurrenceGraphData: [],
        },

        loading_tabs: true,

        loading_phrases: true,

        loading_editing_phrase: false,
    },
    callAudit: {
        //Data for settings section
        newCallObjId: null,
        templates: [],
        availableTeams: {},
        nonAvailableTeams: {},
        categories: [],
        questions: [],
        disableLoading: false,
        filter: null,
        deletedFilters: [],
        globalExpressions: {},
        //Data for call details section
        auditTemplate: null,
        allAuditTemplate: null,
        scoreDetails: [],
        saving: {
            savingNote: false,
            question_id: null,
            savingResponse: false,
            savingMedia: false,
        },
        aiAuditScore: null,
        auditDone: null,
        aiAuditLoading: true,
        questionList: {},
        showAuditIncomplete: false,
        callAuditOverallDetails: {},
        accountAuditOverallDetails: {},
        loading: false,
        searchAuditTemplate: {},
        //Data for Lead Score Creation
        leadScore: null,
        filtersSettings: {
            template: null,
            categories: [],
        },
        isAccountLevel: false,
        runCommandLoading: false,
        parametersLoading: false,
        word_cloud: [],
        audit_filter: {
            audit_type: null,
            auditors: [],
        },
        scoreDetailsLoading: false,
    },
    serviceWorker: {
        serviceWorkerInitialized: false,
        serviceWorkerUpdated: false,
        serviceWorkerRegistration: null,
    },
    auditReport: {
        auditPerformanceDetails: null,
        auditorList: null,
        teamPerformanceDetails: null,
        teamList: [],
        agentList: null,
        agentPerformanceDetails: null,
        callWiseData: null,
        filterDates: {
            dates: {
                [TopbarConfig.dateKeys.last30days]: {
                    name: TopbarConfig.LAST30DAYS,
                    dateRange: TopbarConfig.LAST30DAYSRANGE,
                },

                [TopbarConfig.dateKeys.custom]: {
                    name: TopbarConfig.CUSTOMLABEL,
                    dateRange: [],
                },
                [TopbarConfig.dateKeys.all]: {
                    name: TopbarConfig.ALLLABEL,
                    dateRange: [null, null],
                },
            },
            active: TopbarConfig.defaultDate,
        },
        filterTeams: {
            teams: [{ id: 0, name: "All Teams" }],
            active: 0,
        },
        filterAgents: {
            agents: [],
            active: null,
        },
        filterCallDuration: {
            options: {
                0: {
                    value: [0, 120],
                    text: "Any",
                },
                1: {
                    value: [0, 2],
                    text: ["below 2 min"],
                },
                2: {
                    value: [0, 5],
                    text: ["below 5 min"],
                },
                3: {
                    value: [2, 120],
                    text: ["above 2 min"],
                },
                4: {
                    value: [5, 120],
                    text: ["above 5 min"],
                },
                5: {
                    value: [10, 120],
                    text: ["above 10 min"],
                },
                6: {
                    value: [15, 120],
                    text: ["above 15 min"],
                },
            },
            active: TopbarConfig.defaultDuration,
        },
        top_insights: {
            best_performance: [],
            worst_performance: [],
        },
        category_insights: [],
        graphData: {},
        cardsLoading: true,
        topInsightsLoading: true,
        categoryInsightsLoading: true,
        tableLoading: false,
        auditorCallWiseData: {
            data: { count: 0, next: null, prev: null, results: [] },
            loading: false,
            auditor: null,
        },
    },
    accounts: {
        loaders: {
            mainLoader: false,
            graphLoader: false,
            callsLoader: false,
            commentsLoader: false,
            transcriptsLoader: false,
            aiDataLoader: false,
            leadScoreLoader: false,
        },

        /*List papge search term */
        searchText: "",
        leadScoreData: [],
        accountsList: {},
        aiData: [],
        searchFilters: {
            topics: [],
            clients: [],
            reps: [],
            keyword: "",
            activeTab: "All",
            aiDataFilter: {},
            date: "",
            leadScoreFilter: {},
            meeting_ids: [],
            audit_filter: {
                audit_type: null,
                auditors: [],
                manualAuditDateRange: [null, null],
            },
        },

        filterTeams: {
            teams: [{ id: 0, name: "All Teams" }],
            active: 0,
        },
        filterReps: {
            reps: [{ name: "All", id: 0 }],
            active: [],
        },
        accountDetails: {},
        accountCalls: {},
        graph: [],
        comments: {
            results: [],
            count: 0,
            prev: null,
            next: null,
        },
        activeComment: {
            comment: null,
            replies: null,
        },
        filterDates: {
            dates: {
                [TopbarConfig.dateKeys.last30days]: {
                    name: TopbarConfig.LAST30DAYS,
                    dateRange: TopbarConfig.LAST30DAYSRANGE,
                },
                [TopbarConfig.dateKeys.all]: {
                    name: TopbarConfig.ALLLABEL,
                    dateRange: [null, null],
                },
                [TopbarConfig.dateKeys.custom]: {
                    name: TopbarConfig.CUSTOMLABEL,
                    dateRange: [],
                },
                [TopbarConfig.dateKeys.today]: {
                    name: TopbarConfig.TODAYLABEL,
                    dateRange: TopbarConfig.TODAYDATERANGE,
                },
            },
            active: "all",
        },
        filterCallDuration: {
            options: {
                0: {
                    value: [0, null],
                    text: "Any",
                },
                1: {
                    value: [0, 2],
                    text: ["below 2 min"],
                },
                2: {
                    value: [0, 5],
                    text: ["below 5 min"],
                },
                3: {
                    value: [2, null],
                    text: ["above 2 min"],
                },
                4: {
                    value: [5, null],
                    text: ["above 5 min"],
                },
                5: {
                    value: [10, null],
                    text: ["above 10 min"],
                },
                6: {
                    value: [15, null],
                    text: ["above 15 min"],
                },
            },
            active: TopbarConfig.defaultDuration.toString(),
        },
        sortKey: START_DATE_SORT_KEY.dsc,
        filters: {
            templates: [],
            questions: [
                {
                    id: "AI Score",
                    question_text: "CALL Score",
                    question_type: "yes_no",
                },
            ],
            accountTags: null,
            leadScoreObjects: [],
            activeTemplate: 0,
            activeLeadScoreTemplate: 0,
            stage: [],
            activeStage: null,
            activeQuestions: {},
            activeLeadScoreQuestions: {},
            activeInteractions: null,
            dealSize: [null, null],
            closeDate: [null, null],
            lastContacted: [null, null],
            activeLeadScorePercent: null,
            audit_filter: {
                audit_type: null,
                auditors: [],
            },
            activeAccountTags: [],
        },
        activeFilters: [],
    },
    // coaching: {
    //     coachingLoader: false,
    //     coachingSessions: [],
    //     error: ''
    // }
};

export default initStae;
