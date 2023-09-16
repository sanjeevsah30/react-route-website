import React, { useCallback, useEffect, useState } from "react";
import { Steps, Layout, Button, Row, Col } from "antd";
import {
    UserOutlined,
    ArrowRightOutlined,
    ScheduleOutlined,
    RobotOutlined,
    AudioOutlined,
} from "@ant-design/icons";
import Calendar from "@container/Calendar/Calendar";
import routes from "@constants/Routes/index";
import { withRouter } from "react-router-dom";
import RecordingAssistant from "@container/Settings/RecordingAssistant";
import RecordingsManager from "@container/Settings/RecordingsManager/index";

const { Step } = Steps;
const { Header, Content, Footer } = Layout;

function InitialSetup(props) {
    const [current, setcurrent] = useState(1);

    const onStepChange = (current) => {
        setcurrent(+current);
    };

    const routeToHome = useCallback(() => {
        localStorage.setItem("calls-subnav", "upcoming");
        props.history.push(routes.CALLS);
    }, []);
    useEffect(() => {
        routeToHome();
    }, [routeToHome]);

    return (
        <Layout className="initial-setup">
            <Header>
                <Steps
                    type={"navigation"}
                    current={current}
                    onChange={onStepChange}
                >
                    <Step title="Sign Up" icon={<UserOutlined />} disabled />
                    <Step title="Calender Setup" icon={<ScheduleOutlined />} />
                    <Step title="Assistant Setup" icon={<RobotOutlined />} />
                    <Step title="Voice Print Setup" icon={<AudioOutlined />} />
                </Steps>
            </Header>
            <Content>
                {current === 1 && <Calendar skipStep={onStepChange} />}
                {current === 2 && (
                    <RecordingAssistant
                        skipStep={onStepChange}
                        isOnSetup={true}
                    />
                )}
                {current === 3 && (
                    <RecordingsManager
                        skipStep={onStepChange}
                        isOnSetup={true}
                    />
                )}
            </Content>
            {current === 3 && (
                <Footer>
                    <Row gutter={[8, 8]}>
                        <Col span={4} offset={20}>
                            <Button
                                icon={<ArrowRightOutlined />}
                                type={"primary"}
                                shape={"round"}
                                onClick={routeToHome}
                            >
                                Finish
                            </Button>
                        </Col>
                    </Row>
                </Footer>
            )}
        </Layout>
    );
}

export default withRouter(InitialSetup);
