import { Question } from "@convin/type/Audit";
import { UserType } from "@convin/type/User";
import html2canvas from "html2canvas";

function pad(d: number) {
    return d < 10 ? "0" + d.toString() : d.toString();
}

export const getUserName = (user: UserType | null | undefined): string => {
    if (user === null || user === undefined) return "";
    const { first_name, last_name, email, id } = user;
    return first_name && last_name
        ? `${first_name} ${last_name}`
        : first_name || email || id?.toString() || "-";
};

export const getQuestionType = (
    type: Question["question_type"]
): "Yes/No" | "Scale 1-10" | "Custom" =>
    type === "yes_no" ? "Yes/No" : type === "rating" ? "Scale 1-10" : "Custom";

export const getColor = (name = ""): string => {
    const colors = [
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

    function getRandomInteger(): number {
        let integer = 0;
        for (let i = 0; i < name?.length; i += 1) {
            integer += name.charCodeAt(i);
        }
        return (
            // eslint-disable-next-line no-unsafe-optional-chaining
            (integer * name?.charCodeAt(0) || Math.random() * 100) %
            colors.length
        );
    }

    return colors?.[getRandomInteger()] || "#FF7D51";
};

export function capitalizeFirstLetter(val = ""): string {
    if (!val) return val;
    const str = val?.toLowerCase();
    return str?.charAt(0)?.toUpperCase() + str.slice(1);
}

export function isDefined<T>(value: T | undefined | null): value is T {
    return <T>value !== undefined && <T>value !== null;
}

export function getQuetionTypeLabel(
    value: Question["question_type"] | undefined
): string {
    switch (value) {
        case "yes_no":
            return "Yes or No";
        case "rating":
            return "Scale 1-10";
        case "custom":
            return "Custom";
        default:
            return "None";
    }
}

export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const downloadElementAsImg = async (
    elementIdentifire: string,
    fileName: string,
    createDataOnly?: boolean
) => {
    // Step 1: Identify the element
    const element = document.querySelector(
        `.${elementIdentifire}`
    ) as HTMLElement | null;
    if (!element) {
        console.error(`Element with ID '${elementIdentifire}' not found.`);
        return;
    }

    const html = document.getElementsByTagName("html")[0];
    const body = document.getElementsByTagName("body")[0];
    let htmlWidth = html.clientWidth;
    let bodyWidth = body.clientWidth;

    const newWidth = element.scrollWidth - element.clientWidth;

    if (newWidth > element.clientWidth) {
        htmlWidth += newWidth;
        bodyWidth += newWidth;
    }

    html.style.width = htmlWidth + "px";
    body.style.width = bodyWidth + "px";

    const canvas = await html2canvas(element);
    const image = canvas.toDataURL("image/png", 1.0);

    if (createDataOnly) {
        return image;
    } else {
        downloadImage(image, fileName);
    }
    html.style.width = "";
    body.style.width = "";
};

export const downloadImage = (blob: string, fileName: string): void => {
    const fakeLink = window.document.createElement("a");
    fakeLink.style.display = "none";
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
};
export const getTimeZone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export function dataURIToBlob(dataURI: string): Blob {
    dataURI = dataURI.replace(/^data:/, "");

    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const base64 = dataURI.replace(/^[^,]+,/, "");
    const arrayBuffer = new ArrayBuffer(base64.length);
    const typedArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < base64.length; i++) {
        typedArray[i] = base64.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
}

export const getDuration = function (start: string, end: string) {
    // get total seconds between the times
    let delta =
        Math.abs(new Date(end).getTime() - new Date(start).getTime()) / 1000;

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    const seconds = delta % 60;

    if (days > 0) {
        return `${pad(days)}d, ${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    if (hours) {
        return `${pad(hours)}:${pad(minutes)}:${pad(Math.ceil(seconds))}`;
    }
    return `${pad(minutes)}:${pad(Math.ceil(seconds))}`;
};
