import { AntSwitch } from "@convin/components/custom_components/Switch/AntSwitch";
import { EditSvg } from "@convin/components/svg";
import { useCreateQmsFieldMutation } from "@convin/redux/services/settings/qms.service";
import { Box, Checkbox, Divider, Typography } from "@mui/material";
import { QmsField } from "../context/QmsStateContext";
import useQmsStateContext from "../hooks/useQmsStateContext";

const QmsFieldComponent = ({
    field,
    setOpenModal,
}: {
    field: QmsField;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        id,
        name,
        card_type,
        is_disabled,
        is_mandatory,
        auditor,
        is_customizable,
        metadata,
        type,
    } = field;
    const { prepareQmsStateForUpdate, handleUpdate } = useQmsStateContext();
    return (
        <Box
            className="shaduseQmsStateContextow-[0px_4px_10px_#3333331A] rounded-md border-[1px] border-solid border-[#99999933]"
            sx={{ background: "#fff" }}
        >
            <div>
                <div className="h-16 flex justify-between items-center pl-4 pr-6">
                    <span
                        className={`font-semibold text-base text-[${
                            is_customizable ? "#333" : "#33333333"
                        }]`}
                    >
                        {name}
                    </span>

                    <div className="flex items-center">
                        {is_customizable && card_type === "custom" ? (
                            <span
                                onClick={() => {
                                    prepareQmsStateForUpdate({
                                        id,
                                        name,
                                        card_type,
                                        is_disabled,
                                        is_mandatory,
                                        metadata,
                                        auditor,
                                        type,
                                    });
                                    setOpenModal(true);
                                }}
                            >
                                <EditSvg
                                    sx={{
                                        cursor: "pointer",
                                        transform: "scale(1.25)",
                                        marginRight: "2rem",
                                    }}
                                />
                            </span>
                        ) : null}
                        <AntSwitch
                            checked={!is_disabled}
                            disabled={!is_customizable}
                            onChange={(e) => {
                                handleUpdate({
                                    id,
                                    name,
                                    card_type,
                                    is_disabled: !e.target.checked,
                                    is_mandatory,
                                    auditor,
                                    metadata,
                                    is_customizable,
                                    type,
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
            {is_customizable && card_type === "default" ? (
                <>
                    <Divider />
                    <Box className="mandatory-checkbox flex justify-between items-center pl-4 pr-6">
                        <Box>
                            <Typography
                                variant="medium"
                                component="span"
                                sx={{ color: "grey.999" }}
                            >
                                Make this field Mandatory
                            </Typography>
                        </Box>
                        <Checkbox
                            name="required"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                handleUpdate({
                                    id,
                                    name,
                                    card_type,
                                    is_disabled,
                                    is_mandatory: e.target.checked,
                                    auditor,
                                    metadata,
                                    is_customizable,
                                    type,
                                })
                            }
                            checked={is_mandatory}
                        />
                    </Box>
                </>
            ) : (
                <></>
            )}
        </Box>
    );
};

export default QmsFieldComponent;
