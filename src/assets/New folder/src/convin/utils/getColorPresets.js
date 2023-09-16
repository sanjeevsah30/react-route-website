// theme
import palette from "../theme/palette";

// ----------------------------------------------------------------------

export const colorPresets = [
    // DEFAULT - BLUE
    {
        name: "default",
        ...palette.light.primary,
    },
    // PURPLE
    {
        name: "purple",
        lighter: "#EBD6FD",
        light: "#B985F4",
        main: "#7635dc",
        dark: "#431A9E",
        darker: "#200A69",
        contrastText: "#fff",
    },
    // GREEN
    {
        name: "green",
        lighter: "#C8FACD",
        light: "#5BE584",
        main: "#00AB55",
        dark: "#007B55",
        darker: "#005249",
        contrastText: "#fff",
    },
    // ORANGE
    {
        name: "orange",
        lighter: "#FEF4D4",
        light: "#FED680",
        main: "#fda92d",
        dark: "#B66816",
        darker: "#793908",
        contrastText: palette.light.grey[800],
    },
    // RED
    {
        name: "red",
        lighter: "#FFE3D5",
        light: "#FFC1AC",
        main: "#FF3030",
        dark: "#B71833",
        darker: "#7A0930",
        contrastText: "#fff",
    },
];

export const defaultPreset = colorPresets[0];
export const purplePreset = colorPresets[1];
export const greenPreset = colorPresets[2];
export const orangePreset = colorPresets[3];
export const redPreset = colorPresets[4];

export default function getColorPresets(presetsKey) {
    return {
        purple: purplePreset,
        green: greenPreset,
        orange: orangePreset,
        red: redPreset,
        default: defaultPreset,
    }[presetsKey];
}
