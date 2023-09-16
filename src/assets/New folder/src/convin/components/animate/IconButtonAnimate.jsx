// import { motion } from 'framer-motion';
import { forwardRef, ReactElement, ReactNode } from "react";
// @mui
import { Box, IconButton, IconButtonProps } from "@mui/material";

// ----------------------------------------------------------------------

const varSmall = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
};

const varMedium = {
    hover: { scale: 1.09 },
    tap: { scale: 0.97 },
};

const varLarge = {
    hover: { scale: 1.08 },
    tap: { scale: 0.99 },
};

function AnimateWrap({ size, children }) {
    const isSmall = size === "small";
    const isLarge = size === "large";

    return (
        <Box
            component="div"
            sx={{
                display: "inline-flex",
            }}
        >
            {children}
        </Box>
    );
}

AnimateWrap.defaultProps = {
    size: "medium",
};

const IconButtonAnimate = forwardRef(
    ({ children, size = "medium", ...other }, ref) => (
        <AnimateWrap size={size}>
            <IconButton size={size} ref={ref} {...other}>
                {children}
            </IconButton>
        </AnimateWrap>
    )
);

IconButtonAnimate.defaultProps = {
    color: "default",
    size: "medium",
};

export default IconButtonAnimate;

// ----------------------------------------------------------------------
