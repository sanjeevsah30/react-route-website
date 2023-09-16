import { capitalizeFirstLetter } from "./common.helper";

export function getDomain(host) {
    let domain = host.split(".")[0];
    if (domain === "www") {
        domain = host.split(".")[1];
    }
    return domain;
}

export const getTimeZone = () =>
    Intl.DateTimeFormat().resolvedOptions().timeZone;

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
};

export const formatDate = (date, is_start) => {
    const date_in_string = date.toString().split(" ");
    date_in_string[4] = is_start ? "00:00:00" : "23:59:59";
    return date_in_string.join(" ");
};

export const getSerialNo = (index) => {
    return index < 9 ? `0${index + 1}` : index + 1;
};

export const getResponseColor = (response, theme) => {
    if (response.toLowerCase() === "yes" || response === true) {
        return theme.palette.auditColors["good"];
    } else if (response.toLowerCase() === "no" || response === true) {
        return theme.palette.auditColors["bad"];
    } else {
        return theme.palette.grey["666"];
    }
};

export const getCurrentQuater = () => {
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

//function that adds O to single digit
function pad(d) {
    return d < 10 ? `0${d}` : d;
}

export const getPreviousQuater = () => {
    let now = new Date();
    let quarter = Math.floor(now.getMonth() / 6);
    let firstDate = new Date(now.getFullYear(), quarter * 6, 1);
    let endDate = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth() + 3,
        0
    );

    return [formatDate(firstDate, true), formatDate(endDate)];
};

export const getDuration = function ({ start_time, end_time }) {
    // get total seconds between the times
    let delta =
        Math.abs(
            new Date(end_time).getTime() - new Date(start_time).getTime()
        ) / 1000;

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

export const openLink = ({ link, target = "_blank" }) => {
    window.open(link, target);
    window.focus();
};

export const checkArray = (arr) => {
    return Array.isArray(arr) ? arr : [];
};

export const getAvatarCharacter = (name) => {
    if (!name) return null;
    const firstChar = name.charAt(0);
    if (
        (firstChar >= "a" && firstChar <= "z") ||
        (firstChar >= "A" && firstChar <= "Z")
    )
        return firstChar;
    return null;
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
        : null;
};

export const userMentionsData = (users = []) => {
    return users.map((user) => ({
        id: user.id,
        display: capitalizeFirstLetter(user.first_name) || user.email,
    }));
};

export const getCleanComment = ({ comment }) => {
    let regex = /@\[.+?\]\(.+?\)/gm;
    let displayRegex = /@\[.+?\]/g;
    let idRegex = /\(.+?\)/g;
    let matches = comment.match(regex);
    let arr = [];
    matches &&
        matches.forEach((m) => {
            let id = m.match(idRegex)[0].replace("(", "").replace(")", "");
            let display = m
                .match(displayRegex)[0]
                .replace("@[", "")
                .replace("]", "");

            arr.push({ id: id, display: display });
        });
    let newComment = comment.split(regex);
    let output = "";
    for (let i = 0; i < newComment.length; i++) {
        const c = newComment[i];
        if (i === newComment.length - 1) output += c;
        else
            output +=
                c +
                `<a href="/People/${arr[i].id}" class="comment_mentioned_user">${arr[i].display}</a>`;
    }
    return output;
};
