import BorderedBox from "@convin/components/custom_components/BorderedBox";
import GoBack from "@convin/components/custom_components/Navigation/GoBack";
import PageLoader from "@convin/components/custom_components/PageLoader";
import { EditSvg } from "@convin/components/svg";
import { SettingRoutes } from "@convin/config/routes.config";
import {
    useGetCategoriesByTemplateIdQuery,
    useGetTemplateByIdQuery,
} from "@convin/redux/services/settings/auditManager.service";
import { isDefined } from "@convin/utils/helper/common.helper";
import { Box, Divider, Grid, Stack, Typography, Button } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import TemplateCategoryList from "../categories/TemplateCategoryList";
import { useCallback, useState } from "react";
import CreateEditCategoryForm from "../categories/CreateEditCategoryForm";
import ParameterListView from "../parameters/ParameterListView";
import CategoreyStateProvider from "../context/CategoryStateContext";
import AuditSettingsEmptySate from "../common/AuditSettingsEmptySate";

export default function TemplateCategoryParameterView(): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const history = useHistory();
    const { template_id } = useParams<{ template_id: string }>();
    const { data: templateByIdData, isFetching } = useGetTemplateByIdQuery(
        template_id,
        {
            skip: !isDefined(template_id),
        }
    );

    const { data: categoryList, isFetching: categoryListIsFetching } =
        useGetCategoriesByTemplateIdQuery(+template_id, {
            skip: !isDefined(template_id),
        });

    const toggleDrawer = useCallback(
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setIsOpen((prev) => !prev);
        },
        []
    );

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    if (isFetching) {
        return <PageLoader />;
    }

    return (
        <Box sx={{ px: 3, pt: 3 }} className="h-full flex column">
            <CategoreyStateProvider>
                <Stack
                    direction="row"
                    gap={1}
                    className="items-center flex-shrink-0"
                    sx={{ mb: 3 }}
                >
                    <GoBack
                        path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/`}
                    />
                    <Typography className="font-semibold text-[22px] mr-[18px]">
                        {templateByIdData?.name}
                    </Typography>
                    <Box
                        className="cursor-pointer"
                        onClick={() =>
                            history.push(
                                `/settings/${SettingRoutes.AUDIT_MANAGER.path}/template/edit/${template_id}`
                            )
                        }
                    >
                        <EditSvg />
                    </Box>
                </Stack>
                <Box className="flex-1 overflow-hidden">
                    {categoryList?.length || categoryListIsFetching ? (
                        <>
                            <Box
                                className="h-full flex"
                                sx={{
                                    gap: 2.5,
                                    pb: 2.5,
                                }}
                            >
                                <Box className="h-full" sx={{ width: "300px" }}>
                                    <BorderedBox className="h-full flex flex-col">
                                        <Box
                                            className="flex justify-between items-center"
                                            sx={{ py: 2.25, px: 1.5 }}
                                        >
                                            <Typography
                                                variant="large"
                                                className="font-semibold"
                                            >
                                                Categories
                                            </Typography>
                                            <BorderedBox>
                                                <Button
                                                    variant="text"
                                                    className="uppercase text-[12px] font-semibold"
                                                    onClick={toggleDrawer}
                                                    sx={{ p: 1.25 }}
                                                >
                                                    Create New
                                                </Button>
                                            </BorderedBox>
                                        </Box>
                                        <Divider />
                                        <Box className="flex-1 overflow-hidden">
                                            <TemplateCategoryList
                                                setIsOpen={setIsOpen}
                                            />
                                        </Box>
                                    </BorderedBox>
                                </Box>

                                <Box className="h-full flex-1">
                                    <ParameterListView />
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <div className="h-full flex flex-col justify-center items-center">
                            <AuditSettingsEmptySate type="category" />
                            <Button
                                className="uppercase"
                                onClick={toggleDrawer}
                                variant="global"
                                sx={{ mt: 2 }}
                            >
                                Create Category
                            </Button>
                        </div>
                    )}
                </Box>
                <CreateEditCategoryForm
                    {...{ handleClose, isOpen, setIsOpen }}
                />
            </CategoreyStateProvider>
        </Box>
    );
}
