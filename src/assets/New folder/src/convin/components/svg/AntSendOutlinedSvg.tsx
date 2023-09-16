import { SvgIcon, SvgIconProps, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export function AntSendOutlinedSvg({
    sx,
    ...rest
}: SvgIconProps): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            sx={{ width: 24, height: 24, fill: "none", ...sx }}
            {...rest}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="ant-design:send-outlined">
                    <path
                        id="Vector"
                        d="M21.8297 11.693L2.22423 1.8633C2.14454 1.82345 2.05313 1.81408 1.96642 1.83517C1.7672 1.88439 1.64298 2.08595 1.6922 2.28751L3.71251 10.5422C3.74298 10.6664 3.83438 10.7672 3.95626 10.807L7.41798 11.9953L3.9586 13.1836C3.83673 13.2258 3.74532 13.3242 3.7172 13.4485L1.6922 21.7149C1.6711 21.8016 1.68048 21.893 1.72032 21.9703C1.81173 22.1555 2.03673 22.2305 2.22423 22.1391L21.8297 12.3656C21.9024 12.3305 21.9609 12.2695 21.9984 12.1992C22.0899 12.0117 22.0149 11.7867 21.8297 11.693ZM4.00313 19.3664L5.18204 14.5477L12.1008 12.1735C12.1547 12.1547 12.1992 12.1125 12.218 12.0563C12.2508 11.9578 12.1992 11.8524 12.1008 11.8172L5.18204 9.44533L4.00782 4.64533L18.7266 12.0258L4.00313 19.3664Z"
                        fill="#1A62F2"
                    />
                </g>
            </svg>
        </SvgIcon>
    );
}

AntSendOutlinedSvg.defaultProps = {
    sx: {},
};
