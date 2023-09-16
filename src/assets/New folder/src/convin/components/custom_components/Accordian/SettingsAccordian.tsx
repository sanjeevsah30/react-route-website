import { styled } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";

export const SettingsAccordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "6px",
    boxShadow: "0px 4px 10px rgba(51, 51, 51, 0.1) !important",
    "&:before": {
        display: "none",
    },
}));
