import React from "react";

export const myCallsTour = [
    {
        title: "Welcome to Convin.",
        content: (
            <div style={{ textAlign: "left" }}>
                <p>
                    Convin records, transcribe and analyse your conversations to
                    help you get meaningful insights that you can use.
                </p>
                <br />
                <p>
                    Convin can record your conversations on zoom & google meet.
                    It can also integrate with your cloud telephony system.
                </p>
                <br />
                <p>Let’s start the tour. </p>
            </div>
        ),
        placement: "center",
        target: "body",
        disableBeacon: true,
        styles: {
            options: {
                width: 900,
            },
        },
    },
    {
        content:
            "List and search the conversations that you’ve done & upcoming in your calendar will be available here. ",
        placement: "right",
        target: ".calls-view",
        title: "Meetings",
    },
    {
        content:
            "Search for anything in your conversations just like finding keywords & specific calls with multiple filter combination.",
        placement: "right",
        target: ".search-view",
        title: "Search",
    },
    {
        content:
            "Check conversation stats to understand what’s working and what’s not",
        placement: "right",
        target: ".statistics-view",
        title: "Statistics",
    },
    {
        content:
            "Curated snippets for best conversations to help new joiners on your team learn faster.",
        placement: "right",
        target: ".library-view",
        title: "Library",
    },
    {
        content:
            "Customer Intelligence dashboards curated to show your competitions and customers experience",
        placement: "right",
        target: ".ci-view",
        title: "Customer Intelligence",
    },
    {
        content: "Fliter the calls based on criterias you have created",
        placement: "right",
        target: ".call-filters-view",
        title: "Call Filters",
    },
    {
        content: "Manage your profile, integrations and much more.",
        placement: "right",
        target: ".settings-view",
        title: "Settings",
    },
    {
        content:
            "You can also upload a conversation recording to analyse it. Sit back and see the magic.",
        placement: "bottom",
        target: ".upload-call",
        title: "Upload Call",
    },
    {
        content:
            "Record a call or meeting that was not planned in the calendar. Just add the meeting link here.",
        placement: "bottom",
        target: ".record-call",
        title: "Record Impromptu Call",
    },
    {
        content:
            "All the completed & upcoming conversations scheduled in your calendar will be available here.",
        placement: "bottom",
        target: ".callssubnav-container",
        title: "Conversations List",
    },
    {
        content: "Find the details of your conversation in a nutshell",
        placement: "left",
        target: ".callsCard.card.active",
        title: "Conversation Details",
    },
    {
        content: "View Reports",
        placement: "right",
        target: ".report-view",
        title: "Reports",
    },
    // {
    //     content:
    //         'Review an hour long conversation in 5 mins with all the details pointed out automatically.',
    //     placement: 'left-start',
    //     target: '.review-btn',
    //     title: 'Review',
    // },
    {
        title: "Find Keywords",
        content:
            "Find any keyword from all your calls like a competitor name, feature name etc to see in how many calls they were talked about",
        placement: "auto",
        target: "#searchKeywords",
        // disableBeacon: true,
    },
    {
        title: "Use Filters",
        content:
            "Use these filters to narrow down the scope of your search to find specific calls. You can also create alerts using the “Create Alert” option to get notified whenever a new call matches your search criteria.",
        placement: "right",
        target: ".search-call-filters",
    },
    {
        title: "Alerts",
        content: "See list of all your alerts here.",
        placement: "auto",
        target: "ul.meetings_sidenav",
    },
    {
        content: "Start a quick tour from here anytime.",
        placement: "right",
        target: ".help-user",
    },
];
