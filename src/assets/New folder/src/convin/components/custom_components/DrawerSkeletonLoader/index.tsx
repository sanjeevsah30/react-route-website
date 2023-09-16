import { Box, Skeleton } from "@mui/material";
import { uniqueId } from "lodash";
import { ReactElement } from "react";

export default function DrawerSkeletonLoaders(): ReactElement {
    return (
        <Box className="flex flex-col h-[364px]" sx={{ px: 2 }}>
            {new Array(6).fill(0).map(() => (
                <Box sx={{ py: 2 }} key={uniqueId()}>
                    <Skeleton animation="wave" />
                </Box>
            ))}
        </Box>
    );
}
