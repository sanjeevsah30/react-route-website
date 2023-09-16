import { Box, Skeleton } from "@mui/material";
import { uid } from "@convin/utils/UniqueId";
import { ReactElement } from "react";

interface CustomSkeletonProps {
    rows: number;
}

export default function CustomSkeleton({
    rows,
}: CustomSkeletonProps): ReactElement {
    return (
        <Box className="w-full">
            {new Array(rows).fill(0).map(() => (
                <Skeleton key={uid()} animation="wave" sx={{ width: "100%" }} />
            ))}
        </Box>
    );
}
