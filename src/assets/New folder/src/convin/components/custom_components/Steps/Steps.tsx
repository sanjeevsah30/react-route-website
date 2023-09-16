import { Box, SxProps, Theme, styled } from "@mui/material";
import { alpha } from "@mui/system";
import { Dispatch, SetStateAction } from "react";

const StepsContainer = styled("div")({
    display: "flex",
    marginRight: "1rem",
    gap: "0.5rem",
});

const StepButton = styled("div")({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "0 0.75rem",
    gap: "1rem",
    width: "12rem",
    height: "3rem",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    border: "0.6px solid transparent",
});

const StepIndex = styled("div")({
    height: "30px",
    width: "30px",
    borderRadius: "50%",
    color: "#999",
    backgroundColor: "#9999991a",
    border: "1.3px solid #999",
    paddingTop: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

interface StepsProps {
    items: string[];
    current: number;
    setCurrent: Dispatch<SetStateAction<number>>;
    className?: string;
    sx?: SxProps<Theme>;
}

const Steps = ({ items, current, setCurrent, className, sx }: StepsProps) => {
    return (
        <StepsContainer
            className={`column ${className ? className : ""}`}
            sx={sx}
        >
            {items.map((item, idx) => (
                <StepButton
                    className={`${
                        current === idx
                            ? "border-[0.6px] border-solid rounded-md"
                            : ""
                    }`}
                    sx={
                        current === idx
                            ? {
                                  backgroundColor: (theme) =>
                                      alpha(theme.palette.primary.main, 0.1),
                                  borderColor: (theme) =>
                                      alpha(theme.palette.primary.main, 0.4),
                              }
                            : {}
                    }
                    onClick={() => {
                        setCurrent(idx);
                    }}
                    key={idx}
                >
                    <StepIndex
                        className={`${
                            current === idx ? "border-transparent" : ""
                        }`}
                        sx={
                            current === idx
                                ? {
                                      backgroundColor: (theme) =>
                                          theme.palette.primary.main,
                                      color: (theme) =>
                                          theme.palette.common.white,
                                  }
                                : {}
                        }
                    >
                        {idx + 1}
                    </StepIndex>
                    <Box
                        className="pt-[2px]"
                        sx={{
                            color: (theme) =>
                                current === idx
                                    ? theme.palette.primary.main
                                    : theme.palette.textColors[999],
                        }}
                    >
                        {item}
                    </Box>
                </StepButton>
            ))}
        </StepsContainer>
    );
};

export default Steps;
