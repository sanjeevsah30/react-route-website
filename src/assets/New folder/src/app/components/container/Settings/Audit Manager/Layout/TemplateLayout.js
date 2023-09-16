import TopbarConfig from "@constants/Topbar/index";
import Icon from "@presentational/reusables/Icon";
import React from "react";
import "./templateLayout.scss";
import { Input, Layout } from "antd";
import { Drawer, Button, Checkbox } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Header, Footer, Sider, Content } = Layout;

/*header name is a react node*/

function TemplateLayout({
    goBack,
    save,
    name,
    children,
    tab,
    save_text,
    show_header_btn,
    header_btn_text,
    header_btn_click,
    showFooter,
    showBackBtn,
    headerChildren,
    headerName,
}) {
    const versionData = useSelector((state) => state.common.versionData);

    return (
        <>
            <header className="bgWhite borderBottomBold header flexShrink">
                <div className="flex alignCenter justifySpaceBetween padding24">
                    <div className="bold font18 name flex">
                        {showBackBtn && (
                            <div
                                onClick={goBack}
                                className={"curPoint marginR10"}
                            >
                                <Icon className={TopbarConfig.BACKICON} />
                            </div>
                        )}
                        {/* {headerName || name ||
                        versionData?.domain_type !== 'b2c'
                            ? 'CREATE A CALL SCORECARD  TEMPLATE'
                            : 'CREATE A CALL AUDIT TEMPLATE'} */}
                        {name}
                    </div>
                    <div>
                        {show_header_btn && (
                            <Button type="primary" onClick={header_btn_click}>
                                {header_btn_text}
                            </Button>
                        )}
                        {headerChildren}
                    </div>
                </div>
            </header>
            <Layout className="bgWhite paddingLR24 flex1 overflowYscroll">
                {children}
            </Layout>
            {showFooter && (
                <Footer className="create__template__footer flex row-reverse flexShrink">
                    <Button type="primary" onClick={save}>
                        {save_text}
                    </Button>
                </Footer>
            )}
        </>
    );
}

TemplateLayout.defaultProps = {
    header_btn_text: "",
    header_btn_click: () => {},
    showFooter: false,
    showBackBtn: true,
    show_header_btn: false,
    headerChildren: <></>,
};

export default TemplateLayout;
