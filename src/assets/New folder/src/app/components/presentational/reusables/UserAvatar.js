import React from "react";
import UserSvg from "app/static/svg/UserSvg";

function UserAvatar({ size, color, scale }) {
    return (
        <div
            style={{
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                borderRadius: "50%",
            }}
            className="flex alignCenter justifyCenter"
        >
            <UserSvg
                style={{
                    color: "#ffffff",
                    transform: `scale(${scale})`,
                }}
            />
        </div>
    );
}

UserAvatar.defaultProps = {
    size: 24,
    scale: 1,
};

export default UserAvatar;
