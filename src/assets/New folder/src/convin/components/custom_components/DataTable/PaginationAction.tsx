import ArrowDownSvg from "@convin/components/svg/ArrowDownSvg";
import { alpha, IconButton, Theme, Typography, useTheme } from "@mui/material";

interface PaginationActionProps {
    page: number;
    totalPages: number;
    handleChangePage: (
        event: React.MouseEvent<unknown>,
        newPage: number
    ) => void;
}

export function PaginationAction(props: PaginationActionProps): JSX.Element {
    const { page, handleChangePage, totalPages } = props;
    const theme: Theme = useTheme();
    return (
        <>
            <IconButton
                disabled={page === 0}
                sx={{
                    border: "1px solid",
                    px: 1.2,
                    py: 2,
                    borderColor: page === 0 ? "grey.999_20" : "grey.666",
                    borderRadius: `${theme.shape.borderRadius}px`,
                }}
                onClick={(e) => handleChangePage(e, page - 1)}
            >
                <ArrowDownSvg
                    sx={{
                        transform: "rotateZ(90deg)",
                        color: page === 0 ? "grey.999" : "grey.333",
                    }}
                />
            </IconButton>
            <Typography
                sx={{
                    mx: 1.5,
                    px: 2,
                    py: 1,
                    borderRadius: `${theme.shape.borderRadius}px`,
                    border: "1px solid",
                    borderColor: "primary.main",
                    color: "primary.main",
                }}
                variant="columnHeading"
            >
                {page + 1}
            </Typography>
            <IconButton
                disabled={page === totalPages}
                sx={{
                    border: "1px solid",
                    borderColor: `${
                        page === totalPages ? alpha("#999", 0.2) : "#333"
                    }`,
                    color: "#333",
                    borderRadius: `${theme.shape.borderRadius}px`,
                    px: 1.2,
                    py: 2,
                }}
                onClick={(e) => handleChangePage(e, page + 1)}
            >
                <ArrowDownSvg
                    sx={{
                        transform: "rotateZ(270deg)",
                        color: page === totalPages ? "grey.999" : "grey.333",
                    }}
                />
            </IconButton>
        </>
    );
}
