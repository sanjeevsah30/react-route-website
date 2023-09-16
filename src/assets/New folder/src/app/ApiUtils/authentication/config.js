const authApiConfig = {
    CREATEADMIN: "person/person/create_admin/",
    CREATEUSER: "person/person/create/",
    GETTOKEN: "person/token/",
    CALENDER_WEBHOOK: "calendar/webhook/",
    PROVIDER_LOCATION: "init/",
    GETUSER: "person/person/me/",
    UPDATEUSER: "person/person/retrieve_update",
    INVITEUSER: "person/person/invite/",
    LISTALLUSERS: "person/person/list_all/",
    FORGET_PASSWORD: "person/forgotpassword/",
    RESET_PASSWORD: "person/resetpassword/",
    CHANGE_PASSWORD: "person/changepassword/",
    TP_LIST: "tpauth/list_connected_parties/",
    TP_INIT: "tpauth/init_auth/",
    TP_MANAGE: "tpauth/manage/",
    SIGNUP_PROVIDER: "app/tpsignup/",
};

export default authApiConfig;
