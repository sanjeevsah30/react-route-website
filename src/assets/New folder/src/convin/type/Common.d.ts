export interface PaginationType<T> {
    count: number;
    previous: null | string;
    next: null | string;
    results: T[];
}

export type MeetingTypeConst = "call" | "chat" | "email";

export interface FormFieldType {
    value: string | number | null | boolean;
    error: boolean;
    errorMessage: string;
}

export interface VersionDataType {
    version: number;
    domain_type: "b2b" | "b2c";
    [key: string]: any;
}
