import BorderedBox from "@convin/components/custom_components/BorderedBox";
import PageLoader from "@convin/components/custom_components/PageLoader";
import { SettingRoutes } from "@convin/config/routes.config";
import { useGetTemplatesQuery } from "@convin/redux/services/settings/auditManager.service";
import {
    Box,
    Button,
    Divider,
    Stack,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import TemplateInfo from "./TemplateInfo";
import AuditSettingsEmptySate from "../common/AuditSettingsEmptySate";

export default function TemplateList(): JSX.Element {
    const theme = useTheme();
    const history = useHistory();
    const handleClick = () => {
        history.push(
            `/settings/${SettingRoutes.AUDIT_MANAGER.path}/template/create`
        );
    };
    // const handleNavigate = (id: number) => {
    //     history.push(`/settings/${SettingRoutes.AUDIT_MANAGER.path}/${id}`);
    // };

    const { data, isFetching } = useGetTemplatesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    if (isFetching) {
        return <PageLoader />;
    }
    return (
        <Box className="flex column overflow-hidden h-full">
            {data?.length ? (
                <>
                    <Box
                        className="flex justify-between items-center"
                        sx={{ px: 5, py: 2 }}
                    >
                        <Typography
                            variant="extraLarge"
                            className="font-semibold"
                        >
                            Audit Templates
                        </Typography>
                        <Button
                            className="uppercase"
                            onClick={handleClick}
                            variant="global"
                        >
                            Create Template
                        </Button>
                    </Box>
                    <Divider />
                    <Stack
                        sx={{ px: 2.5, py: 2.5 }}
                        spacing={3}
                        className="overflow-y-scroll flex-1"
                    >
                        {data?.map((e) => {
                            return (
                                <BorderedBox
                                    key={e.id}
                                    sx={{
                                        px: 2,
                                        py: 2.5,
                                        bgcolor: alpha(
                                            theme.palette.common.white,
                                            1
                                        ),
                                        "&:hover": {
                                            border: `1px solid ${theme.palette.primary.main}`,
                                        },
                                    }}
                                    // onClick={() => handleNavigate(e.id)}
                                >
                                    <TemplateInfo {...e} />
                                </BorderedBox>
                            );
                        })}
                    </Stack>
                </>
            ) : (
                <div className="h-full flex flex-col justify-center items-center">
                    <AuditSettingsEmptySate type="template" />
                    <Button
                        className="uppercase"
                        onClick={handleClick}
                        variant="global"
                        sx={{ mt: 2 }}
                    >
                        Create Template
                    </Button>
                </div>
            )}
        </Box>
    );
}
