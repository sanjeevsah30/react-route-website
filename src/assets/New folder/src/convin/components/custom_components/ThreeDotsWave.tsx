import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";

const loadingContainerVariants = {
    start: {
        transition: {
            staggerChildren: 0.2,
        },
    },
    end: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const loadingCircleVariants = {
    start: {
        y: "50%",
    },
    end: {
        y: "150%",
    },
};

const loadingCircleTransition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: "easeInOut",
};

function LoadingDot(): ReactElement {
    return (
        <Box
            component={motion.span}
            className="w-2 h-2"
            sx={{ borderRadius: "0.25rem", backgroundColor: "primary.main" }}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
        />
    );
}

export default function ThreeDotsWave(): ReactElement {
    return (
        <Box
            component={motion.div}
            className="flex justify-around w-10 h-8 m-auto"
            variants={loadingContainerVariants}
            initial="start"
            animate="end"
            sx={{}}
        >
            <LoadingDot />
            <LoadingDot />
            <LoadingDot />
        </Box>
    );
}
