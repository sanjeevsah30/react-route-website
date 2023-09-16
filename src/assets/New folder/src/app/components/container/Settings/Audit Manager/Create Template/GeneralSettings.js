import React from "react";
import { Col, Input, Layout, Row, Select } from "antd";
import { Checkbox } from "antd";
import config from "@apis/individual/config";
import { useSelector } from "react-redux";
const { Content } = Layout;
const { Option } = Select;
function GeneralSettings({ style, name, setName, tags, setTags }) {
    return (
        <Content className="create__template__content" style={style}>
            {/* <nav className="navbar">
            <Button
                className="menu"
                type="primary"
                icon={<MenuOutlined />}
                onClick={() => setVisible(true)}
            />
            <Drawer
                title="Topics"
                placement="right"
                onClick={() => setVisible(false)}
                onClose={() => setVisible(false)}
                visible={visible}
            >
                Hello
            </Drawer>
        </nav> */}

            <Input
                className="create__template__name__input audit__input__bg"
                placeholder="Enter Template Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {/* <div className="borderBottomBold paddingTB24">
                <div className="bold font16 marginB10">Violations</div>
                <div className="auditColorGrey font14 marginB10">
                    CHOOSE APPLICABLE VIOLATIONS FOR THIS TEMPLATE
                </div>
                <div className="flex row">
                    <div className="marginR20">
                        <Checkbox
                            checked={tags.red_alert}
                            onChange={(e) => {
                                setTags({
                                    ...tags,
                                    red_alert: e.target.checked,
                                });
                            }}
                        >
                            <span>Red Alert</span>
                        </Checkbox>
                    </div>
                    <div>
                        <Checkbox
                            checked={tags.zero_tolerance}
                            onChange={(e) => {
                                setTags({
                                    ...tags,
                                    zero_tolerance: e.target.checked,
                                });
                            }}
                        >
                            <span>Zero Tolerence</span>
                        </Checkbox>
                    </div>
                </div>
            </div> */}
            <div className="borderBottomBold paddingTB24">
                <div className="bold font16 marginB10">Scoring</div>
                <ul className="paddingL16">
                    <li className="marginB10">
                        <span>
                            If response to any non-critical question is “NO”,
                            deduct the marks from final scoring for the entire
                            category
                        </span>
                    </li>
                    <li className="marginB10">
                        <span>
                            If response to any question is “NA”, don’t count the
                            mark for final calculation
                        </span>
                    </li>
                    <li className="marginB10">
                        <span>
                            If a question is marked “Fatal”, the overall score
                            of the template will be zero
                        </span>
                    </li>
                </ul>
            </div>
            <div className="paddingTB24 ">
                <div className="bold font16 marginB10">Actions</div>

                <ul className="paddingL16">
                    <li className="marginB10">
                        <span>
                            If agent has a Red Alert violation, send a
                            consolidated email to manager by end of day
                        </span>
                    </li>
                    <li className="marginB10">
                        <span>
                            If agent has a Zero Tolerance violation, send an
                            email to manager immediately
                        </span>
                    </li>
                </ul>
            </div>
        </Content>
    );
}

GeneralSettings.defaultProps = {
    style: {},
};

export default GeneralSettings;
