import {
    Tooltip,
    TooltipProps,
    Typography,
    styled,
    tooltipClasses,
} from "@mui/material";

interface TypographyElipsisProps {
    children: string;
    className?: string;
    [key: string]: unknown;
}

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        padding: "4px",
    },
});

export default function TypographyElipsis({
    children,
    className = "",
    ...rest
}: TypographyElipsisProps): JSX.Element {
    return (
        <StyledTooltip title={children} placement="top-start">
            <Typography
                component="div"
                className={`text-ellipsis overflow-hidden whitespace-nowrap ${className}`}
                {...rest}
            >
                {children}
            </Typography>
        </StyledTooltip>
    );
}

TypographyElipsis.defaultProps = {
    className: "",
};
