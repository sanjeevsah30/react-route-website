const {
    override,
    fixBabelImports,
    addLessLoader,
    addWebpackAlias,
    adjustWorkbox,
    addWebpackModuleRule,
} = require("customize-cra");
const path = require("path");

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true,
    }),
    addWebpackModuleRule({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
    }),
    addLessLoader({
        modifyVars: {
            "primary-color": "#1A62F2",
            "btn-primary-bg": "#1A62F2",
            "link-color": "#000",
            "success-color": "#52c41a",
            "warning-color": "#faad14",
            "error-color": "#f5222d",
            "font-size-base": "14px",
            "heading-color": "#333",
            "text-color": "#333",
            "text-color-secondary": "rgba(0, 0, 0, 0.45)",
            "disabled-color": "rgba(0, 0, 0, 0.25)",
            "border-radius-base": "4px",
            "border-color-base": "#d9d9d9",
            "box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)",
        },
        javascriptEnabled: true,
    }),
    addWebpackAlias({
        "@store": path.resolve(__dirname, "src/store"),
        "@tools": path.resolve(__dirname, "src/tools"),
        "@helpers": path.resolve(__dirname, "src/tools/helpers.js"),
        "@container": path.resolve(__dirname, "src/app/components/container"),
        "@presentational": path.resolve(
            __dirname,
            "src/app/components/presentational"
        ),
        "@reusables": path.resolve(
            __dirname,
            "src/app/components/presentational/reusables"
        ),
        "@constants": path.resolve(__dirname, "src/app/constants"),
        "@apis": path.resolve(__dirname, "src/app/ApiUtils"),
        "@style": path.resolve(__dirname, "src/app/static/styles/modules"),
        "@tours": path.resolve(__dirname, "src/tours/index.js"),
        "@convin": path.resolve(__dirname, "src/convin"),
    }),
    adjustWorkbox((wb) =>
        Object.assign(wb, {
            // skipWaiting: true,
            exclude: (wb.exclude || []).concat("index.html"),
        })
    )
);
