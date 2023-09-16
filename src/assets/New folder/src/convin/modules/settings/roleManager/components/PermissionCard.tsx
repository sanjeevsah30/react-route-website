import { useState } from "react";
import {
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import { Label } from "@convin/components/custom_components/Typography/Label";
import { CodeNames } from "@convin/type/Role";
import { SettingsAccordion } from "@convin/components/custom_components/Accordian/SettingsAccordian";
import ChevronDownSvg from "@convin/components/svg/ChevronDownSvg";
import { AntSwitch } from "@convin/components/custom_components/Switch/AntSwitch";

type Props = CodeNames & {
    constructCodeNames: ({
        heading,
        prevSelectedKey,
        currSelectedKey,
    }: {
        heading: CodeNames["heading"];
        prevSelectedKey: string | undefined;
        currSelectedKey: string;
    }) => void;
    handleVisibilityChange: ({
        heading,
        isVisible,
    }: {
        heading: CodeNames["heading"];
        isVisible: boolean;
    }) => void;
    constructCodeNamesEdit: ({
        heading,
        display_name,
        currSelectedKey,
        checked,
        type,
    }: {
        heading: CodeNames["heading"];
        display_name: string;
        currSelectedKey: string;
        checked: boolean;
        type: "edit" | "delete";
    }) => void;
};

function PermissionCard({
    heading,
    is_switch,
    is_visible,
    permissions,
    constructCodeNames,
    constructCodeNamesEdit,
    handleVisibilityChange,
}: Props): JSX.Element {
    const isViewAccessOnly: boolean = Object.keys(permissions)?.length === 1;
    const [radioType, setRadioType] = useState<string | null>(
        Object.keys(permissions)?.find(
            (e) => isViewAccessOnly || permissions[e]?.view?.is_selected
        ) ?? null
    );
    const showArrow = isViewAccessOnly
        ? radioType !== null &&
          (permissions?.[radioType]?.edit?.length > 0 ||
              permissions?.[radioType]?.delete?.length > 0)
        : !isViewAccessOnly;

    return (
        <SettingsAccordion sx={{ my: 2 }}>
            <AccordionSummary
                expandIcon={showArrow ? <ChevronDownSvg /> : null}
                sx={{ p: 0, ml: 2.5, mr: showArrow ? 2.5 : 4.5 }}
            >
                <Box
                    className="flex items-center justify-between flex-1"
                    sx={{ mr: 2 }}
                >
                    <Typography>{heading}</Typography>
                    {is_switch && (
                        <Box
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <AntSwitch
                                checked={is_visible}
                                onChange={(e) => {
                                    handleVisibilityChange({
                                        heading,
                                        isVisible: e.target.checked,
                                    });
                                }}
                                data-testid={`permission-switch-${heading
                                    .split(" ")
                                    .join("-")}`}
                            />
                        </Box>
                    )}
                </Box>
            </AccordionSummary>
            {showArrow && (
                <AccordionDetails>
                    {!isViewAccessOnly && (
                        <div className="flex items-center">
                            <Label
                                variant="medium"
                                colorType="999"
                                className="w-[150px]"
                            >
                                Can Access
                            </Label>
                            <FormControl>
                                <RadioGroup
                                    row
                                    onChange={(e) => {
                                        setRadioType(e.target.value);
                                        constructCodeNames({
                                            heading,
                                            currSelectedKey: e.target.value,
                                            prevSelectedKey: Object.keys(
                                                permissions
                                            )?.find(
                                                (key) =>
                                                    permissions[key]?.view
                                                        ?.is_selected
                                            ),
                                        });
                                    }}
                                    value={
                                        Object.keys(permissions)?.find(
                                            (e) =>
                                                permissions[e]?.view
                                                    ?.is_selected
                                        ) || null
                                    }
                                >
                                    {Object.keys(permissions).map((key) => (
                                        <FormControlLabel
                                            key={key}
                                            value={key}
                                            control={<Radio />}
                                            label={
                                                <Typography variant="medium">
                                                    {key}
                                                </Typography>
                                            }
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    )}
                    {radioType &&
                        (!!permissions?.[radioType]?.edit?.length ||
                            !!permissions?.[radioType]?.delete?.length) && (
                            <>
                                <div className="flex items-center">
                                    <Label
                                        variant="medium"
                                        colorType="999"
                                        className="w-[150px]"
                                    >
                                        Grant
                                    </Label>
                                    <FormGroup className="flex flex-1 flex-row">
                                        {permissions[radioType]?.edit?.map(
                                            ({ display_name, is_selected }) => (
                                                <FormControlLabel
                                                    key={display_name}
                                                    control={
                                                        <Checkbox
                                                            checked={
                                                                is_selected
                                                            }
                                                            onChange={(event) =>
                                                                constructCodeNamesEdit(
                                                                    {
                                                                        heading,
                                                                        display_name,
                                                                        currSelectedKey:
                                                                            radioType,
                                                                        checked:
                                                                            event
                                                                                .target
                                                                                .checked,
                                                                        type: "edit",
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="medium">
                                                            {display_name}
                                                        </Typography>
                                                    }
                                                />
                                            )
                                        )}
                                    </FormGroup>
                                </div>
                                <div className="flex items-center">
                                    <FormGroup className="flex flex-1 flex-row pl-[150px]">
                                        {permissions[radioType]?.delete?.map(
                                            ({ display_name, is_selected }) => (
                                                <FormControlLabel
                                                    key={display_name}
                                                    control={
                                                        <Checkbox
                                                            checked={
                                                                is_selected
                                                            }
                                                            onChange={(event) =>
                                                                constructCodeNamesEdit(
                                                                    {
                                                                        heading,
                                                                        display_name,
                                                                        currSelectedKey:
                                                                            radioType,
                                                                        checked:
                                                                            event
                                                                                .target
                                                                                .checked,
                                                                        type: "delete",
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="medium">
                                                            {display_name}
                                                        </Typography>
                                                    }
                                                />
                                            )
                                        )}
                                    </FormGroup>
                                </div>
                            </>
                        )}
                </AccordionDetails>
            )}
        </SettingsAccordion>
    );
}

export default PermissionCard;
