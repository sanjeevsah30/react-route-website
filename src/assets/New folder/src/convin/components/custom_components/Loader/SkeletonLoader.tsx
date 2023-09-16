import { Box, Skeleton } from "@mui/material";
import { ReactElement } from "react";

export default function SkeletonLoader(): ReactElement {
    return (
        <Box className="flex flex-col" sx={{ px: 2 }}>
            {new Array(6).fill(0).map((_, idx) => (
                <Box sx={{ py: 1 }} key={idx}>
                    <Skeleton animation="wave" />
                </Box>
            ))}
        </Box>
    );
}
