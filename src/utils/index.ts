import { TokenPayload } from "@types";

export const modalSizes = {
    sm: "500px",
    smPlus: "45%",
    md: "60%",
    lg: "70%",
    xl: "80%",
    fit: "fit-content",
};

export const apiOkStatuses = [200, 201, 204];

export const apiErrorStatuses = [400, 401, 403, 404, 405, 406, 415, 500];

export const datesFormatOpt: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
};

export const formattedDates = (date: Date | string | undefined) => {
    const formattedDate = date?.toLocaleString("en-US", datesFormatOpt);
    return formattedDate;
};

export const validateFields = (
    object: Record<string, string | number | boolean | null>,
) => {
    for (const i in object) {
        if (object[i] === "" || object[i] === null || object[i] === undefined) {
            return false;
        }
    }
    return true;
};

export const dateToUTC = (date: Date | string) => {
    const now = new Date(date);
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    return utc;
};

export const woTz = (d: Date | undefined) => {
    if (d === undefined) {
        return;
    }

    const tz = d && d?.getTimezoneOffset() * 60000;

    const dateWoTz = d && tz && new Date(d?.getTime() - tz);

    return dateWoTz;
};

export const transformParams = (params: any) => {
    return Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
};

export const jwtDeserializer = (token: string) => {
    if (token) {
        const tokenPayload = JSON.parse(
            atob(token.split(".")[1]),
        ) as TokenPayload;
        return tokenPayload;
    }
};

export const showModal = (title: string) => {
    const modal = document.getElementById(title + "-modal") as HTMLFormElement;
    if (modal) {
        modal.showModal();
    }
};
