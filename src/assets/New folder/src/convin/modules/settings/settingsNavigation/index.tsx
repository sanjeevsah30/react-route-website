import { SettingsTypeConfig } from "@convin/config/routes.config";
import SettingsNavLink from "./components/SettingsNavLink";
import { useContext, useEffect, useState } from "react";
import { HomeContext } from "app/components/container/Home/Home";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Paper,
    Typography,
    styled,
    useTheme,
} from "@mui/material";
import ArrowDownSvg from "@convin/components/svg/ArrowDownSvg";
import { NavLink, useLocation } from "react-router-dom";

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(0deg)",
    },
    "& .MuiAccordionSummary-expandIconWrapper": {
        transform: "rotate(-90deg)",
    },
}));

export default function SettingsNavigation(): JSX.Element {
    const { canAccess, versionData } = useContext(HomeContext);
    const [activeAccordionIndex, setActiveAccordionIndex] = useState<
        number | null
    >(null);
    const theme = useTheme();

    const location = useLocation();

    useEffect(() => {
        const pathName =
            location.pathname.split("settings/")?.[1]?.split("/")?.[0] || "";
        if (pathName) {
            SettingsTypeConfig.forEach((settingType, index) => {
                Object.values(settingType.subtype).forEach(({ path }) => {
                    if (path.startsWith(pathName)) {
                        setActiveAccordionIndex(index);
                    }
                });
            });
        } else {
            setActiveAccordionIndex(0);
        }
    }, []);

    return (
        <Paper
            className="flex-col w-[214px] overflow-y-scroll"
            sx={{
                borderRight: "1px solid",
                borderColor: "divider",
            }}
        >
            {SettingsTypeConfig.map((settingType, idx) => {
                if (!settingType.hasSubType) {
                    return (
                        <Accordion
                            key={idx}
                            disableGutters
                            sx={{
                                "&:before": {
                                    height: 0,
                                },
                            }}
                        >
                            <NavLink
                                to={`/settings/${
                                    Object.values(settingType.subtype)[0].path
                                }/`}
                            >
                                <StyledAccordionSummary
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{
                                        pt: 1.5,
                                        pl: 2,
                                    }}
                                >
                                    <Typography className="font-semibold text-[14px] flex gap-[12px]">
                                        {settingType.name}
                                    </Typography>
                                </StyledAccordionSummary>
                            </NavLink>
                        </Accordion>
                    );
                }
                return (
                    <Accordion
                        key={idx}
                        expanded={activeAccordionIndex === idx}
                        disableGutters
                        sx={{
                            "&:before": {
                                height: 0,
                            },
                        }}
                    >
                        <StyledAccordionSummary
                            expandIcon={
                                <ArrowDownSvg
                                    sx={{
                                        color: theme.palette.textColors["333"],
                                    }}
                                />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                pt: 1.5,
                                pl: 2,
                            }}
                            onClick={() => {
                                if (activeAccordionIndex === idx) {
                                    setActiveAccordionIndex(null);
                                } else {
                                    setActiveAccordionIndex(idx);
                                }
                            }}
                        >
                            <Typography className="font-semibold text-[14px] flex gap-[12px]">
                                {settingType.name}
                            </Typography>
                        </StyledAccordionSummary>
                        <AccordionDetails sx={{ py: 0 }}>
                            {Object.values(settingType.subtype)
                                .filter(
                                    ({
                                        checkCanAcess,
                                        name,
                                        canAccessName = "",
                                    }) =>
                                        name === "Agent Assist"
                                            ? versionData?.feature_access
                                                  ?.live_assist
                                            : checkCanAcess
                                            ? canAccess(canAccessName || name)
                                            : true
                                )
                                .map((route, idx) => (
                                    <SettingsNavLink
                                        {...{
                                            name: route.name,
                                            path: route.path,
                                        }}
                                        key={idx}
                                    />
                                ))}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Paper>
    );
}
