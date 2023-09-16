import routes from "@constants/Routes/index";
import settingsConfig from "@constants/Settings/index";
import commonConfig from "@constants/common/index";

const settingOptions = settingsConfig.TABS.filter((tab) => tab.isInTour).map(
    (tab) => ({
        ...tab,
        route: routes.SETTINGS,
        localStorage_key: settingsConfig.SUBNAV,
    })
);

const overviewOption = {
    tabName: "Product Overview and Meetings",
    tour_key: commonConfig.TOURS_KEYS.overview,
    route: routes.CALLS,
};

// const searchOption = {
//     tabName: 'Search Module',
//     tour_key: commonConfig.TOURS_KEYS.search,
//     route: routes.SEARCH,
// };

const statsOption = {
    tabName: "Stats Module",
    tour_key: commonConfig.TOURS_KEYS.statistics,
    route: routes.STATISTICS,
};

const libraryOption = {
    tabName: "Library Module",
    tour_key: commonConfig.TOURS_KEYS.library,
    route: routes.LIBRARY,
};

const tourOptionsList = [
    overviewOption,
    // searchOption,
    statsOption,
    libraryOption,
    ...settingOptions,
];

export default tourOptionsList;
