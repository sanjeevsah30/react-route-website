import { ReactNode, useMemo } from "react";
// @mui
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
// hooks
import useSettings from "../../hooks/useSettings";
//
import componentsOverride from "../../theme/overrides";

// ----------------------------------------------------------------------
export default function ThemeColorPresets({
    children,
}: {
    children: ReactNode;
}): JSX.Element {
    const defaultTheme = useTheme();
    const { setColor } = useSettings();

    const themeOptions = useMemo(
        () => ({
            ...defaultTheme,
            palette: {
                ...defaultTheme.palette,
                primary: setColor,
            },
        }),
        [setColor, defaultTheme]
    );

    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
