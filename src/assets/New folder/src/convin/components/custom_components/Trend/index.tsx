import { Typography } from "@mui/material";
import { formatFloat } from "@convin/utils/helper";
import { auditColors } from "@convin/theme/palette";

export default function Trend({
    change,
}: {
    change: number;
}): JSX.Element | null {
    return (
        <Typography
            sx={{ color: change >= 0 ? auditColors.good : auditColors.bad }}
            className="font-semibold"
            variant="textSm"
        >
            {change >= 0 ? (
                <>
                    &#9650; &nbsp;
                    {formatFloat(change, 2)}%
                </>
            ) : (
                <>
                    &#9660; &nbsp;
                    {-formatFloat(change, 2)}%
                </>
            )}
        </Typography>
    );
}
