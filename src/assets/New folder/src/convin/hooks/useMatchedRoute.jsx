import { useLocation } from "react-router";

export function useMatchedRoute() {
    const { pathname } = useLocation();
    const name = pathname.split("/")?.[1]?.split("_")?.join(" ");
    return name?.toLowerCase() === "calls" ? "Meetings" : name;
}
