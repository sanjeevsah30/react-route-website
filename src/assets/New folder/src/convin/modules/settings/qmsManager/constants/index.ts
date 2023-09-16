import { QmsField } from "../context/QmsStateContext";

export const fieldTypes: {
    id: QmsField["metadata"]["nature"];
    label: string;
}[] = [
    {
        label: "Text Field",
        id: "text_field",
    },
    {
        label: "Multiple Options",
        id: "select",
    },
    {
        label: "Date & Time Picker",
        id: "date_time",
    },
];

export const dateFieldOptions: {
    id: QmsField["metadata"]["date_time"];
    label: string;
}[] = [
    {
        label: "Only Time",
        id: "time",
    },
    {
        label: "Only Date",
        id: "date",
    },
    {
        label: "Both",
        id: "both",
    },
];
