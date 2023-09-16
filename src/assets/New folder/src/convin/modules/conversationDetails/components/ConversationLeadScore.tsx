import BorderedBox from "@convin/components/custom_components/BorderedBox";
import InfoSvg from "@convin/components/svg/InfoSvg";
import ColdLeadSvg from "@convin/components/svg/Lead/ColdLeadSvg";
import HotLeadSvg from "@convin/components/svg/Lead/HotLeadSvg";
import WarmLeadSvg from "@convin/components/svg/Lead/WarmLeadSvg";
import StarFeatureSvg from "@convin/components/svg/StarFeatureSvg";
import { useGetLeadScoreConfigQuery } from "@convin/redux/services/settings/scoreSense.service";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    Box,
    Divider,
    Typography,
    Tooltip,
    useTheme,
    alpha,
    Stack,
} from "@mui/material";
import React, { FunctionComponent, ReactElement, useState } from "react";

type Props = {
    lead_score: number;
    classification: "hot" | "warm" | "cold";
    total_meetings: number;
    scored_meetings: number;
    metadata: {
        lead_type_reason: string[];
        conversion_reason: string[];
    } | null;
};

const Tag = ({ name }: { name: string }): ReactElement => {
    return (
        <Box
            component="span"
            sx={(theme) => ({
                background:
                    "linear-gradient(90deg, #FF1B79 0%, #FF4E60 54.69%, #2D66E8 99.48%);",
                backgroundClip: "text",
                "-webkit-background-clip": "text",
                "-webkit-text-fill-color": "transparent",
                borderRadius: "100px",
                border: `1px solid ${alpha(
                    theme.palette.textColors["333"],
                    0.1
                )}`,
                px: 1,
            })}
        >
            {name}
        </Box>
    );
};

const TagsSection = (): ReactElement => {
    return (
        <Box
            sx={{
                mb: 1,
            }}
            className="flex gap-[8px]"
        >
            <StarFeatureSvg />
            <Stack gap={1} direction={"row"} className="flex-1">
                <Tag name="ineffective communication" />
                <Tag name="insufficient products knowledge" />
            </Stack>
        </Box>
    );
};

const LeadStats: FunctionComponent<{
    heading: "hot" | "warm" | "cold";
    value: string;
}> = ({ heading, value }) => {
    return (
        <Box
            className="flex gap-[4px] items-center"
            sx={{
                mb: 1.5,
            }}
        >
            <Box className="flex items-center">
                {heading === "hot" && <HotLeadSvg />}
                {heading === "warm" && <WarmLeadSvg />}
                {heading === "cold" && <ColdLeadSvg />}
            </Box>
            <Typography variant="small" className="capitalize">
                {heading}
            </Typography>
            <Typography variant="small" sx={{ color: "grey.999" }}>
                {value}
            </Typography>
        </Box>
    );
};

const LeadConfigTip: FunctionComponent = () => {
    const { data, isLoading } = useGetLeadScoreConfigQuery();
    return (
        <Box
            sx={{
                p: 1,
                borderRadius: "6px",
            }}
        >
            {isLoading ? (
                <Typography
                    variant="small"
                    sx={{
                        color: "grey.333",
                    }}
                >
                    ...Loading
                </Typography>
            ) : isDefined(data) ? (
                <>
                    <LeadStats
                        heading="hot"
                        value={`(${data?.upper_bound}-100)`}
                    />
                    <LeadStats
                        heading="warm"
                        value={`(${data?.middle_bound}-${
                            data?.upper_bound - 1
                        })`}
                    />
                    <LeadStats
                        heading="cold"
                        value={`(0-${data?.middle_bound - 1})`}
                    />
                </>
            ) : (
                <></>
            )}
        </Box>
    );
};

export const LeadInfo: FunctionComponent<Props> = ({
    classification,
    metadata,
}) => {
    return (
        <>
            <Box
                sx={{
                    p: 0.5,
                }}
            >
                <Typography
                    className="font-semibold"
                    sx={{
                        mb: 1,
                    }}
                >
                    Why this coluld be a {classification?.toLowerCase()} lead ?
                </Typography>
                {/* <TagsSection /> */}
                <Typography
                    sx={{
                        color: "grey.666",
                        my: 2,
                    }}
                    variant="medium"
                    className="font-semibold"
                >
                    Following are the reasons why this account coluld be a{" "}
                    {classification?.toLowerCase()} lead.
                </Typography>
                <Box
                    component="ul"
                    sx={{
                        pl: 1.5,
                        my: 2,
                    }}
                    className="list-disc"
                >
                    {metadata?.lead_type_reason?.map((txt, idx) => {
                        return (
                            <Typography
                                component="li"
                                variant="medium"
                                sx={{
                                    color: "grey.666",
                                }}
                                key={idx}
                            >
                                {txt}
                            </Typography>
                        );
                    })}
                </Box>
            </Box>
            <Box
                sx={{
                    p: 0.5,
                }}
            >
                <Typography
                    className="font-semibold"
                    sx={{
                        mb: 1,
                    }}
                >
                    Next steps for the agent
                </Typography>
                {/* <TagsSection /> */}
                <Typography
                    sx={{
                        color: "grey.666",
                        my: 2,
                    }}
                    variant="medium"
                    className="font-semibold"
                >
                    The following steps can be taken by the agent to ensure
                    conversion.
                </Typography>
                <Box
                    component="ul"
                    sx={{
                        pl: 1.5,
                        my: 2,
                    }}
                    className="list-disc"
                >
                    {metadata?.conversion_reason?.map((txt, idx) => {
                        return (
                            <Typography
                                component="li"
                                variant="medium"
                                sx={{
                                    color: "grey.666",
                                }}
                                key={idx}
                            >
                                {txt}
                            </Typography>
                        );
                    })}
                </Box>
            </Box>
        </>
    );
};

export default function ConversationLeadScore(props: Props): JSX.Element {
    const { classification, lead_score, scored_meetings, total_meetings } =
        props;
    const [open, setOpen] = useState<boolean>(false);
    const theme = useTheme();
    const color =
        classification.toLowerCase() === "hot"
            ? theme.palette.leadColors.hot
            : classification.toLowerCase() === "warm"
            ? theme.palette.leadColors.warm
            : theme.palette.leadColors.cold;
    return (
        <BorderedBox
            sx={{
                py: 1,
                px: 2.5,
                mb: 3,
                color: "grey.333",
            }}
        >
            <Box className="flex justify-between items-center">
                <Box>
                    <Box className="flex items-center gap-[8px]">
                        <StarFeatureSvg />

                        <Typography className="font-bold">
                            Lead Score
                        </Typography>
                        <Tooltip
                            classes={{ tooltip: "bg-white" }}
                            title={<LeadConfigTip />}
                        >
                            <div>
                                <InfoSvg />
                            </div>
                        </Tooltip>
                    </Box>
                    {isDefined(props.metadata) ? (
                        <Typography
                            variant="small"
                            sx={{
                                color: "primary.main",
                                ml: 3.5,
                            }}
                            className="cursor-pointer"
                            onClick={() => {
                                setOpen((prev) => !prev);
                            }}
                        >
                            {open ? "Hide" : "Show"} Analysis
                        </Typography>
                    ) : (
                        <></>
                    )}
                </Box>
                <Box className="flex flex-col items-center justify-center">
                    <Box
                        sx={{
                            py: 1.5,
                            pl: 1.5,
                            pr: 0.5,
                            borderRadius: "4px",
                            color: "common.white",
                            border: "1px solid",
                            borderColor: color,
                            bgcolor: alpha(color, 0.2),
                            gap: 3.5,
                        }}
                        className="flex justify-between items-center w-[174px] h-[44px]"
                    >
                        <Stack
                            className="flex items-center"
                            direction="row"
                            gap={1}
                        >
                            {classification === "hot" && <HotLeadSvg />}
                            {classification === "warm" && <WarmLeadSvg />}
                            {classification === "cold" && <ColdLeadSvg />}

                            <Typography
                                sx={{
                                    color,
                                }}
                                className="font-semibold capitalize"
                            >
                                {classification.toLowerCase()}
                            </Typography>
                        </Stack>
                        <Box
                            sx={{
                                bgcolor: alpha(color, 0.2),
                                borderRadius: "6px",
                                px: 1,
                            }}
                            className="h-[33px] flex items-center"
                        >
                            <Typography
                                sx={{
                                    color,
                                }}
                                className="capitalize"
                                variant="medium"
                            >
                                {`${lead_score}/100`}
                            </Typography>
                        </Box>
                    </Box>
                    <Tooltip
                        title={
                            <Box
                                sx={{
                                    px: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "common.white",
                                    }}
                                    variant="small"
                                >
                                    Convin AI have analysed{" "}
                                    {`${scored_meetings}`} calls out of{" "}
                                    {`${total_meetings}`} calls from this
                                    account.
                                </Typography>
                            </Box>
                        }
                    >
                        <Typography variant="small">
                            Scored on{" "}
                            <Typography
                                component="span"
                                variant="small"
                                className="font-semibold"
                            >
                                {`${scored_meetings}`} out of{" "}
                                {`${total_meetings}`}
                            </Typography>{" "}
                            Calls
                        </Typography>
                    </Tooltip>
                </Box>
            </Box>
            {isDefined(props.metadata) && open ? (
                <>
                    <Divider
                        sx={{
                            my: 1.5,
                        }}
                    />
                    <LeadInfo {...props} />
                </>
            ) : (
                <></>
            )}
        </BorderedBox>
    );
}
