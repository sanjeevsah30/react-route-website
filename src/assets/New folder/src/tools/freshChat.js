import { appendScript } from "./helpers";

export const initializeFC = (token, hostFC) => {
    function initFreshChat() {
        let host = window.location.host;
        let domain = host.split(".")[0];
        if (domain === "www") {
            domain = host.split(".")[1];
        }
        window.fcWidget.init({
            token: token,
            host: hostFC,
            siteId: "convin_core",
            open: false,
            config: {
                headerProperty: {
                    direction: "ltr", //will move widget to left side of the screen
                },
            },
        });

        setUserProperties({ domain: domain });
    }
    function initialize(i, t) {
        i.getElementById(t)
            ? initFreshChat()
            : appendScript(`${hostFC}/js/widget.js`, initFreshChat);
    }
    function initiateCall() {
        initialize(document, "freshchat-js-sdk");
    }
    window.addEventListener
        ? window.addEventListener("load", initiateCall, !1)
        : window.attachEvent("load", initiateCall, !1);
};

export const setUserProperties = ({ id, domain, email, name }) => {
    if (window.fcWidget) {
        if (id) {
            window.fcWidget.setExternalId(id);
        }
        if (name) {
            window.fcWidget.user.setFirstName(name);
        }
        if (email) {
            window.fcWidget.user.setEmail(email);
        }
        if (domain) {
            window.fcWidget.user.setProperties({
                domain: domain,
            });
        }
    }
};
