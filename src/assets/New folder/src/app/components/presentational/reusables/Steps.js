import "./steps.scss";

const Steps = ({ items, current, alignment, setCurrent }) => {
    return (
        <div className="steps_container" alignment={alignment}>
            {items.map((item, idx) => (
                <div
                    className="step_button"
                    current={`${current === idx}`}
                    onClick={() => {
                        setCurrent(idx);
                    }}
                    key={idx}
                >
                    <div className="step_index">{idx + 1}</div>
                    <div className="step_title">{item}</div>
                </div>
            ))}
        </div>
    );
};

export default Steps;
