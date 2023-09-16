import BorderedBox from "@convin/components/custom_components/BorderedBox";
import { AntSwitch } from "@convin/components/custom_components/Switch/AntSwitch";
import { Label } from "@convin/components/custom_components/Typography/Label";
import {
    useGetCategoryQuery,
    useGetParameterByCategoryIdQuery,
    useUpdateParameterSequenceMutation,
} from "@convin/redux/services/settings/auditManager.service";
import {
    getQuetionTypeLabel,
    isDefined,
} from "@convin/utils/helper/common.helper";
import {
    Box,
    Button,
    Divider,
    Grid,
    alpha,
    useTheme,
    Stack,
    FormControlLabel,
    Checkbox,
    SxProps,
    Theme,
} from "@mui/material";
import { Dispatch, ReactNode, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateEditParameterForm from "./CreateEditParameterForm";
import ParameterStateProvider from "../context/ParameterStateContext";
import useParameterStateContext from "../hooks/useParameterStateContext";
import { Question } from "@convin/type/Audit";
import SkeletonLoader from "@convin/components/custom_components/Loader/SkeletonLoader";
import AuditSettingsEmptySate from "../common/AuditSettingsEmptySate";
import { EditSvg } from "@convin/components/svg";
import LiveAssistAliasDialog from "../common/LiveAssistAliasDialog";
import { liveAssistAlisCharLimit } from "@convin/config/audit.config";
import {
    SortableElement as sortableElement,
    SortableElementProps,
    SortableContainer as sortableContainer,
    SortableContainerProps,
    arrayMove,
} from "react-sortable-hoc";

const SortableContainer: React.ComponentClass<
    SortableContainerProps & { children: ReactNode }
> = sortableContainer(({ children }: { children: ReactNode }) => {
    return (
        <Stack spacing={1.5} className="flex-1">
            {children}
        </Stack>
    );
});
export default function ParameterListView(): JSX.Element {
    const theme = useTheme();
    const { category_id } = useParams<{
        category_id: string;
        template_id: string;
    }>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isAliasDialogOpen, setIsAliasDialogOpen] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);

    const { data: category } = useGetCategoryQuery(+category_id, {
        skip: !isDefined(category_id),
    });
    const { data: parameterList, isFetching: parameterListIsFetching } =
        useGetParameterByCategoryIdQuery(+category_id, {
            skip: !isDefined(category_id),
        });
    const [updateParameterSequence] = useUpdateParameterSequenceMutation();

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

    useEffect(() => {
        if (parameterList?.length) {
            setQuestions(parameterList);
        }
    }, [parameterList]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const SortableItem: React.ComponentClass<
        SortableElementProps & { value: PropType }
    > = sortableElement(({ value }: { value: PropType }) => {
        return (
            <ParameterCard
                {...value}
                sx={{ cursor: parameterListIsFetching ? "progress" : "grab" }}
            />
        );
    });

    return (
        <ParameterStateProvider>
            {parameterListIsFetching ? (
                <SkeletonLoader />
            ) : parameterList?.length ? (
                <BorderedBox className="h-full flex flex-col">
                    <Box
                        className="flex justify-between items-center"
                        sx={{ py: 2.25, px: 1.5 }}
                    >
                        <Box className="flex items-center flex-1 gap-2">
                            <Box
                                sx={{
                                    width: "auto",
                                    maxWidth: "300px",
                                }}
                            >
                                <Label
                                    className="font-semibold"
                                    colorType="333"
                                    isEllipses
                                >
                                    {category?.name}
                                </Label>
                            </Box>

                            <Box
                                sx={{
                                    background: "#C4C4C4",
                                    height: "6px",
                                    width: "6px",
                                    borderRadius: "50%",
                                }}
                                className="flex-shrink-0"
                            />

                            <Label colorType="999" isEllipses>
                                {parameterList?.length || 0} Questions Available
                            </Label>
                        </Box>
                        <BorderedBox className="flex-shrink-0">
                            <Button
                                variant="text"
                                className="uppercase text-[12px] font-bold"
                                onClick={toggleDrawer}
                                sx={{ p: 1.25 }}
                            >
                                Add Question
                            </Button>
                        </BorderedBox>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            px: 2,
                            mt: 2,
                        }}
                        className="flex flex-col flex-1 overflow-scroll"
                    >
                        <Grid
                            container
                            sx={{
                                color: "grey.666",
                                fontSize: "10px",
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                py: 1,
                                px: 2,
                                borderRadius: 1.5,
                                mb: 2,
                            }}
                            className="flex-shrink-0 uppercase"
                        >
                            <Grid item xs={4}>
                                Parameters
                            </Grid>
                            <Grid item xs={2} className="text-center">
                                Response Type
                            </Grid>
                            <Grid item xs={2} className="text-center">
                                Violations
                            </Grid>
                            <Grid item xs={2} className="text-center">
                                Agent Assist
                            </Grid>
                            <Grid item xs={2} className="text-center">
                                Action
                            </Grid>
                        </Grid>
                        <SortableContainer
                            onSortEnd={({ oldIndex, newIndex }) => {
                                if (oldIndex !== newIndex) {
                                    const newList = arrayMove(
                                        parameterList,
                                        oldIndex,
                                        newIndex
                                    );
                                    setQuestions(newList);
                                    updateParameterSequence({
                                        questions_data: newList.map(
                                            ({ id }, index) => {
                                                return { seq_no: index, id };
                                            }
                                        ),
                                    });
                                }
                            }}
                            axis="xy"
                        >
                            {questions?.map((e, index) => {
                                return (
                                    <SortableItem
                                        key={e.id}
                                        index={index}
                                        value={{
                                            ...e,
                                            setIsOpen,
                                            setIsAliasDialogOpen,
                                        }}
                                        disabled={parameterListIsFetching}
                                    />
                                );
                            })}
                        </SortableContainer>
                    </Box>
                </BorderedBox>
            ) : (
                <div className="h-full flex flex-col justify-center items-center">
                    <AuditSettingsEmptySate type="parameter" />
                    <Button
                        className="uppercase"
                        onClick={toggleDrawer}
                        variant="global"
                        sx={{ mt: 2 }}
                    >
                        ADD PARAMETERS
                    </Button>
                </div>
            )}
            <CreateEditParameterForm {...{ handleClose, isOpen }} />
            <LiveAssistAliasDialog
                open={isAliasDialogOpen}
                onClose={() => {
                    setIsAliasDialogOpen(false);
                }}
            />
        </ParameterStateProvider>
    );
}

type PropType = Question & {
    setIsOpen: Dispatch<boolean>;
    setIsAliasDialogOpen: Dispatch<boolean>;
    sx?: SxProps<Theme>;
};

const ParameterCard = (
    props: Pick<PropType, "setIsOpen" | "setIsAliasDialogOpen" | "sx"> &
        PropType
): JSX.Element => {
    const { setIsOpen, setIsAliasDialogOpen, sx, ...question } = props;
    const { prepareParameterStateForUpdate } = useParameterStateContext();
    const { handleUpdate } = useParameterStateContext();
    return (
        <BorderedBox key={question.id} sx={{ p: 2, ...sx }}>
            <Grid container>
                <Grid item xs={4} className="flex items-center">
                    <Label variant="medium" isEllipses colorType="333">
                        {question.question_text}
                    </Label>
                </Grid>
                <Grid item xs={2} className="flex items-center justify-center">
                    <Label variant="medium" isEllipses colorType="333">
                        {getQuetionTypeLabel(question.question_type)}
                    </Label>
                </Grid>
                <Grid item xs={2} className="flex items-center justify-center">
                    <Label variant="medium" isEllipses colorType="333">
                        {question.applicable_violation?.[0]?.name}
                    </Label>
                </Grid>
                <Grid item xs={2} className="flex items-center justify-center">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={Boolean(question.is_live_assist)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                onChange={(e) => {
                                    if (
                                        question.question_text.length >
                                            liveAssistAlisCharLimit &&
                                        question.live_assist_alias.length === 0
                                    ) {
                                        prepareParameterStateForUpdate(
                                            question
                                        );
                                        setIsAliasDialogOpen(true);
                                    } else
                                        handleUpdate({
                                            id: question.id,
                                            category: question.category.id,
                                            is_live_assist: e.target.checked,
                                        });
                                }}
                            />
                        }
                        label={<></>}
                    />
                </Grid>
                <Grid item xs={2} className="flex items-center justify-center">
                    <Box className="flex items-center gap-10">
                        <AntSwitch
                            checked={!question.is_disabled}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            onChange={(e) => {
                                handleUpdate({
                                    id: question.id,
                                    category: question.category.id,
                                    is_disabled: !e.target.checked,
                                });
                            }}
                        />
                        <Box className="relative flex items-center">
                            <button
                                className="cursor-pointer relative h-[30px] w-[10px] z-10 p-0"
                                onClick={() => {
                                    prepareParameterStateForUpdate(question);
                                    setIsOpen(true);
                                }}
                            />
                            <EditSvg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1" />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </BorderedBox>
    );
};
