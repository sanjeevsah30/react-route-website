import { AvatarGroup, Tooltip } from "@mui/material";
import { StyledAvatar } from "../Styled";
import { getColor } from "tools/helpers";
import ExtrasToolTip from "../Tooltip/ExtrasToolTip";
import { ReactElement } from "react";

export default function MultipleAvatar({
    users,
}: {
    users: string[];
}): ReactElement {
    return (
        <AvatarGroup
            classes={{
                avatar: "w-[32px] h-[32px] text-sm",
            }}
            max={4}
        >
            {users.slice(0, 3).map((name, idx) => (
                <Tooltip
                    arrow
                    title={<span className="p-[8px]">{name}</span>}
                    key={idx}
                >
                    <StyledAvatar
                        sx={{
                            bgcolor: getColor(name),
                        }}
                    >
                        {name.substring(0, 1).toUpperCase()}
                    </StyledAvatar>
                </Tooltip>
            ))}
            {users.length > 3 && (
                <Tooltip
                    arrow
                    placement="right"
                    title={<ExtrasToolTip extras={users.slice(3)} />}
                >
                    <StyledAvatar
                        sx={{
                            bgcolor: getColor(users[3]),
                        }}
                    >
                        {users.length > 102 ? "+99" : `+${users.length - 3}`}
                    </StyledAvatar>
                </Tooltip>
            )}
        </AvatarGroup>
    );
}
