import { isEmpty, isEqual, xorWith } from "lodash";
import callsConfig from "@constants/MyCalls/index";
import commonConfig from "@constants/common/index";
import IndividualCallConfig from "@constants/IndividualCall/index";
import { getActiveUrl } from "@apis/common/index";
import * as serviceWorker from "../serviceWorkerRegistration";
import {
    domainMappingConfig,
    redirectDomainMappingConfig,
    subDomainMappingConfig,
} from "@constants/Domain/domain.config";

export const months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
};

export const day = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    0: "Sun",
};

export function isFunction(obj) {
    return typeof obj == "function" || false;
}

export function isObject(obj) {
    let type = typeof obj;
    return type === "function" || (type === "object" && !!obj);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getClosestParent = function (elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }
    return null;
};

export const removeClassFromChildren = function (
    elemClassesString,
    classToRemove
) {
    let els = document.getElementsByClassName(elemClassesString);
    while (els[0]) {
        els[0].classList.remove(classToRemove);
    }
};

/* 
  # selector: any query selector say: .card.active etc...
  # block: start | center | end | nearest;
  # behavior: smooth | auto; 
*/
export const scrollElementInView = function (
    selector,
    block = "center",
    behavior = "instant",
    element,
    scrollTranscript
) {
    if (selector) {
        if (document.querySelector(selector)) {
            if (scrollTranscript) {
                const card = document.querySelector(selector);

                card.parentNode.scrollTop =
                    card.offsetTop -
                    document.querySelector(".main_player .shaka-video")
                        .clientHeight -
                    148 -
                    card.parentNode.clientHeight / 2 +
                    card.clientHeight;
            } else {
                document
                    .querySelector(selector)
                    .scrollIntoView({ block: block, behavior: behavior });
            }
        }
    } else {
        element.scrollIntoView({ block: block, behavior: behavior });
    }
};

export const scrollElementInNoShaka = function (
    selector,
    block = "center",
    behavior = "instant",
    element,
    scrollTranscript,
    highlight
) {
    if (selector) {
        if (document.querySelector(selector)) {
            if (scrollTranscript) {
                const card = document.querySelector(selector);

                card.parentNode.scrollTop =
                    card.offsetTop -
                    148 -
                    card.parentNode.clientHeight / 2 +
                    card.clientHeight;
                if (highlight) {
                    card.classList.add("active");

                    setTimeout(() => {
                        card.classList.remove("active");
                    }, 3000);
                }
            } else {
                document
                    .querySelector(selector)
                    .scrollIntoView({ block: block, behavior: behavior });
            }
        }
    } else {
        element.scrollIntoView({ block: block, behavior: behavior });
    }
};

export const getDateTime = (
    isodate,
    type = "datetime",
    separator = " ",
    format
) => {
    let returnTime = "";
    let returnDate = "";
    const fullDateTime = new Date(isodate);
    let year = fullDateTime.getFullYear();
    let month = fullDateTime.getMonth();
    let date = fullDateTime.getDate();
    let hour = fullDateTime.getHours();
    let minutes = fullDateTime.getMinutes();
    let dayName = day[fullDateTime.getDay()];

    if (separator === "/")
        return `${date}${separator}${month + 1}${separator}${year}`;

    if (date < 10) {
        date = "0" + date;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (hour < 12 || hour === 24) {
        returnTime = `${hour % 12 !== 0 && hour % 12 < 10 ? "0" : ""}${
            hour % 12 || 12
        }:${minutes} a.m.`;
    } else {
        returnTime = `${hour % 12 !== 0 && hour % 12 < 10 ? "0" : ""}${
            hour % 12 || 12
        }:${minutes} p.m.`;
    }

    switch (format) {
        case "dd MM, YY":
            return `${months[month]} ${date}, ${year}`;
        case "dd MM":
            return `${months[month]} ${date}`;
        case "MMM dd, yyyy":
            return `${months[month]} ${date}, ${year}`;
        case "MMM dd, yyyy - HH:MM":
            return `${months[month]} ${date}, ${year} - ${returnTime}`;
        case "dd MMM":
            return `${date} ${months[month]}`;
        default:
    }

    if (date === "01" || date === 31 || date === 21) {
        date = date + "st";
    } else if (date === "02" || date === 22) {
        date = date + "nd";
    } else if (date === "03" || date === 23) {
        date = date + "rd";
    } else {
        date = date + "th";
    }
    returnDate = `${date}${separator}${months[month]}, ${separator}${year}`;

    switch (type) {
        case "date":
            return returnDate;
        case "time":
            return returnTime;
        case "timeDate":
            return `${returnTime},  ${returnDate}`;
        case "datetime":
            return `${returnTime},  ${returnDate}`;
        case "dayDate":
        default:
            return `${dayName}, ${returnDate}`;
    }
};

/**
 * Check if any part element is in viewport by passing any query selector say: .card.active etc...
 */
export const isElementInViewport = (childselector, parentselector) => {
    let element = document.querySelector(childselector);
    let container = document.querySelector(parentselector);

    if (element && container) {
        //Get container properties
        let cTop = container.scrollTop;
        let cBottom = cTop + container.clientHeight;

        //Get element properties
        let eTop = element.offsetTop - container.offsetTop;
        let eBottom = eTop + element.clientHeight;

        //Check if in view
        let isTotal = eTop >= cTop && eBottom <= cBottom;
        let isPartial =
            (eTop < cTop && eBottom > cTop) ||
            (eBottom > cBottom && eTop < cBottom);

        //Return outcome
        return isTotal || isPartial;
    }
    throw Error("Element does not exists");
};

/**
 * The helper function uses matches() to see if the element matches your selector, and you can use any valid CSS selector with it.
 * That means you can use :not() to skip certain selectors.
 */
export const getNextSibling = function (elem, selector) {
    // Get the next sibling element
    let sibling = elem.nextElementSibling;

    // If there's no selector, return the first sibling
    if (!selector) return sibling;

    // If the sibling matches our selector, use it
    // If not, jump to the next sibling and continue the loop
    while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.nextElementSibling;
    }
};

/**
 * The helper function uses matches() to see if the element matches your selector, and you can use any valid CSS selector with it.
 * That means you can use :not() to skip certain selectors.
 */
export const getPreviousSibling = function (elem, selector) {
    // Get the next sibling element
    let sibling = elem.previousElementSibling;

    // If there's no selector, return the first sibling
    if (!selector) return sibling;

    // If the sibling matches our selector, use it
    // If not, jump to the next sibling and continue the loop
    while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.previousElementSibling;
    }
};

function pad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
}

export const getDuration = function (start, end) {
    // get total seconds between the times
    let delta =
        Math.abs(new Date(end).getTime() - new Date(start).getTime()) / 1000;

    // calculate (and subtract) whole days
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    let seconds = delta % 60;

    if (days > 0) {
        return `${pad(days)}d, ${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    if (hours) {
        return `${pad(hours)}:${pad(minutes)}:${pad(Math.ceil(seconds))}`;
    }
    return `${pad(minutes)}:${pad(Math.ceil(seconds))}`;
};

export const getDurationInSeconds = (start = new Date(), end = new Date()) => {
    return Math.abs(new Date(end).getTime() - new Date(start).getTime()) / 1000;
};

export const getDate = (inputdate) => {
    const date = new Date(inputdate);
    const year = date.getFullYear(); // 2023
    const month = date.getMonth(); // 1 (Note: January is 0)
    const day = date.getDate(); // 14
    return `${year}-${month + 1}-${day}`;
};

export const getTime = (inputdate) => {
    const date = new Date(inputdate);
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    return `${hour}:${min}:${sec}`;
};

/**
 * conver array of objects of type [{id:1,label:"dsds"}] to [{1:"dsds"}], usefull for dropdown
 */
export const getIdLabelArray = (
    objArray,
    labelType = "name",
    exclude = null
) => {
    let returnArray = [];
    objArray.map((obj, idx) => {
        if (obj.id !== exclude) {
            returnArray.push({
                id: obj.id,
                name: obj[labelType],
            });
        }
    });
    return returnArray;
};
/**
 * return index of object in array of type [{1:"dsds"}], usefull for dropdown
 */
export const getIndexOfObj = (objArray, id) => {
    let index = -1;
    objArray.map((obj, idx) => {
        if (Object.keys(obj)[0] === String(id)) {
            index = idx;
        }
    });
    return index;
};

export const secondsToTime = (seconds = 0) => {
    let hours = 0,
        minutes = 0,
        secs = 0,
        timeToCalc = seconds;

    if (timeToCalc >= 3600) {
        hours = parseInt(timeToCalc / 3600);
        timeToCalc = parseInt(timeToCalc % 3600);
    }

    if (timeToCalc >= 60) {
        minutes = parseInt(timeToCalc / 60);
        timeToCalc = parseInt(timeToCalc % 60);
    }

    secs = parseInt(timeToCalc);

    let display = "";
    display += hours ? (hours >= 10 ? hours : "0" + hours) + ":" : "";

    display +=
        (minutes >= 10 ? minutes : "0" + minutes) +
        ":" +
        (secs >= 10 ? secs : "0" + secs);

    return display;
};

export const secToTimeNew = (seconds = 0) => {
    let hours = 0,
        minutes = 0,
        secs = 0,
        timeToCalc = seconds;

    if (timeToCalc >= 3600) {
        hours = parseInt(timeToCalc / 3600);
        timeToCalc = parseInt(timeToCalc % 3600);
    }

    if (timeToCalc >= 60) {
        minutes = parseInt(timeToCalc / 60);
        timeToCalc = parseInt(timeToCalc % 60);
    }

    secs = parseInt(timeToCalc);

    let display = "";
    display +=
        (hours >= 10 ? hours : "0" + hours) +
        ":" +
        (minutes >= 10 ? minutes : "0" + minutes) +
        ":" +
        (secs >= 10 ? secs : "0" + secs);

    return display;
};

export const timeToSeconds = (timeLabel = "00:00:00") => {
    let seconds = 0;

    timeLabel.split(/[-:]/).map((time, index) => {
        seconds +=
            Number(time) * 60 ** (timeLabel.split(/[-:]/).length - 1 - index);
    });

    return seconds;
};

export const getRandomColors = (string, isTransparent) => {
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    var hex = "";

    let color = Math.floor(
        Math.abs(((Math.sin(hash) * 100000) % 1) * 16777216)
    ).toString(16);
    hex = Array(6 - color.length + 1).join("0") + color;

    // convert to decimal and change luminosity
    var rgb = "#",
        c,
        i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * -0.2), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return isTransparent ? `${rgb}1A` : rgb;
};

export const getCleanArray = (string, seperator = ",") => {
    return string
        .replace(/,+/g, ",")
        .replace(/^\s+|\s+$/g, "")
        .split(seperator)
        .filter((key) => key.trim() !== "")
        .map((key) => key.trim());
};

export const getMatchRegex = (arr) => {
    return new RegExp(arr.map((key) => `\\b${key}\\b`).join("|"), "gi");
};

export const sideScroll = (
    element,
    direction,
    speed = 25,
    distance = 100,
    step = 20
) => {
    var scrollAmount = 0;
    var slideTimer = setInterval(function () {
        if (direction === "left") {
            element.scrollLeft -= step;
        } else {
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance) {
            window.clearInterval(slideTimer);
        }
    }, speed);
    return {
        isAtEnd:
            element.scrollLeft + distance >=
            element.scrollWidth - element.clientWidth,
        isAtStart: element.scrollLeft <= 0,
    };
};

export const searchInArray = (array, key) => {
    let foundItem = null;
    if (array) {
        array.forEach((element) => {
            if (Object.keys(element)[0] == key) {
                foundItem = element;
            }
        });
    }
    return foundItem;
};

export const getDMYDate = (date, separator = "/") => {
    return (
        new Date(date).getDate() +
        separator +
        (new Date(date).getMonth() + 1) +
        separator +
        new Date(date).getFullYear()
    );
};

export const getLocaleDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    let date = dateObj.getDate();
    // let hour = dateObj.getHours();
    // let minutes = dateObj.getMinutes();
    // let dayName = day[dateObj.getDay()];
    return `${months[month]} ${date}, ${year}`;
};

export const compareValues = (key, order = "asc") => {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return order === "desc" ? comparison * -1 : comparison;
    };
};

export const isArrayEqual = (x, y) => isEmpty(xorWith(x, y, isEqual));

export const firstLetterInWordCapital = (str = "") => {
    let words = str?.split(" ");
    let op = "";
    for (let word of words) {
        op += capitalizeFirstLetter(word.trim()) + " ";
    }
    return op.trim();
};

export const userMentionsData = (users) => {
    return users.map((user) => ({
        id: user.id,
        display: firstLetterInWordCapital(user.first_name),
    }));
};

export const getCleanComment = (comment) => {
    let mentionOpen = new RegExp(callsConfig.COMMENTS_OPEN_DELIMITER, "g");
    let mentionClose = new RegExp(
        `\\(\\d+\\)${callsConfig.COMMENTS_CLOSE_DELIMITER}`,
        "g"
    );
    let timeRegx = /@(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)/g;
    return comment
        .replace(mentionOpen, '<mark class="mention">')
        .replace(mentionClose, "</mark>")
        .replace(
            timeRegx,
            (matched) =>
                `<a class="data-link__time" data-time="${
                    matched.split("@")[1]
                }">${matched}</a>`
        )
        .replace(/\n/g, "<br />");
};

export function createMarkup(string) {
    return { __html: string };
}

export const getNearestTen = (val) => {
    return (Math.ceil(+val / 10) * 10) / 10;
};

export function getChartMarks(val) {
    const nearest_ten = getNearestTen(val);
    return [...Array(10)].map((_, i) => nearest_ten * i + nearest_ten);
}

export function differenceInDates(date1, date2) {
    // To calculate the time difference of two dates
    const diff_in_time = new Date(date1).getTime() - new Date(date2).getTime();

    // To calculate the no. of days between two dates
    return diff_in_time / (1000 * 3600 * 24);
}

export function updateTourJson(key, status) {
    let tourJson =
        JSON.parse(localStorage.getItem(commonConfig.TOUR_KEY)) || {};
    tourJson[key] = status;
    localStorage.setItem(commonConfig.TOUR_KEY, JSON.stringify(tourJson));
}

export function setCookie(name, value, days = 2) {
    // var expires = '';
    // if (days) {
    //     var date = new Date();
    //     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    //     expires = '; expires=' + date.toUTCString();
    // }
    // document.cookie =
    //     name + '=' + (value || '') + expires + '; path=/; sameSite=None;';
    localStorage.setItem(name, value);
}
export function getCookie(name) {
    // var nameEQ = name + '=';
    // var ca = document.cookie.split(';');
    // for (var i = 0; i < ca.length; i++) {
    //     var c = ca[i];
    //     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    //     if (c.indexOf(nameEQ) === 0)
    //         return c.substring(nameEQ.length, c.length);
    // }
    // return null;
    return localStorage.getItem(name);
}
export function eraseCookie(name) {
    // document.cookie =
    //     name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem(name);
}

export const trimNumber = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const uid = () => {
    return (
        performance.now().toString(36) + Math.random().toString(36)
    ).replace(/\./g, "");
};

export const appendScript = (scriptToAppend, onload) => {
    const script = document.createElement("script");
    script.src = scriptToAppend;
    script.async = true;
    script.onload = onload;
    document.body.appendChild(script);
};

export const goToTranscriptTab = ({
    event,
    meeting_id,
    start_time,
    end_time,
    headline,
    domain,
}) => {
    let node = event.target;

    const activeUrl = getActiveUrl(domain);

    if (node.tagName === "MARK") {
        const win = window.open(
            `${activeUrl}/call/${meeting_id}?tab=${IndividualCallConfig.TABS.transcript.value}&start_time=${start_time}&end_time=${end_time}&keyword=${node.textContent}`
        );
        win.focus();
    } else {
        var result = headline
            ?.match(/<mark>(.*?)<\/mark>/g)
            ?.map(function (val) {
                return val.replace(/<\/?mark>/g, "");
            });
        if (result && result.length) {
            const win = window.open(
                `${activeUrl}/call/${meeting_id}?tab=${IndividualCallConfig.TABS.transcript.value}&start_time=${start_time}&end_time=${end_time}&keyword=${result[0]}`
            );
            win.focus();
        } else {
            const win = window.open(
                `${activeUrl}/call/${meeting_id}?tab=${IndividualCallConfig.TABS.transcript.value}&start_time=${start_time}&end_time=${end_time}`
            );
            win.focus();
        }
    }
};

export const checkArray = (arr) => {
    return Array.isArray(arr) ? arr : [];
};

export function getDomain(host) {
    let domain = host.split(".")[0];
    if (domain === "www") {
        domain = host.split(".")[1];
    }
    return domain;
}
export function emptyCache() {
    if ("serviceWorker" in navigator && "caches" in window) {
        serviceWorker.unregister();
        caches
            .keys()
            .then((cacheNames) => {
                cacheNames.forEach((cacheName) => {
                    caches.delete(cacheName);
                });
            })
            .then(() => {
                serviceWorker.register();
                window.location.reload();
            });
    }
}

export const extractDomain = (value) => {
    return value?.length > 4 && value?.indexOf("@") !== -1
        ? value.substring(value.indexOf("@") + 1).split(".")[0]
        : "";
};

export const isNumber = (val) => {
    return typeof val === "number";
};
// a funtion which app
export const formatFloat = (num = 0, fixed = 0) => {
    if (isNaN(num) || !isFinite(num)) return 0;
    let regexPattern = /^-?[0-9]+$/;
    // check if the passed number is integer or float

    if (regexPattern.test(num)) {
        return num;
    } else {
        if (typeof num === "number") return Number(num.toFixed(fixed));
    }

    return num;

    // check if the passed number is integer or float
};

export function capitalizeFirstLetter(val = "") {
    if (!val) return val;
    let str = val?.toLowerCase();
    return str?.charAt(0)?.toUpperCase() + str.slice(1);
}

export const getSearchAuditFilters = (flag, type, index) => {
    if (flag) {
        switch (type) {
            case "good_calls":
                return {
                    good_calls: true,
                    average_calls: false,
                    need_attention: false,
                };
            case "average_calls":
                return {
                    good_calls: false,
                    average_calls: true,
                    need_attention: false,
                };
            case "need_attention":
                return {
                    good_calls: false,
                    average_calls: false,
                    need_attention: true,
                };
            case "yes":
                return {
                    yes: true,
                    no: false,
                    na: false,
                };
            case "no":
                return {
                    yes: false,
                    no: true,
                    na: false,
                };
            case "na":
                return {
                    yes: false,
                    no: false,
                    na: true,
                };
            default:
                return {};
        }
    } else {
        if (index) {
            return {
                yes: false,
                no: false,
                na: false,
            };
        } else {
            return {
                good_calls: false,
                average_calls: false,
                need_attention: false,
            };
        }
    }
};

export const getAcronym = (str) => {
    return str.match(/\b(\w)/g).join("");
};
export const formatDateForAccounts = ([yy, mm, dd], showYear = true) => {
    return showYear
        ? `${months[mm - 1]} ${dd}, ${yy}`
        : `${months[mm - 1]} ${dd}`;
};

export const goToCall = ({
    domain,
    id,
    tab,
    conference_tool,
    meeting_type = "call",
}) => {
    let url =
        conference_tool === "convin_qms"
            ? `${getActiveUrl(domain)}/${meeting_type}/qms/${id}`
            : `${getActiveUrl(domain)}/${meeting_type}/${id}`;
    if (tab) url = url + `?&tab=${tab}`;
    const win = window.open(url);
    win.focus();
};

export const goToAccount = ({ domain, id }) => {
    let url = `${getActiveUrl(domain)}/accounts/?acc_id=${id}`;
    const win = window.open(url);
    win.focus();
};

export const getDisplayName = ({ first_name, last_name, email, userName }) => {
    return first_name && last_name
        ? first_name + " " + last_name
        : first_name
        ? first_name
        : email
        ? email
        : userName
        ? userName
        : "_";
};

export const getColor = (name = "", palette) => {
    name = name?.toString();
    const colors = palette || [
        "#C83E4D",
        "#FF6B35",

        "#FE5F55",

        "#F564A9",

        "#6622CC",
        "#E27396",
        "#F98948",
        "#9B8816",
        "#AF1B3F",
        "#EC4E20",
        "#E34A6F",
        "#028090",
        "#F9E900",
        "#7F2982",
        "#7F2982",
        "#C792DF",
        "#FF312E",
        "#FF66B3",
        "#F7DD72",
        "#F5B700",
        "#F9E900",
        "#DC0073",

        "#89FC00",
        "#00BD9D",
        "#C287E8",
        "#FCBA04",

        "#613DC1",
        "#4E148C",
        "#63C132",
        "#54428E",
        "#F8C537",
        "#7D8CC4",
        "#EB5160",
        "#3F84E5",
        "#008BF8",
        "#26D1F6",
        "#4D5DEE",
        "#3A70FD",
        "#1A8FE3",
    ];

    function getRandomInteger() {
        let integer = 0;
        for (let i = 0; i < name?.length; i++) {
            integer += name.charCodeAt(i);
        }
        return (
            (integer * name?.charCodeAt(0) || Math.random() * 100) %
            colors.length
        );
    }

    return colors?.[getRandomInteger()] || "#FF7D51";
};

export const StringToColor = (function () {
    let instance = null;

    return {
        next: function stringToColor(str) {
            if (instance === null) {
                instance = {};
                instance.stringToColorHash = {};
                instance.nextVeryDifferntColorIdx = 0;
                instance.veryDifferentColors = [
                    "#C83E4D",
                    "#FF6B35",

                    "#FE5F55",

                    "#F564A9",

                    "#6622CC",
                    "#E27396",
                    "#F98948",
                    "#9B8816",
                    "#AF1B3F",
                    "#EC4E20",
                    "#E34A6F",
                    "#028090",
                    "#F9E900",
                    "#7F2982",
                    "#7F2982",
                    "#C792DF",
                    "#FF312E",
                    "#FF66B3",
                    "#F7DD72",
                    "#F5B700",
                    "#F9E900",
                    "#DC0073",

                    "#89FC00",
                    "#00BD9D",
                    "#C287E8",
                    "#FCBA04",

                    "#613DC1",
                    "#4E148C",
                    "#63C132",
                    "#54428E",
                    "#F8C537",
                    "#7D8CC4",
                    "#EB5160",
                ];
            }

            if (!instance.stringToColorHash[str])
                instance.stringToColorHash[str] =
                    instance.veryDifferentColors[
                        instance.nextVeryDifferntColorIdx++
                    ];

            return instance.stringToColorHash[str] || getColor(str);
        },
    };
})();

export function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toLocaleDateString("en-GB");
}

export function getTimeDifferenceInDays(
    date1,
    date2 = new Date().toISOString().slice(0, 10),
    split = "-"
) {
    // First we split the values to arrays date1[0] is the year, [1] the month and [2] the day
    date1 = date1.split(split);
    date2 = date2.split(split);

    // Now we convert the array to a Date object, which has several helpful methods
    date1 = new Date(date1[0], date1[1], date1[2]);
    date2 = new Date(date2[0], date2[1], date2[2]);

    // We use the getTime() method and get the unixtime (in milliseconds, but we want seconds, therefore we divide it through 1000)
    let date1_unixtime = parseInt(date1.getTime() / 1000);
    let date2_unixtime = parseInt(date2.getTime() / 1000);

    // This is the calculated difference in seconds
    let timeDifference = date2_unixtime - date1_unixtime;

    // in Hours
    let timeDifferenceInHours = timeDifference / 60 / 60;

    // and finaly, in days :)
    let days = timeDifferenceInHours / 24;
    return days === 0
        ? "Today"
        : days === 1
        ? `${days} day ago`
        : `${days} days ago`;
}

export const getPercentage = (count, total_count) => {
    if (total_count === 0) return 0;
    const per = formatFloat((count / total_count) * 100, 2);
    if (isNaN(per)) {
        return 0;
    }
    return per;
};

export const getTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export function toEpoch(date) {
    return date && Math.round(new Date(date).getTime() / 1000.0);
}

export function numFormatter(num) {
    num = Number(num);
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + "K";
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    return num; // if value < 1000, nothing to do
}

export function getName({ first_name, last_name, email, username, id }) {
    return first_name && last_name
        ? `${first_name} ${last_name}`
        : first_name || username || email || id || "UNDEFINED";
}

export const flattenTeams = (teams) => {
    let temp = [];

    teams.forEach((e) => {
        if (e?.subteams?.length) {
            temp = [...temp, ...e.subteams];
        } else {
            temp = [...temp, e];
        }
    });
    return temp;
};

export const msToTime = (duration) => {
    let milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? hours : hours;
    minutes = minutes < 10 ? minutes : minutes;
    seconds = seconds < 10 ? seconds : seconds;

    return `${hours > 0 ? `${hours}hr` : ""} ${
        minutes > 0 ? `${minutes}min` : ""
    }`;
};

export const secToTime = (duration) => {
    let minutes = Math.floor((duration / 60) % 60),
        hours = Math.floor((duration / (60 * 60)) % 24);

    return `${hours > 0 ? `${hours}hr` : ""} ${
        minutes > 0 ? `${minutes}min` : ""
    }`;
};

export const yearlyCoachingSessions = (res = []) => {
    let obj = {};
    res?.forEach((item) => {
        let date = new Date(item.created_at);
        let year = date.getFullYear();
        let month = months[date.getMonth()];

        if (obj[year]) {
            if (obj[year][month]) obj[year][month].push(item);
            else {
                obj[year][month] = [];
                obj[year][month].push(item);
            }
        } else {
            obj[year] = {};
            obj[year][month] = [];
            obj[year][month].push(item);
        }
    });
    return obj;
};

export const checkFileType = (file_type) => {
    if (file_type === null) return "video";
    const audio = {
        mp3: "mp3",
        ogg: "ogg",
        amr: "amr",
        au: "au",
        awb: "awb",
        flac: "flac",
        mid: "mid",
        wav: "wav",
        wma: "wma",
        mka: "mka",
        webm: "webm",
        acc: "acc",
        ac3: "ac3",
        aiff: "aiff",
        "3gpp": "3gpp",
        smf: "smf",
        aac: "aac",
        "amr-wb": "amr-wb",
        "x-amr-wb": "x-amr-wb",
    };
    const video = {
        mp4: "mp4",
        wav: "wav",
        mov: "mov",
        wmv: "wmv",
        avi: "avi",
        flv: "flv",
        mpg: "mpg",
        mpeg: "mpeg",
        avchd: "avchd",
        f4v: "f4v",
        swf: "swf",
        mkv: "mkv",
        webm: "webm",
        m4a: "m4a",
    };
    if (file_type === audio[file_type]) {
        return "audio";
    } else if (file_type === video[file_type]) {
        return "video";
    } else return "document";
};

export const checkUrlFileType = (mediaUrl) => {
    const tempArr = mediaUrl?.split("?")[0].split(".");
    if (tempArr) return tempArr[tempArr.length - 1];
    else return "";
};

export const getDomainMappingName = (name) => {
    return domainMappingConfig?.[name?.toLowerCase()] || name;
};

export const getRedirectDomainMappingName = (name) => {
    return redirectDomainMappingConfig?.[name?.toLowerCase()] || name;
};

export const getSubDomainMappingName = (name) => {
    return subDomainMappingConfig?.[name?.toLowerCase()] || "convin.ai";
};

export const getDurationLabel = ({ gte, lte }) => {
    if (gte && lte) {
        return `Between ${gte / 60} to ${lte / 60} mins`;
    }
    if (lte) {
        return `Below ${lte / 60}} mins`;
    }
    if (gte) {
        return `Above ${gte / 60} mins`;
    }
    return "";
};

export const toSentenceCase = (str) => {
    // Convert the entire string to lowercase
    str = str.toLowerCase();

    // Use a regular expression to find the first letter of each sentence
    str = str.replace(/(^\s*\w|[\.\?!]\s*\w)/g, function (c) {
        return c.toUpperCase();
    });

    // Return the modified string
    return str;
};

const flattenDataInObject = (data, newObj) => {
    if (data === null) return {};
    if (typeof data == "object" && Object.keys(data).length) {
        Object.keys(data).forEach((e) => {
            if (typeof data[e] != "object") {
                newObj[e] = data[e];
            }
            if (
                typeof data[e] == "object" &&
                (typeof data[e][0] == "string" || typeof data[e][0] == "number")
            ) {
                newObj[e] = data[e].join(", ");
            }
            if (
                typeof data[e] == "object" &&
                !(
                    typeof data[e][0] == "string" ||
                    typeof data[e][0] == "number"
                )
            ) {
                flattenDataInObject(data[e], newObj);
            }
        });
    }
};

export const flattenObject = (data) => {
    const myObj = {};
    flattenDataInObject(data, myObj);
    return myObj;
};

export const showExtraFieldsForQms = (domain) => {
    return domain === "kotak" || domain === "qa" || domain === "staging";
};

export const permissions_manager = (code_names, code_names_heading) => {
    let audit_manager_permissions = code_names?.find(
        (e) => e.heading === code_names_heading
    ).permissions;
    const editKeys = [].concat.apply(
        [],
        Object.keys(audit_manager_permissions || {}).map(
            (key) => audit_manager_permissions[key]?.edit
        )
    );
    let permision_obj = {};
    editKeys?.forEach(
        (e) => (permision_obj[e.code_name.split(".")[1]] = e.is_selected)
    );
    return permision_obj;
};
