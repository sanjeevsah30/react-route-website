import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Result, Button } from "antd";
export default function NotFound(props) {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Oh Snap!</title>
            </Helmet>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link to={props.backLink}>
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </>
    );
}
