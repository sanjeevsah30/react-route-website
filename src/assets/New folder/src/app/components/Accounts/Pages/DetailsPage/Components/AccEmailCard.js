import { Avatar, Col, Row } from "antd";
import React from "react";

function AccEmailCard(props) {
    return (
        <div className="padding16 border_bottom email__card component--hover--active curPoint">
            <Row className="alignCenter ">
                <Col span={3}>
                    <Avatar
                        style={{
                            backgroundColor: "#1A62F233",
                            verticalAlign: "middle",
                        }}
                        className="bold font18 primary_cl--important"
                    >
                        E
                    </Avatar>
                </Col>
                <Col span={21}>
                    <div className="paddingL10">
                        <div className="mine_shaft_cl bold font14">
                            Evelyn Summers
                        </div>
                        <div
                            className="dusty_gray_cl font14 bold"
                            style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                maxWidth: "200px",
                                textOverflow: "ellipsis",
                            }}
                        >
                            Donec vulputate massa a sem
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={3}></Col>
                <Col span={21}>
                    <div className="paddingL10 font14 dusty_gray_cl flex alignCenter justifySpaceBetween ">
                        <span>Feb 2021 . 1:40 pm</span>
                        <InboundMark />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

const InboundMark = () => (
    <span className="email__card--type primary_bg"></span>
);
// const OutboundMark = () => (
//     <span className="email__card--type robin_egg_blue_bg"></span>
// );
export default AccEmailCard;
