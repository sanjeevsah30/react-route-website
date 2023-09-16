import BorderedBox from "@convin/components/custom_components/BorderedBox";
import { AntSwitch } from "@convin/components/custom_components/Switch/AntSwitch";
import { Label } from "@convin/components/custom_components/Typography/Label";
import DragComponentSvg from "@convin/components/svg/DragComponentSvg";
import { SettingRoutes } from "@convin/config/routes.config";
import {
    useGetCategoriesByTemplateIdQuery,
    useUpdateCategoryMutation,
    useUpdateCategorySequenceMutation,
} from "@convin/redux/services/settings/auditManager.service";
import { isDefined } from "@convin/utils/helper/common.helper";
import { Box, Stack } from "@mui/material";
import { Dispatch, ReactNode, useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useCategoryStateContext from "../hooks/useCategoryStateContext";
import SkeletonLoader from "@convin/components/custom_components/Loader/SkeletonLoader";
import { Category } from "@convin/type/Audit";
import { EditSvg } from "@convin/components/svg";
import {
    arrayMove,
    SortableContainer as sortableContainer,
    SortableContainerProps,
    SortableElement as sortableElement,
    SortableElementProps,
    SortableHandle as sortableHandle,
} from "react-sortable-hoc";

const SortableContainer: React.ComponentClass<
    SortableContainerProps & { children: ReactNode }
> = sortableContainer(({ children }: { children: ReactNode }) => {
    return (
        <Stack spacing={2} className="h-full overflow-scroll" sx={{ p: 1.5 }}>
            {children}
        </Stack>
    );
});

export default function TemplateCategoryList({
    setIsOpen,
}: {
    setIsOpen: Dispatch<boolean>;
}): JSX.Element {
    const { template_id, category_id } = useParams<{
        template_id: string;
        category_id: string;
    }>();
    const history = useHistory();
    const [categories, setCategories] = useState<Category[]>([]);

    const { dispatch } = useCategoryStateContext();

    const { data, isFetching } = useGetCategoriesByTemplateIdQuery(
        +template_id,
        {
            skip: !isDefined(template_id),
        }
    );
    const [updateCategory] = useUpdateCategoryMutation();
    const [updateCategorySequence] = useUpdateCategorySequenceMutation();

    useEffect(() => {
        if (data?.length) {
            const id =
                data.find((category) => category.id === +category_id)?.id ||
                data[0].id;
            history.push(
                `/settings/${SettingRoutes.AUDIT_MANAGER.path}/${template_id}/category/${id}`
            );
            setCategories(data);
        }
    }, [data]);

    const handleUpdate = useCallback(
        ({ id, is_disabled, template }: Category): void => {
            updateCategory({
                id,
                is_disabled,
                template: template?.id,
            });
        },
        []
    );

    const DragHandle = sortableHandle(() => (
        <DragComponentSvg
            sx={{ cursor: isFetching ? "progress" : "grab", width: 20 }}
        />
    ));

    const SortableItem: React.ComponentClass<
        SortableElementProps & { value: Category }
    > = sortableElement(({ value: category }: { value: Category }) => {
        return (
            <BorderedBox
                className="cursor-pointer"
                key={category.id}
                sx={{
                    p: 1.5,
                    ...(category.id === +category_id && {
                        borderColor: "primary.main",
                    }),
                }}
                onClick={() =>
                    history.push(
                        `/settings/${SettingRoutes.AUDIT_MANAGER.path}/${category.template.id}/category/${category.id}`
                    )
                }
            >
                <Stack spacing={1.2}>
                    <Box className="flex justify-between items-center">
                        <Label
                            className="font-semibold"
                            colorType="333"
                            isEllipses
                        >
                            {category.name}
                        </Label>

                        <Box
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch({
                                    type: "UPDATE",
                                    payload: category,
                                });
                                setIsOpen(true);
                            }}
                        >
                            <EditSvg />
                        </Box>
                    </Box>

                    <Label variant="small" colorType="999">
                        {category.description}
                    </Label>
                    <Box className="flex justify-between">
                        <AntSwitch
                            checked={!category.is_disabled}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            onChange={(e) => {
                                handleUpdate({
                                    ...category,
                                    is_disabled: !e.target.checked,
                                });
                            }}
                        />
                        <DragHandle />
                    </Box>
                </Stack>
            </BorderedBox>
        );
    });

    return (
        <SortableContainer
            useDragHandle
            onSortEnd={({ oldIndex, newIndex }) => {
                if (data) {
                    const newList = arrayMove(data, oldIndex, newIndex);
                    setCategories(newList);
                    updateCategorySequence({
                        categories_data: newList.map(({ id }, index) => {
                            return {
                                seq_no: index,
                                id,
                            };
                        }),
                    });
                }
            }}
        >
            {isFetching && !data?.length ? (
                <SkeletonLoader />
            ) : (
                categories?.map((category, index) => (
                    <SortableItem
                        key={category.id}
                        index={index}
                        value={category}
                        disabled={isFetching}
                    />
                ))
            )}
        </SortableContainer>
    );
}
