const callsConfig = {
    SUBNAV: "calls-subnav",
    AUTOSAVE_DURATION: 500, // in ms
    COMPLETED: "Completed",
    UPCOMING: "Upcoming",
    ONGOING: "Ongoing",
    COMPLETED_TYPE: "completed",
    UPCOMING_TYPE: "upcoming",
    ONGOING_TYPE: "ongoing",
    SIDEBAR_CALLNAME_LABEL: "Name of the call",
    SIDEBAR_CALLDURATION_LABEL: "Call duration",
    NOTES_NAME: "note",
    NOTES_PLACEHOLDER: "Write a note",
    NOTES_LABEL: "Notes",
    TAGS_LABEL: "Tags",
    COMMENTS_LABEL: "Comments",
    COMMENTS_NAME: "comment",
    COMMENTS_SEND_NAME: "send",
    COMMENTS_PLACEHOLDER: "Enter your comment",
    COMMENTS_NOCOMMENTS: "No comments yet...",
    CALLCARD_CALLNAME_LABEL: "Call Name",
    CALLCARD_RECP_LABEL: "Client",
    CALLCARD_SCHED_LABEL: "Scheduled Time",
    CALLCARD_TYPE_LABEL: "Type",
    CALLCARD_MEDIUM_LABEL: "Medium",
    CALLCARD_AGENDA_LABEL: "Call Agenda",
    ADD_TAG_BUTTON: "Add Tag",
    ADD_TYPE_BUTTON: "Add Type",
    INITIATE_CALL: "Join Call",
    VIEW_CALL: "View Call",
    PROCESSING_CALL: "Processing Call",
    MAX_TAGS_CALLCARD: 4,
    MAX_TAGS_COMPLETED: 1,
    NEW_TAG_PLACEHOLDER: "Add new tags",
    EDIT_TAGS: "Delete tags",
    DONE_EDIT: "Done",
    NO_CALLS: "No calls to show...",
    LOADING_CALLS: "Loading Calls. Please wait",
    NO_TAGS: "No tags yet...",
    IS_SAVING: "saving...",
    SCROLL_TIMEOUT: 200,
    LAZY_LOADING_TEXT: "Please wait. Loading",
    MAX_SHOW_COMMENTS: 5,
    SHOW_MORE: "Show More",
    INITIAL_CALL_TYPE: "- SELECT TYPE -",
    UPLOAD_CALL: {
        modalTile: "Upload Call",
        callnameinputPlaceHolder: "Enter Call Name",
        callnameinputname: "name",
        addRecpLabel: "Add Recipient",
        chooseClientLabel: "Choose Client",
        chooseClientPlaceholder: "Enter name of client",
        addRecpName: "recp",
        chooseClientName: "client",
        addRecpPlaceholder: "Enter Recipients Email",
        callTypeLabel: "Call Type",
        callAgendaPlaceHolder: "Enter Call Agenda",
        callAgendaName: "agenda",
        addTagsLabel: "Add Tags",
        addTagsName: "tags",
        addTagsPlaceholder: "Input tag and press enter",
        dropzoneBtnLabel: "Browse Call",
        uploadFileMsg: "Drag and Drop Call",
        acceptedFormats:
            "audio/mp3, audio/wav, audio/ogg, audio/wma, audio/smf, audio/acc, audio/ac3, audio/aiff, .awb, audio/amr, audio/flac, audio/mid, audio/mka, audio/wav, audio/wma, audio/AMR-WB, audio/x-amr-wb, audio/mpeg, audio/*;capture=microphone;video/mp4,video/x-m4v,video/webm,video/ogg,video/*",
        allowedFormatsLabel:
            "( Allowed formats: mp3, wav, ogg, wma, mp4, awb, webm, acc, ac3, aiff, 3gpp, smf, AMR-WB, x-amr-wb)",
        cancelCtaLabel: "Close",
        uploadCtaLabel: "Upload Call",
        successMsg: "Call Uploaded Successfully. Please close the popup.",
        requiredError: "All fields are required",
        repTitle: "Choose Rep",
    },
    JOIN_CALL: {
        modalTile: "Record Call",
        cancelCtaLabel: "Close",
        uploadCtaLabel: "Allow Bot To Join",
        joinCallPlaceholder: "Enter Call Link",
        joinCallInputName: "joinLink",
        joinCallLabel: "Call Link",
        successMsg: "Bot Joined Successfully",
        successType: "success",
        errorType: "error",
        callNameLabel: "Call Name - Optional",
    },
    COMMENTS_OPEN_DELIMITER: ";#",
    COMMENTS_CLOSE_DELIMITER: "#;",
    SEARCH_VIEW: "Filter",
    TRACKER_VIEW: "Alerts",
};

export default callsConfig;