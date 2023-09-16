import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import "font-awesome/css/font-awesome.min.css";
import * as serviceWorker from "./serviceWorkerRegistration";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { disableReactDevTools } from "./tools";
import { updateServiceWorker } from "@store/serviceworker/actions";
import { store } from "@store/index";
//convin - mui - theme - imports
import { SettingsProvider } from "@convin/contexts/SettingsContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ThemeProvider from "@convin/theme";
import ThemeColorPresets from "@convin/components/theme/ThemeColorPresets";
import ThemeSettings from "@convin/components/theme/settings";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// loadProgressBar();

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

// REMOVE react dev tools for production build to avoid state manipulation by user
if (process.env.NODE_ENV === "production") {
    disableReactDevTools();
}
root.render(
    <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SettingsProvider>
                <BrowserRouter>
                    <ThemeProvider>
                        <ThemeColorPresets>
                            {/* <ChartStyle /> */}
                            {/* <ReactMentionStyles /> */}
                            <App />
                            <ThemeSettings />
                        </ThemeColorPresets>
                    </ThemeProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </BrowserRouter>
            </SettingsProvider>
        </LocalizationProvider>
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
    onUpdate: (registration: unknown) => {
        store.dispatch(updateServiceWorker(registration));
    },
});
