import "./steps.scss";

const StepContent = ({
    title,
    description,
    form,
    additionalTitle,
    additionalContent,
}) => {
    return (
        <div className="step_content">
            <div className="step_content--header">
                <div>
                    <span className="step_content--title">
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
                    <span className="step_content--description">
                        {description}
                    </span>
                </div>
                {additionalContent ? (
                    <div className="step_content--header_additional">
                        {additionalContent}
                    </div>
                ) : null}
            </div>
            {form}
        </div>
    );
};

export default StepContent;
