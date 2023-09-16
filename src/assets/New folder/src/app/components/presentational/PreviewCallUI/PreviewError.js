import React from "react";
import { Layout } from "antd";
import { Logo } from "@presentational/reusables";
const { Header, Content } = Layout;
export default function PreviewError({ title }) {
    return (
        <Layout className={"preview"}>
            <Header className={"preview_header"}>
                <a
                    href="https://convin.ai"
                    className="user-auth-bottom-nav-link"
                >
                    <Logo logoWhite={true} />
                </a>
            </Header>
            <Content className={"preview_errorContent"}>
                <div className="flex1">
                    <p className="font32 bolder margin0 lineHightN">{title}</p>
                    <p className="ghostColor font24">
                        Meanwhile, you can explore more about us.
                    </p>
                    <div className="flex alignCenter marginT30">
                        <a
                            href="https://convin.ai"
                            className="ant-btn ant-btn-primary preview_errorContent--btn"
                        >
                            GO TO HOMEPAGE
                        </a>
                        <a
                            href="https://convin.ai/blog"
                            className="ant-btn preview_errorContent--btnHollow"
                        >
                            READ OUR BLOGS
                        </a>
                    </div>
                </div>
                <div className="flex1 preview_errorContent--img">
                    <img
                        src={
                            require("../../../static/images/broken.png").default
                        }
                        alt="error"
                    />
                </div>
            </Content>
        </Layout>
    );
}
