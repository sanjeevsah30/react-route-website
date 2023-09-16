import TypographyElipsis from "@convin/components/custom_components/Typography/TypographyElipsis";
import { AddMemberSvg, DeleteSvg, EditSvg } from "@convin/components/svg";
import {
    Accordion,
    Grid,
    SxProps,
    Theme,
    useTheme,
    Box,
    Divider,
    styled,
    AccordionProps,
} from "@mui/material";

import SubTeamsTable from "./SubTeamsTable";
import MoreOptions from "@convin/components/custom_components/Popover/MoreOptions";
import { alpha } from "@mui/system";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useTeamManagerContext from "../hooks/useTeamManagerContext";
import {
    SubTeam,
    SubteamTableData,
    Team,
} from "@convin/type/Team";

export const StyledAccordion = styled((props: AccordionProps) => (
    <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "12px",
    "& .MuiCollapse-entered": {
        overflowX:"hidden",
        borderBottomLeftRadius:"inherit",
        borderBottomRightRadius:"inherit"

    },
    "&:before": {
        display: "none",
    },
}));

const TeamCard = ({ data }: { data: Team }): JSX.Element => {
    const { name, subteams, members, id } = data;
    const { dispatch } = useTeamManagerContext();
    const theme = useTheme();
    const subteamsData: SubteamTableData[] = subteams.map((item: SubTeam) => ({
        id: item?.id,
        name: item?.name,
        count: item.members?.length,
    }));

    const sxPropOption = (theme: Theme): SxProps => ({
        px: 1.5,
        py: 1.2,
        "&:hover": {
            color: "primary.main",
            bgcolor: alpha(theme?.palette?.primary?.main, 0.2),
        },
    });

    return (
        <StyledAccordion
            disableGutters
            elevation={0}
            
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="border-none rounded-xl items-center"
                sx={{ py: 1.5 }}
            >
                <Box className="w-[100%]">
                    <Grid container spacing={{ xs: 1, xl: 2 }} columns={24}>
                        <Grid item xs={15} className="flex">
                            <TypographyElipsis
                                className="font-semibold text-base"
                                sx={{ pl: 1.5 }}
                            >
                                {name}
                            </TypographyElipsis>
                        </Grid>
                        <Grid
                            item
                            xs={3}
                            className="flex justify-end items-center"
                        >
                            <Typography
                                sx={{ color: "grey.666" }}
                                variant="medium"
                            >
                                Sub Team
                            </Typography>
                            <Typography
                                className=""
                                sx={{ ml: 1, fontSize: "16px" }}
                            >
                                {subteams?.length}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} className="flex justify-center">
                            <Divider orientation="vertical" light />
                        </Grid>

                        <Grid item xs={3} className="flex items-center">
                            <Typography
                                variant="medium"
                                sx={{ color: "grey.666" }}
                            >
                                Total Members -
                            </Typography>
                            <Typography sx={{ ml: 0.5, fontSize: "16px" }}>
                                {members?.length +
                                    subteams?.reduce(
                                        (add: number, { members }) =>
                                            add + members?.length,
                                        0
                                    )}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} className="flex justify-around">
                            <MoreOptions>
                                <Box
                                    sx={sxPropOption(theme)}
                                    onClick={(event) => {
                                        event?.stopPropagation();
                                        dispatch({
                                            type: "UPDATE",
                                            payload: {
                                                teamToUpdate: {
                                                    id: id,
                                                    name: name,
                                                    subteams: subteams,
                                                },
                                                isManageUsersDrawerOpen: true,
                                            },
                                        });
                                    }}
                                >
                                    <AddMemberSvg sx={{ mx: 1 }} />

                                    <span>Manage Members</span>
                                </Box>
                                <Box
                                    sx={sxPropOption(theme)}
                                    onClick={(event) => {
                                        event?.stopPropagation();
                                        dispatch({
                                            type: "UPDATE",
                                            payload: {
                                                teamToUpdate: {
                                                    id,
                                                    name: name,
                                                    subteams: subteams,
                                                },
                                                isCRUDTeamDrawerOpen: true,
                                            },
                                        });
                                    }}
                                >
                                    <EditSvg sx={{ mx: 1.5 }} />
                                    <span>Edit</span>
                                </Box>
                                <Box
                                    sx={sxPropOption(theme)}
                                    onClick={(event) => {
                                        event?.stopPropagation();
                                        dispatch({
                                            type: "UPDATE",
                                            payload: {
                                                teamToUpdate: {
                                                    id,
                                                    name: name,
                                                    subteams: subteams,
                                                },
                                                isDeleteTeamModalOpen: true,
                                            },
                                        });
                                    }}
                                >
                                    <DeleteSvg sx={{ mx: 1.5 }} />
                                    <span>Delete</span>
                                </Box>
                            </MoreOptions>
                        </Grid>
                    </Grid>
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }} className="rpunded-xl">
                <SubTeamsTable data={subteamsData} />
            </AccordionDetails>
        </StyledAccordion>
    );
};

export default TeamCard;
