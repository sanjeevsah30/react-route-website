// ----------------------------------------------------------------------
import ProximaNovaBoldOTF from "../../assets/fonts/proxima-nova/proximanova-bold-v2.otf";
import ProximaNovaRegularOTF from "../../assets/fonts/proxima-nova/proximanova-font.otf";

export default function CssBaseline() {
    return {
        MuiCssBaseline: {
            styleOverrides: {
                "@font-face": {
                    fontFamily: "ProximaNova",
                    src: `url(${ProximaNovaRegularOTF}) format("opentype")`,
                    fontWeight: 400,
                    fontStyle: "normal",
                },
                // '*': {
                //   margin: 0,
                //   padding: 0,
                //   boxSizing: 'border-box',
                // },

                html: {
                    width: "100%",
                    height: "100%",
                    WebkitOverflowScrolling: "touch",

                    "*::-webkit-scrollbar": {
                        width: "6px",
                        height: "6px",
                    },
                    "*::-webkit-scrollbar-track": {},
                    "*::-webkit-scrollbar-thumb": {
                        background: "#99999966",
                        borderRadius: "100px",
                    },
                },
                body: {
                    width: "100%",
                    height: "100%",
                },
                "#root": {
                    width: "100%",
                    height: "100%",
                },
            },
        },
    };
}
