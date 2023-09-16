import homeConfigs from "@constants/Home/index";
import React, { useEffect, useState } from "react";
import { MehOutlined, WifiOutlined } from "@ant-design/icons";
import "./networkheader.scss";

function NetworkHeader(props) {
    const [isOffline, setIsOffline] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    let timer = null;
    //Eventlisteners checking user's internet connection
    useEffect(() => {
        window.addEventListener("online", () => {
            setIsOffline(false);
            setIsOnline(true);
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                setIsOnline(false);
            }, 2000);
        });
        window.addEventListener("offline", () => {
            setIsOnline(false);
            setIsOffline(true);
        });
    }, []);
    const handleReload = () => {
        window.location.reload();
    };
    return (
        <div
            className={`offline_online_header ${isOffline ? "offline" : ""} ${
                isOnline ? "online" : ""
            }`}
        >
            {isOffline && (
                <span>
                    <MehOutlined /> {homeConfigs.OFFLINE_MESSAGE}{" "}
                    <span onClick={handleReload} className="try_again">
                        Try Again
                    </span>
                </span>
            )}
            {isOnline && (
                <span>
                    <WifiOutlined /> {homeConfigs.ONLINE_MESSAGE}
                </span>
            )}
        </div>
    );
}

export default NetworkHeader;
