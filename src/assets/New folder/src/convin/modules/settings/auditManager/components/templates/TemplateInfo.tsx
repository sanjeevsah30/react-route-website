import ExtrasToolTip from "@convin/components/custom_components/Tooltip/ExtrasToolTip";
import { SettingRoutes } from "@convin/config/routes.config";
import { Template } from "@convin/type/Audit";
import {
    Box,
    Chip,
    Grid,
    Stack,
    SxProps,
    Theme,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import MoreOptions from "@convin/components/custom_components/Popover/MoreOptions";
import { alpha } from "@mui/system";
import { EditSvg, CloneSvg } from "@convin/components/svg";
import { useCloneTemplateMutation } from "@convin/redux/services/settings/auditManager.service";

const sxPropOption = (theme: Theme): SxProps => ({
    px: 1.5,
    py: 1.2,
    "&:hover": {
        color: "primary.main",
        bgcolor: alpha(theme?.palette?.primary?.main, 0.2),
    },
});
export default function TemplateInfo({
    name,
    overall_score,
    teams,
    id,
}: Template): JSX.Element {
    const history = useHistory();
    const [cloneTemplateRequest] = useCloneTemplateMutation();

    const theme = useTheme();

    const handleNavigate = (id: number) => {
        history.push(`/settings/${SettingRoutes.AUDIT_MANAGER.path}/${id}`);
    };

    const handleclone = (id: number) => {
        cloneTemplateRequest(id)
            .unwrap()
            .then((res) => {
                handleNavigate(res.id);
            });
    };

    return (
        <Grid
            container
            spacing={3}
            className="cursor-pointer"
            onClick={() => {
                handleNavigate(id);
            }}
        >
            <Grid item xs={3} className="flex items-center ">
                <Tooltip title={<span className="px-2">{id}</span>}>
                    <Typography className="font-semibold">{name}</Typography>
                </Tooltip>
            </Grid>
            <Grid item xs={2} className="flex column items-center">
                <Typography variant="small" className="uppercase mb-1">
                    TOTAL SCORE
                </Typography>
                <Typography variant="large" className="font-semibold">
                    {overall_score}
                </Typography>
            </Grid>
            <Grid item xs={5} className="flex column items-start">
                <Typography variant="small" className="uppercase mb-1">
                    APPLIED TEAMS
                </Typography>
                {teams.length ? (
                    <Stack
                        spacing={1}
                        direction="row"
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {teams.slice(0, 3).map((e) => (
                            <Chip
                                sx={{
                                    bgcolor: "warning.main",
                                }}
                                className="text-[14px]"
                                label={e.name}
                                key={e.id}
                            />
                        ))}
                        {teams.length > 3 ? (
                            <Tooltip
                                arrow
                                title={
                                    <ExtrasToolTip
                                        extras={teams
                                            .slice(3)
                                            .map((e) => e.name)}
                                    />
                                }
                            >
                                <Chip
                                    className="text-[14px]"
                                    sx={{}}
                                    label={`+${teams?.length - 3}`}
                                />
                            </Tooltip>
                        ) : (
                            <></>
                        )}
                    </Stack>
                ) : (
                    <Typography
                        className="font-semibold"
                        sx={{ color: "grey.999" }}
                    >
                        No Teams Applied
                    </Typography>
                )}
            </Grid>
            <Grid item xs={2} className="flex items-center">
                {/* <EditButton onClick={() => handleNavigate(id)} /> */}
                <MoreOptions>
                    <Box
                        sx={sxPropOption(theme)}
                        onClick={() => handleNavigate(id)}
                    >
                        <EditSvg sx={{ mx: 1 }} />
                        <span>Edit</span>
                    </Box>
                    <Box
                        sx={sxPropOption(theme)}
                        onClick={() => handleclone(id)}
                    >
                        <CloneSvg sx={{ mx: 1 }} />
                        <span>Clone</span>
                    </Box>
                </MoreOptions>
            </Grid>
        </Grid>
    );
}
