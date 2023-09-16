import { isDefined } from "./common.helper";

export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getDateTime = ({
    isoDate,
    type = "dateTime",
    separator = " ",
    format,
}: {
    isoDate: number | Date | string;
    type?: string;
    separator?: string;
    format?: string;
}): string => {
    let returnTime = "";
    let returnDate = "";
    const fullDateTime = new Date(isoDate);

    const year = fullDateTime.getFullYear();
    const month = fullDateTime.getMonth();
    let date = String(fullDateTime.getDate());
    const hour: number = fullDateTime.getHours();
    let minutes: string | number = fullDateTime.getMinutes();
    const dayName = day[fullDateTime.getDay()];

    if (+date < 10) {
        date = `0${date}`;
    }

    if (hour) {
        if (hour < 12 || hour === 24) {
            returnTime = `${hour % 12 || 12}:${minutes} AM`;
        } else {
            returnTime = `${hour % 12 || 12}:${minutes} PM`;
        }
    }

    switch (format) {
        case "dd MM, YY":
            return `${months[month]} ${date}, ${year}`;
        case "MM dd, YYYY":
            return `${months[month]} ${date}, ${year}`;
        case "MM dd":
            return `${months[month]} ${date}`;
        case "dd MM, T":
            return `${date} ${months[month]} - ${returnTime} `;
        default:
    }

    if (date === "01" || date === "31" || date === "21") {
        date += "st";
    } else if (date === "02" || date === "22") {
        date += "nd";
    } else if (date === "03" || date === "23") {
        date += "rd";
    } else {
        date += "th";
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    returnDate = `${date}${separator}${months[month]}, ${separator}${year}`;

    switch (type) {
        case "date":
            return returnDate;
        case "time":
            return returnTime;
        case "timeDate":
            return `${returnTime},  ${returnDate}`;
        case "dateTime":
            return `${returnDate}, ${returnTime}`;
        case "dayDate":
        default:
            return `${dayName}, ${returnDate}`;
    }
};

export const convertDateToEpoch = (
    date: Date | undefined | string | null | number
) => {
    if (!isDefined(date)) return null;
    return new Date(date).getTime() / 1000;
};

export const dateDifference = (date1: number, date2: number) =>
    Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)) + 2;

export function formatDateString(isoDate: string): string {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
    });

    return `${formattedDate} (${date.toString().match(/\((.*)\)/)?.[1]})`;
}

export function reverseFormatDateString(
    formattedDate: string | null
): string | null {
    if (!formattedDate) return null;
    const datePattern =
        /^([A-Za-z]{3}) ([A-Za-z]{3}) (\d{1,2}) (\d{4}) (\d{1,2}):(\d{1,2}):(\d{1,2}) (.*)$/;
    const regex = new RegExp(datePattern);
    const match = regex.exec(formattedDate);

    if (match) {
        const [, weekday, month, day, year, hour, minute, second, timeZone] =
            match;
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
        const isoDate = `${year}-${monthIndex
            .toString()
            .padStart(2, "0")}-${day.padStart(2, "0")}`;
        return isoDate;
    }

    return null;
}

export const formatDate = (date: Date, is_start?: boolean): string => {
    const date_in_string = date.toString().split(" ");
    date_in_string[4] = is_start ? "00:00:00" : "23:59:59";
    return date_in_string.join(" ");
};

export const getCurrentQuater = (): Array<string> => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    const endDate = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth() + 3,
        0
    );

    return [formatDate(firstDate, true), formatDate(endDate)];
};

export const getPreviousQuater = (): Array<string> => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 6);
    const firstDate = new Date(now.getFullYear(), quarter * 6, 1);
    const endDate = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth() + 3,
        0
    );

    return [formatDate(firstDate, true), formatDate(endDate)];
};
