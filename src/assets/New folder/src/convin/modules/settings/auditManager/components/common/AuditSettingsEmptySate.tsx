import { Label } from "@convin/components/custom_components/Typography/Label";
import EmptyCategoryListSvg from "@convin/components/svg/EmptyCategoryListSvg";
import EmptyParameterListSvg from "@convin/components/svg/EmptyParameterListSvg";
import EmptyTemplateListSvg from "@convin/components/svg/EmptyTemplateSvgList";
import { Box, Typography } from "@mui/material";

type Format = "template" | "category" | "parameter";

const config: Record<Format, { text: string; subText: string }> = {
    template: {
        text: "Create an Audit Template",
        subText: "Guide for audits. Structured framework to assess compliance.",
    },
    category: {
        text: "Add Categories to the Template",
        subText:
            "Organize your templates by creating custom categories for easy access and efficient workflow.",
    },
    parameter: {
        text: "Add Parameters to this Category",
        subText:
            "Refine your template organization by adding specific parameters to each category for streamlined and tailored results.",
    },
};

export default function AuditSettingsEmptySate({
    type,
}: {
    type: Format;
}): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center">
            {type === "template" ? (
                <EmptyTemplateListSvg />
            ) : type === "category" ? (
                <EmptyCategoryListSvg />
            ) : (
                <EmptyParameterListSvg />
            )}
            <Box className="w-[330px] text-center leading-6">
                <Typography variant="large" className="font-bold">
                    {config[type].text}
                </Typography>
                <Label colorType="666" variant="medium">
                    {config[type].subText}
                </Label>
            </Box>
        </div>
    );
}
