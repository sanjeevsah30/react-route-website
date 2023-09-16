import { CloseSvg } from "@convin/components/svg";
import { Box, Typography, Divider, Drawer } from "@mui/material";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, RHFTextField } from "@convin/components/hook-form";
import { Label } from "@convin/components/custom_components/Typography/Label";
import { LoadingButton } from "@mui/lab";
import {
    useCreateCategoryMutation,
    useGetCategoriesByTemplateIdQuery,
    useUpdateCategoryMutation,
} from "@convin/redux/services/settings/auditManager.service";
import { useParams } from "react-router-dom";
import { showToast } from "@convin/utils/toast";
import useCategoryStateContext from "../hooks/useCategoryStateContext";
import { Dispatch } from "react";
import { isDefined } from "@convin/utils/helper/common.helper";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";

type Props = {
    handleClose: () => void;
    isOpen: boolean;
    setIsOpen: Dispatch<boolean>;
};

export default function CreateEditCategoryForm({
    handleClose,
    isOpen,
    setIsOpen,
}: Props): JSX.Element {
    const { template_id } = useParams<{ template_id: string }>();
    const { data: categoryList } = useGetCategoriesByTemplateIdQuery(
        +template_id,
        {
            skip: !isDefined(template_id),
        }
    );
    const [createCategory, { isLoading: isCreating }] =
        useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] =
        useUpdateCategoryMutation();

    const { state, dispatch } = useCategoryStateContext();
    const schema = Yup.object().shape({
        name: Yup.string().required("Category Name is required"),
    });
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: { name: "", description: "" },
        values: state,
    });
    const { handleSubmit } = methods;

    const onSubmit = async (data: typeof state) => {
        if (template_id)
            if (state.id) {
                updateCategory({
                    ...data,
                    template: +template_id,
                    id: state.id,
                })
                    .unwrap()
                    .then(() => {
                        dispatch({
                            type: "RESET",
                            payload: {},
                        });
                        handleClose();
                    });
            } else
                createCategory({
                    ...data,
                    template: +template_id,
                    seq_no: categoryList?.length,
                })
                    .unwrap()
                    .then(() => {
                        showToast({
                            message: "Category has been created",
                            ...CreateUpdateToastSettings,
                        });
                        dispatch({
                            type: "RESET",
                            payload: {},
                        });
                        handleClose();
                    });
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={() => {
                if (state.id) {
                    dispatch({
                        type: "RESET",
                        payload: {},
                    });
                }
                setIsOpen(false);
            }}
        >
            <Box className="w-[540px] flex flex-col h-full">
                <Box
                    sx={{ px: 2.5, py: 3 }}
                    className="flex items-center gap-[22px]"
                >
                    <Box
                        sx={{
                            color: "grey.666",
                        }}
                        className="cursor-pointer"
                        onClick={handleClose}
                    >
                        <CloseSvg />
                    </Box>
                    <Typography variant="extraLarge" className="font-semibold">
                        {Boolean(isDefined(state.id)) ? "Edit" : "Create"}{" "}
                        Category
                    </Typography>
                </Box>
                <Divider />
                <Box className="flex-1">
                    <FormProvider
                        methods={methods}
                        onSubmit={handleSubmit(onSubmit)}
                        className={"h-full flex flex-col"}
                    >
                        <Box sx={{ p: 2.5 }} className="flex-1">
                            <Label
                                colorType="666"
                                className="font-semibold"
                                sx={{ mb: 2 }}
                            >
                                Category
                            </Label>
                            <RHFTextField
                                name="name"
                                label="Category Name*"
                                variant="filled"
                                className="w-full"
                                sx={{ mb: 3 }}
                                value={state.name}
                                onChange={(
                                    e: React.ChangeEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                    >
                                ) =>
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            name: e.target.value,
                                        },
                                    })
                                }
                            />
                            <RHFTextField
                                name="description"
                                label="Description"
                                variant="filled"
                                className="w-full"
                                sx={{ mb: 3 }}
                                multiline
                                rows={4}
                                value={state.description}
                                onChange={(
                                    e: React.ChangeEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                    >
                                ) =>
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            description: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Box>

                        <Divider />
                        <Box
                            sx={{ px: 2.5, py: 3 }}
                            className="flex justify-center"
                        >
                            <LoadingButton
                                fullWidth
                                size="large"
                                type="submit"
                                variant="global"
                                loading={isCreating || isUpdating}
                                className="w-auto"
                            >
                                {isDefined(state.id) ? "UPDATE " : "CREATE "}
                                CATEGORY
                            </LoadingButton>
                        </Box>
                    </FormProvider>
                </Box>
            </Box>
        </Drawer>
    );
}
