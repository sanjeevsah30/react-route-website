import { AuditCardType } from "@convin/type/CustomDashboard";
import { formatFloat } from "@convin/utils/helper";
import { Box } from "@mui/material";
import DownFilledSvg from "app/static/svg/DownFilledSvg";
import UpFilledSvg from "app/static/svg/UpFilledSvg";

export const AuditCard = ({ name, count, change }: AuditCardType) => {
    return (
        <>
            <Box
                className="bold600 font16"
                sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "75%",
                    textAlign: "center",
                }}
            >
                {name}
            </Box>
            <Box className="audit_analytics_card--data">
                <div
                    className={
                        change * 100 !== 0 && name !== "auditor"
                            ? "card_translate"
                            : ""
                    }
                >
                    {count}
                </div>
                {change * 100 !== 0 && name !== "auditor" ? (
                    <div
                        style={{
                            background: change > 0 ? "#52C41A33" : "#FF636533",
                            color: change > 0 ? "#52C41A" : "#FF6365",
                        }}
                    >
                        {change > 0 ? <UpFilledSvg /> : <DownFilledSvg />}
                        {formatFloat(change, 2) || 0}%
                    </div>
                ) : null}
            </Box>
        </>
    );
};
