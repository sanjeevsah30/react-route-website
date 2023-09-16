import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="11"
        height="10"
        viewBox="0 0 11 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10.8327 8.01769L8.76331 6.4983C8.68192 6.43853 8.58015 6.40644 8.47553 6.40754C8.3709 6.40864 8.26998 6.44287 8.19013 6.50433L7.12941 7.32079C7.03256 7.39563 6.91026 7.43781 6.78317 7.44019C6.65608 7.44256 6.53198 7.405 6.43182 7.33384C5.7856 6.86523 5.17025 6.3625 4.58893 5.82824C4.00125 5.29977 3.44824 4.74036 2.93277 4.15289C2.8545 4.06184 2.81318 3.94902 2.8158 3.83348C2.81841 3.71794 2.8648 3.60676 2.94713 3.51871L3.84524 2.55443C3.91284 2.48184 3.95049 2.39009 3.95171 2.29498C3.95292 2.19987 3.91761 2.10735 3.85187 2.03335L2.18053 0.152109C2.14213 0.108817 2.09441 0.0731072 2.0403 0.0471672C1.98618 0.0212273 1.92682 0.00560335 1.86583 0.00125237C1.80484 -0.0030986 1.74352 0.00391499 1.68562 0.0218636C1.62771 0.0398122 1.57445 0.0683179 1.52909 0.105635C1.0094 0.521997 0.572997 1.01708 0.239252 1.5689C-0.448175 2.79333 0.325734 5.16763 2.82067 7.43576C5.3156 9.70388 7.92733 10.4074 9.27421 9.7825C9.88122 9.47909 10.4258 9.08236 10.8838 8.60991C10.9248 8.56868 10.9562 8.52026 10.9759 8.46762C10.9957 8.41498 11.0034 8.35923 10.9986 8.30379C10.9938 8.24834 10.9766 8.19437 10.9481 8.14518C10.9196 8.09598 10.8803 8.0526 10.8327 8.01769Z"
            fill="currentColor"
        />
    </svg>
);
function GraphPhoneSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default GraphPhoneSvg;