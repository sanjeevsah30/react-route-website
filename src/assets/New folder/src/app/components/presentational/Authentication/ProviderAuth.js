import { Button, Form } from "antd";
import React from "react";
import Icon, { GoogleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
const outlookSvg = () => (
    <svg
        viewBox="64 64 400 400"
        focusable="false"
        data-icon="outlook"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
    >
        <path
            d="M0 50.03v388.591l289.985 56.819V-.005L0 50.03m307.983 185.893v130.329h163.992s23.999-3.337 21.999-34.819l.119-170.266-120.112 81.269s-33.999 27.453-65.997-6.513m-.001-135.363h165.325s19.452-1.333 19.451 19.855l-149.444 99.546-35.332-22.521v-96.88"
            fill="#3872c2"
        />
        <path
            d="M144.928 295.375c-17.532 0-31.744-23.312-31.744-52.069s14.212-52.069 31.744-52.069 31.745 23.312 31.745 52.069-14.213 52.069-31.745 52.069zm.775-139.806c-36.465 0-66.023 39.344-66.023 87.88s29.558 87.88 66.023 87.88 66.023-39.344 66.023-87.88-29.56-87.88-66.023-87.88"
            fill="#fff"
        />
    </svg>
);

const OutlookIcon = () => <Icon component={outlookSvg} />;
export default function ProviderAuth({ callout }) {
    const domain = useSelector((state) => state.common.domain);

    const getUri = (provider) => {
        return `https://${domain}.api.convin.ai/app/tpsignup/${provider}/`;
    };
    return (
        <>
            <p className="text-center font14 bolder marginB12">OR</p>
            <Form.Item>
                <div className="flex alignCenter">
                    <a href={getUri("google")} className="flex1">
                        <Button
                            className="user_auth_google"
                            shape="round"
                            title="Signup with google"
                        >
                            <span>{callout} WITH&nbsp;</span>
                            <GoogleOutlined />
                        </Button>
                    </a>
                    <a href={getUri("outlook")} className="marginL12 flex1">
                        <Button
                            className="user_auth_google"
                            shape="round"
                            title="Signup with outlook"
                        >
                            <span>{callout} WITH&nbsp;</span>
                            <OutlookIcon />
                        </Button>
                    </a>
                </div>
            </Form.Item>
        </>
    );
}
