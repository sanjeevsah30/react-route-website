import React from "react";
import { TextField } from "@mui/material";

function GlobalSearchInput({
    value,
    onChange,
}: {
    value: string | undefined;
    onChange: (val: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
    return <TextField value={value} onChange={onChange} />;
}

export default GlobalSearchInput;
