import { CircularProgress, Backdrop } from "@mui/material";
import { ReactElement } from "react";

export default function PageLoader(): ReactElement {
    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                position: "absolute",
            }}
            open
            data-testid="page-loader"
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
