import NoActionItemsSvg from "app/static/svg/NoActionItemsSvg";
import NoMomentsSvg from "app/static/svg/NoMomentsSvg";
import NoQuestionsSvg from "app/static/svg/NoQuestionsSvg";
import NoTopicsSvg from "app/static/svg/NoTopicsSvg";

const IndividualCallConfig = {
    CALLOVERVIEW: "Overview",
    CUSTOMERINFO: "Customer Info",
    STATISTICS: "Stats",
    QUESTIONS: "Questions",
    ACTIONITEMS: "Action Items",
    RAWTRANSCRIPT: "Transcript",
    TOPICS_LABEL: "Topics",
    COMMENTS: "Comments",
    NOCOMMENTS: "No Comments",
    LISTENLATER: "Share",
    ASKFORFEEDBACK: "Ask For Feedback",
    ADDTOLIB: "Add To Library",
    COMMENTICON: "fa-comment",
    TABLEICON: "fa-table",
    CALLNAME: "Call Name",
    CALLDURATION: "Call Duration",
    CALLTYPE: "Call Type",
    MEDIUM: "Medium",
    RECEPIENTS: "Participants",
    AGENDA: "Call Agenda",
    TAGS: "Tags",
    NOAPPLIEDTAGS: "No Applied Tags",
    TRACKERS: "Trackers",
    APPLIED: "Matching Trackers",
    NOMATCHINGTRACKERS: "No Matching Trackers...",
    TRACKERICON: "fa-newspaper-o",
    COMPLETED_TYPE: "completed",
    UPCOMING_TYPE: "upcoming",
    REPLYTOCOMMENT: "Reply To Comment",
    REPLYICON: "fa-commenting",
    ADDCOMMENT: "Add Comment",
    ENTERCOMMENT: "Enter the Comment",
    ADDTAG: "Add a Tag",
    CANCEL: "Cancel",
    REPLY: "Reply",
    SEARCH: "Search for a Word or Keyword",
    NOCALLTYPE: "No Call Type",
    FEEDBACK: {
        label: "Feedback",
        question_label: "Question",
        your_response: "Your Response",
        response: "Response",
        scaleNumber: 10,
        scaleTrue: "Yes",
        scaleFalse: "No",
        scaleNA: "NA",
        addNoteBtn: "Add Note",
        ratings: "Ratings",
        responseScale: 1,
        responseBoolean: 2,
        AUTOSAVE_DURATION: 500,
        NOTES_NAME: "note",
        NOTES_PLACEHOLDER: "Write a note",
        IS_SAVING: "saving...",
        feedbackBy: "feedbackby",
        feedbackByTitle: "Showing Feedback By:",
        NOTES: "Notes",
        NO_NOTES: "No notes yet",
        LABEL_YES: "Yes",
        LABEL_NO: "No",
        LABEL_NA: "NA",
        SHOW_NOTES: "Show Notes",
    },
    IMPORTANT_MOMENTS: "Moments",
    POSITIVE_MOMENTS: "positive",
    NEGATIVE_MOMENTS: "negative",

    // Video Player Constants
    PLAYRATES: [0.25, 0.5, 1, 1.25, 1.5, 2],
    SKIPBACKWARD: "Skip 10 Seconds Backward",
    SKIPFORWARD: "Skip 10 Seconds Forward",
    PLAY: "Play",
    PAUSE: "Pause",
    MUTE: "Mute",
    UNMUTE: "Unmute",
    SPEEDOPTIONS: "Speed Options",
    LOOP: "Loop",
    NOLOOP: "Unloop",

    // Call Overview Section

    BUSINESSOVERVIEW: "Business Overview",
    WHATWEDO: "What We Do",
    LIBRARY: "Library",
    OBJECTIONS: "Objections",
    PRICING: "Pricing",
    COACHING: "Coaching",
    CALLER: "Caller",
    RECEIVER: "Receiver",
    TOPICS: "Topics: ",
    LEGENDS: "Legends",
    MAXTIMESTOPS: 10,
    AUTOSAVEDURATION: 500,
    QUESTIONTYPE: "question",
    COMMENTTYPE: "comment",
    KEYWORDTYPE: "keyword",
    MAXTIMEBARS: 300,
    ACTIONTYPE: "action",

    // Stats Section

    PATIENCE: "Patience",
    TALKRATIO: "Talk Ratio",
    QUESTION_RATE: "Question Count",
    INTERACTIVITY: "Interactivity",
    LONGESTMONO: "Longest Rep Monologue",
    LONGESTSTORY: "Longest Customer Story",
    FILLER_RATE: "Filler Rate",
    OVERLAP_RATE: "Interruption Count",
    TALK_SPEED: "Talk Speed",
    STATS_UNIT: " Min",

    PATIENCE_TOOLTIP:
        "Average time waited by agent before responding to a customer",
    TALKRATIO_TOOLTIP:
        "Time spoken by the agent out of the total duration of the call",
    QUESTION_RATE_TOOLTIP: "No of questions asked by agent during a call",
    INTERACTIVITY_TOOLTIP:
        "Measures the interactivity of call on a scale of 0-10",
    LONGESTMONO_TOOLTIP:
        "Duration of the longest uninterrupted time spoken by an agent",
    LONGESTSTORY_TOOLTIP:
        "Duration of the longest uninterrupted time spoken by client",
    FILLER_RATE_TOOLTIP: "Rate (per minute) of Filler words spoken by agent",
    OVERLAP_RATE_TOOLTIP:
        "No of times agent interrupted the client during a call",
    TALK_SPEED_TOOLTIP: "Rate (per minute) of words spoken by agent",

    // Call Transcript Section

    NOTRANSCRIPT: "Transcripts Not Available.",
    NOTOPICS: "No Topics Detected",

    // Question and Active Items Section
    ASKEDBYREPTYPE: "askedbyrep",
    ASKEDBYOTHERSTYPE: "askedbyothers",
    SAIDBYREPTYPE: "saidbyrep",
    SAIDBYOTHERSTYPE: "saidbyothers",
    NOACTIONITEMS: "No Action Items.",
    NOQUESTIONS: "No Questions Available.",
    ASKEDBYLABEL: "Asked By:",
    ASKEDBYOTHERS: "Asked By Other Parties",
    SAIDBYREP: "Said By Rep",
    SAIDBY: "Said By:",
    ASKEDBY: "Asked By",
    SAIDBYOTHERS: "Said By Other Parties",
    SPEAKER_REP: "owner",
    SPEAKER_CLIENT: "client",

    MODAL: {
        TITLE: "Add to library",
        BTN: "add",
    },

    MERGE_THRESHOLD: 60,
    LEFT_TABS: {
        overview: {
            value: "overview",
            title: "Overview",
        },
        transcript: {
            value: "transcript",
            title: "Transcript",
        },
        worldcloud: {
            value: "wordcloud",
            title: "Word Cloud",
        },
        summary: {
            value: "summary",
            title: "Summary",
        },
    },
    RIGHT_TABS: {
        stats: {
            value: "stats",
            title: "Stats",
        },
        notes: {
            value: "notes",
            title: "AI Feedback",
        },
        topics: {
            value: "topics",
            title: "Topics",
            notFoundIcon: NoTopicsSvg,
            notFoundText: "No Topics Found!",
        },
        questions: {
            value: "questions",
            title: "Questions",
            notFoundIcon: NoQuestionsSvg,
            notFoundText: "No Questions Found!",
        },
        actions: {
            value: "actions",
            title: "Action Items",
            notFoundIcon: NoActionItemsSvg,
            notFoundText: "No Action Items Found!",
        },
        moments: {
            value: "moments",
            title: "Moments",
            notFoundIcon: NoMomentsSvg,
            notFoundText: "No Moments Found!",
        },
        snippets: {
            value: "snippets",
            title: "Snippets",
        },
    },
    CENTRE_TABS: {
        stats: {
            value: "stats",
            title: "Stats",
        },
        notes: {
            value: "notes",
            title: "AI Feedback",
        },
        topics: {
            value: "topics",
            title: "Topics",
            notFoundIcon: NoTopicsSvg,
            notFoundText: "No Topics Found!",
        },
        moments: {
            value: "moments",
            title: "Moments",
            notFoundIcon: NoMomentsSvg,
            notFoundText: "No Moments Found!",
        },
        snippets: {
            value: "snippets",
            title: "Snippets",
        },
    },
    TABS: {
        overview: {
            value: "overview",
            title: "Overview",
        },
        stats: {
            value: "stats",
            title: "Stats",
        },
        topics: {
            value: "topics",
            title: "Topics",
        },
        questions: {
            value: "questions",
            title: "Questions",
        },
        actions: {
            value: "actions",
            title: "Action Items",
        },
        moments: {
            value: "moments",
            title: "Moments",
        },
        transcript: {
            value: "transcript",
            title: "Transcript",
        },
        feedback: {
            value: "feedback",
            title: "Feedback",
        },
    },

    LEAD_SCORE: "Lead Score",
};

export default IndividualCallConfig;
