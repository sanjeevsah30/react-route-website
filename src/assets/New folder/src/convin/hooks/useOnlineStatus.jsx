import { useState, useEffect, useContext, createContext } from "react";

const OnlineStatusContext = createContext(true);

export function OnlineStatusProvider({ children }) {
    const [onlineStatus, setOnlineStatus] = useState(true);

    useEffect(() => {
        window.addEventListener("offline", () => {
            setOnlineStatus(false);
        });
        window.addEventListener("online", () => {
            setOnlineStatus(true);
        });

        return () => {
            window.removeEventListener("offline", () => {
                setOnlineStatus(false);
            });
            window.removeEventListener("online", () => {
                setOnlineStatus(true);
            });
        };
    }, []);

    return (
        <OnlineStatusContext.Provider value={onlineStatus}>
            {children}
        </OnlineStatusContext.Provider>
    );
}

export const useOnlineStatus = () => useContext(OnlineStatusContext);
