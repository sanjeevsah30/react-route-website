import { Button, Result } from "antd";
import React from "react";
import { connect } from "react-redux";
import ErrorStackParser from "error-stack-parser";
import StackTraceGPS from "stacktrace-gps";

class ErrorCollector extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null, hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        let stackframes = ErrorStackParser.parse(error);
        let gps = new StackTraceGPS();
        gps.pinpoint(stackframes[0]).then(
            (info) => {
                this.setState({
                    error: error,
                    errorInfo: errorInfo,
                });
                let data = {
                    [0 - Date.now()]: {
                        error: error.toString(),
                        errorInfo: errorInfo,
                        module: this.props?.module || "",
                        time: Date.now(),
                        columnNumber: info.columnNumber,
                        fileName: info.fileName,
                        functionName: info.functionName,
                        lineNumber: info.lineNumber,
                    },
                };
            },
            (err) => {
                console.log(err);
            }
        );
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
                <Result
                    status="500"
                    title="500"
                    subTitle="Sorry, something went wrong. Our team has been notified."
                    extra={
                        <Button
                            type="primary"
                            shape="round"
                            onClick={() => window.location.reload()}
                        >
                            Reload
                        </Button>
                    }
                />
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}
function mapStateToProps(state) {
    const { common } = state;
    return { domain: common.domain };
}
export default connect(mapStateToProps)(ErrorCollector);
