import { alpha, PaletteOptions } from "@mui/material/styles";

// ----------------------------------------------------------------------
interface PaletteType {
    light: PaletteOptions;
    dark: PaletteOptions;
}

function createGradient(color1: string, color2: string): string {
    return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
const primary = {
    lighter: "#D1E9FC",
    light: "#76B0F1",
    main: "#1a62f2",
    dark: "#103996",
    darker: "#061B64",
};
const secondary = {
    lighter: "#C8FACD",
    light: "#5BE584",
    main: "#00AB55",
    dark: "#007B55",
    darker: "#005249",
};
const info = {
    lighter: "#D0F2FF",
    light: "#74CAFF",
    main: "#1890FF",
    dark: "#0C53B7",
    darker: "#04297A",
};
const success = {
    lighter: "#E9FCD4",
    light: "#AAF27F",
    main: "#54D62C",
    dark: "#229A16",
    darker: "#08660D",
};
const warning = {
    lighter: "#FFF7CD",
    light: "#FFE16A",
    main: "#F2AA1A",
    dark: "#B78103",
    darker: "#7A4F01",
};
const error = {
    lighter: "#FFE7D9",
    light: "#FFA48D",
    main: "#FF4842",
    dark: "#B72136",
    darker: "#7A0C2E",
};

const grey = {
    0: "#FFFFFF",
    100: "#F9FAFB",
    200: "#F4F6F8",
    300: "#DFE3E8",
    400: "#C4CDD5",
    500: "#919EAB",
    600: "#637381",
    700: "#454F5B",
    800: "#212B36",
    900: "#161C24",
    500_8: alpha("#919EAB", 0.08),
    500_12: alpha("#919EAB", 0.12),
    500_16: alpha("#919EAB", 0.16),
    500_24: alpha("#919EAB", 0.24),
    500_32: alpha("#919EAB", 0.32),
    500_48: alpha("#919EAB", 0.48),
    500_56: alpha("#919EAB", 0.56),
    500_80: alpha("#919EAB", 0.8),

    333: "#333333",
    666: "#666666",
    999: "#999999",
    333_20: alpha("#333333", 0.2),
    666_20: alpha("#666666", 0.2),
    999_20: alpha("#999999", 0.2),
    D9D9D9: "#d9d9d9",
};

const gradients = {
    primary: createGradient(primary.light, primary.main),
    info: createGradient(info.light, info.main),
    success: createGradient(success.light, success.main),
    warning: createGradient(warning.light, warning.main),
    error: createGradient(error.light, error.main),
};

const chart = {
    violet: ["#826AF9", "#9E86FF", "#D0AEFF", "#F7D2FF"],
    blue: ["#2D99FF", "#83CFFF", "#A5F3FF", "#CCFAFF"],
    green: ["#2CD9C5", "#60F1C8", "#A4F7CC", "#C0F2DC"],
    yellow: ["#FFE700", "#FFEF5A", "#FFF7AE", "#FFF3D6"],
    red: ["#FF6C40", "#FF8F6D", "#FFBD98", "#FFF2D4"],
};

export const auditColors = {
    bad: "#FF6365",
    average: "#ECA51D",
    good: "#76B95C",
};

export const leadColors = {
    hot: "#FF8754",
    warm: "#FDD250",
    cold: "#73B1FF",
};

export const teamColors = ["#F4B860", "#9B8816", "#C287E8"];

export const textColors = {
    333: "#333333",
    666: "#666666",
    999: "#999999",
};

const common = {
    common: { black: "#000", white: "#fff" },
    primary: { ...primary, contrastText: "#fff" },
    secondary: { ...secondary, contrastText: "#fff" },
    info: { ...info, contrastText: "#fff" },
    success: { ...success, contrastText: grey[800] },
    warning: { ...warning, contrastText: grey[800] },
    error: { ...error, contrastText: "#fff" },
    grey,
    gradients,
    chart,
    divider: "#99999933",
    auditColors,
    textColors,
    leadColors,
    action: {
        hover: grey[500_8],
        selected: grey[500_16],
        disabled: "rgba(29, 27, 32, 0.12)",
        disabledBackground: grey[500_24],
        focus: grey[500_24],
        hoverOpacity: 0.08,
        disabledOpacity: 0.48,
    },
};

const palette: PaletteType = {
    light: {
        ...common,
        mode: "light",
        text: {
            primary: textColors[333],
            secondary: textColors[666],
            disabled: textColors[999],
        },
        background: { paper: "#fff", default: "#fff" },
        action: { active: grey[600], ...common.action },
    },
    dark: {
        ...common,
        mode: "dark",
        text: { primary: "#fff", secondary: grey[500], disabled: grey[600] },
        background: { paper: grey[800], default: grey[900] },
        action: { active: grey[500], ...common.action },
    },
};

export default palette;
