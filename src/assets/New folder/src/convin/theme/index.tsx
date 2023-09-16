import React, { useMemo } from "react";
// @mui
import { CssBaseline, ThemeOptions } from "@mui/material";
import {
    createTheme,
    ThemeProvider as MUIThemeProvider,
    StyledEngineProvider,
} from "@mui/material/styles";
// hooks
import useSettings from "../hooks/useSettings";
//
import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import componentsOverride from "./overrides";
import shadows from "./shadows";

// ----------------------------------------------------------------------

export default function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    const { themeMode } = useSettings();
    const isLight = themeMode === "light";

    const themeOptions: ThemeOptions = useMemo(
        (): ThemeOptions => ({
            palette: isLight ? palette.light : palette.dark,
            typography,
            breakpoints,
            spacing: 8,
            shape: { borderRadius: 4 },
            shadows: isLight ? shadows.light : shadows.dark,
        }),
        [isLight]
    );

    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return (
        <StyledEngineProvider injectFirst>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </StyledEngineProvider>
    );
}
