import ThreeDotsWave from "@convin/components/custom_components/ThreeDotsWave";
import { Box } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

interface TickCrossComponentProp {
    isLoading: boolean;
    handleDoneChange: () => void;
    handleCancelChange: () => void;
}

export default function MembersAction({
    isLoading,
    handleDoneChange,
    handleCancelChange,
}: TickCrossComponentProp): JSX.Element {
    return (
        <>
            <Box className="flex items-center justify-between w-[64px]">
                {isLoading ? (
                    <ThreeDotsWave />
                ) : (
                    <>
                        <DoneIcon
                            onClick={handleDoneChange}
                            className="cursor-pointer"
                            sx={{ color: "primary.main" }}
                        />
                        <CloseIcon
                            onClick={handleCancelChange}
                            className="cursor-pointer"
                            sx={{ color: "grey.666" }}
                        />
                    </>
                )}
            </Box>
        </>
    );
}
