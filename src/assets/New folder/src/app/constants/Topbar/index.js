// Constants pertaining to Topbar.

const formatDate = (date, is_start) => {
    const date_in_string = date.toString().split(" ");
    date_in_string[4] = is_start ? "00:00:00" : "23:59:59";
    return date_in_string.join(" ");
};

const getCurrentQuater = () => {
    let now = new Date();
    let quarter = Math.floor(now.getMonth() / 3);
    let firstDate = new Date(now.getFullYear(), quarter * 3, 1);

    let endDate = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth() + 3,
        0
    );

    return [formatDate(firstDate, true), formatDate(endDate)];
};

const getPreviousQuater = () => {
    let now = new Date();
    let quarter = Math.floor(now.getMonth() / 3);
    let firstDate = new Date(now.getFullYear(), quarter * 3 - 3, 1);

    let endDate = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth() + 3,
        0
    );

    return [formatDate(firstDate, true), formatDate(endDate)];
};

const today = new Date();

const TopbarConfig = {
    TEAMTITLE: "Select A Team",
    REPSTITLE: "Choose Reps",
    CALLTITLE: "Choose Call Type",
    DATETITLE: "Choose The Date",
    UPLOADTEXT: "Upload Call",
    SCHEDULETEXT: "Record Call",
    UPLOADICON: "fa-cloud-upload",
    PHONEICON: "fa-phone",
    BACKICON: "fa-arrow-left",
    CALLPAGETITLE: "Meetings",
    SEARCHTITLE: "Search",
    STATSPAGETITLE: "Statistics",
    ALL: "All",
    ALLREPS: "All",
    TEAMLABEL: "Select Team",
    REPSLABEL: "Select Rep",
    CALLLABEL: "CALL DURATION",
    DATELABEL: "Select Date",
    CALLABEL: "Pick A Range",
    CLEARLABEL: "Clear The Range",
    CUSTOMLABEL: "custom",
    ALLLABEL: "All",

    TODAYLABEL: "Today",
    YESTERDAYLABEL: "Yesterday",
    WEEKLABEL: "This Week",
    LASTWEEKLABEL: "Last Week",
    LAST30DAYS: "Last 30 Days",
    MONTHLABEL: "This Month",
    LASTMONTHLABEL: "Last Month",

    //Quarter
    CURRENTQUATERLABEL: "Current Quarter",
    PREVQUATERLABEL: "Previous Quarter",

    //Roling date Range
    RD7DAYS: "Last 7 Days (Excluding Today)",
    RD14DAYS: "Last 14 Days (Excluding Today)",
    RD30DAYS: "Last 30 Days (Excluding Today)",
    RD60DAYS: "Last 60 Days (Excluding Today)",

    MAXDATES: 4,
    MINCALDETAIL: "year",
    MYTRACKERS: "My Alerts",
    TRACKERICON: "fa-newspaper-o",
    DRAWERTITLE: "Filter your calls",
    AGENTLABEL: "Select Agent",
    ALLDATERANGE: [null, null],
    TODAYDATERANGE: [formatDate(today, true), formatDate(today)],
    YESTERDAYDATERANGE: [
        formatDate(
            new Date(new Date(today).setDate(today.getDate() - 1)),
            true
        ),
        formatDate(new Date(new Date(today).setDate(today.getDate() - 1))),
    ],
    MONTHDATERANGE: [
        formatDate(new Date(today.getFullYear(), today.getMonth(), 1), true),
        formatDate(today),
    ],
    LASTMONTHDATERANGE: [
        formatDate(
            new Date(today.getFullYear(), today.getMonth() - 1, 1),
            true
        ),
        formatDate(new Date(today.getFullYear(), today.getMonth(), 0)),
    ],
    LAST30DAYSRANGE: [
        formatDate(
            new Date(new Date(today).setMonth(today.getMonth() - 1)),
            true
        ),
        formatDate(today),
    ],
    WEEKDATERANGE: [
        formatDate(
            new Date(new Date(today).setDate(today.getDate() - today.getDay())),
            true
        ),
        formatDate(today),
    ],
    LASTWEEKDATERANGE: [
        formatDate(
            new Date(
                new Date(today).setDate(today.getDate() - today.getDay() - 7)
            ),
            true
        ),
        formatDate(
            new Date(
                new Date(today).setDate(today.getDate() - today.getDay() - 1)
            )
        ),
    ],

    CURRENTQUATER: getCurrentQuater(),
    PREVQUATER: getPreviousQuater(),

    RD7RANGE: [
        formatDate(
            new Date(new Date(today).setDate(today.getDate() - 8)),
            true
        ),
        formatDate(new Date(new Date(today).setDate(today.getDate() - 1))),
    ],
    RD14RANGE: [
        formatDate(
            new Date(new Date(today).setDate(today.getDate() - 15)),
            true
        ),
        formatDate(new Date(new Date(today).setDate(today.getDate() - 1))),
    ],
    RD30RANGE: [
        formatDate(
            new Date(new Date(today).setDate(today.getDate() - 31)),
            true
        ),
        formatDate(new Date(new Date(today).setDate(today.getDate() - 1))),
    ],
    RD60RANGE: [
        formatDate(
            new Date(new Date(today).setDate(today.getDate() - 61)),
            true
        ),
        formatDate(new Date(new Date(today).setDate(today.getDate() - 1))),
    ],
    dateKeys: {
        all: "all",
        today: "today",
        week: "week",
        last30days: "last30days",
        month: "month",
        custom: "custom",
        last_week: "last_week",
        last_month: "last_month",
        yesterday: "yesterday",
        current_quater: "current_quater",
        prevs_quater: "prevs_quater",
        rd7: "rd7",
        rd14: "rd14",
        rd30: "rd30",
        rd60: "rd60",
    },
    defaultDuration: 2,
    defaultDate: "last30days",
};

export default TopbarConfig;
