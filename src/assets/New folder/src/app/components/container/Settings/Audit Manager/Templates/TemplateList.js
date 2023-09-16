import { Col, Row, Drawer } from "antd";
import React, { useContext, useEffect } from "react";
import TemplateCard from "./TemplateCard";
import TemplateLayout from "../Layout/TemplateLayout";
import { AuditContext } from "../AuditManager";
import AuditTemplate from "app/static/svg/AuditTemplate";
import NoTemplate from "../NoTemplate";
import { useDispatch, useSelector } from "react-redux";
import { getAuditTemplatesRequest } from "@store/call_audit/actions";
import { getRandomColors } from "@tools/helpers";
function TemplateList(props) {
    const {
        setActiveTab,
        CREATE_TEMPLATE,
        VIEW_TEMPLATES,
        templates,
        visible,
        onClose,
        currentTemplate,
    } = useContext(AuditContext);

    const { name, teams } = currentTemplate;

    const dispatch = useDispatch();
    const versionData = useSelector((state) => state.common.versionData);

    useEffect(() => {
        dispatch(getAuditTemplatesRequest());
    }, []);

    return !!templates.length ? (
        <TemplateLayout
            name={
                versionData?.domain_type !== "b2c"
                    ? "Scorecard Template List"
                    : "Audit Template List"
            }
            header_btn_text="CREATE TEMPLATE"
            header_btn_click={() => {
                setActiveTab(CREATE_TEMPLATE);
            }}
            show_header_btn={true}
            showBackBtn={false}
            goBack={() => setActiveTab(VIEW_TEMPLATES)}
        >
            <Row
                className="teamplate__list__container padding24"
                gutter={[0, 24]}
            >
                {templates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                ))}
            </Row>
            <Drawer
                title={name}
                placement="right"
                closable={true}
                onClose={onClose}
                visible={visible}
                width={500}
            >
                <div className="auditColorGrey marginB5 uppercase">
                    Applied Teams
                </div>
                <Row gutter={[12, 12]}>
                    {!!teams?.length &&
                        teams?.map(({ id, name }) => (
                            <Col span={8} key={id}>
                                <div
                                    style={{
                                        backgroundColor:
                                            getRandomColors(name) + "80",
                                    }}
                                    className="padding8 borderRadius4 paddingTB2 text-center capitalize"
                                >
                                    {name}
                                </div>
                            </Col>
                        ))}
                </Row>
            </Drawer>
        </TemplateLayout>
    ) : (
        <NoTemplate
            Svg={AuditTemplate}
            heading="No templates here"
            text="Try creating some templates"
            button_text="Create Templates"
            onClick={() => {
                setActiveTab(CREATE_TEMPLATE);
            }}
        />
    );
}

export default TemplateList;
