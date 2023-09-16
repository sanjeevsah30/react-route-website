import { Label } from "@convin/components/custom_components/Typography/Label";
import { Box, Typography } from "@mui/material";
import React from "react";

type Format = {
    text: string | React.ReactElement;
    subtext?: string;
    Component: React.ReactElement;
};

export default function EmptyState({
    text,
    subtext,
    Component,
}: Format): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center">
            {Component}
            <Box className="w-[330px] text-center leading-6">
                <Typography variant="large" className="font-bold">
                    {text}
                </Typography>
                <Label colorType="666" variant="medium">
                    {subtext}
                </Label>
            </Box>
        </div>
    );
}
