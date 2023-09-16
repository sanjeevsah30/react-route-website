import { styled } from "@mui/material";

interface StepContentProps {
    title: string;
    description: string;
    content: JSX.Element;
    additionalTitle?: string;
    additionalContent?: JSX.Element;
}

const StepContentContainer = styled("div")({
    marginLeft: "1rem",
    marginTop: "0.5rem",
    overflow: "scroll",
    paddingRight: "2rem",
    flexGrow: 1,
    "& .step_content": {
        "&_header": {
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "spaceBetween",
            alignItems: "center",
            "&_additional": {
                height: "2.5rem",
                width: "7rem",
                backgroundColor: "#1a62f233",
                color: "#1a62f2",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1rem",
                fontWeight: "600",
            },
        },
        "&_title": {
            fontSize: "18px",
            fontWeight: "700",
            color: "#333",
            display: "block",
        },
        "&_description": {
            fontSize: "14px",
            color: "#666",
        },
    },
});
const StepContent = ({
    title,
    description,
    content,
    additionalTitle,
    additionalContent,
}: StepContentProps) => {
    return (
        <StepContentContainer>
            <div className="step_content_header">
                <div>
                    <span className="step_content_title">
                        {title}
                        {additionalTitle ? (
                            <span>
                                {" "}
                                -{" "}
                                <span style={{ color: "#666" }}>
                                    {additionalTitle}
                                </span>
                            </span>
                        ) : null}
                    </span>
                    <span className="step_content_description">
                        {description}
                    </span>
                </div>
                {additionalContent ? (
                    <div className="step_content_header_additional">
                        {additionalContent}
                    </div>
                ) : null}
            </div>
            {content}
        </StepContentContainer>
    );
};

export default StepContent;
