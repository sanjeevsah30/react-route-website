import { Modal } from "antd";
import LogoutSvg from "app/static/svg/sidebar/LogoutSvg";

const LogoutDialog = ({ open, onCancel, onOk }) => {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            centered
            okText="LOGOUT"
            cancelText="NO"
            className="logout-dialog"
            width={458}
        >
            <div className="logout-icon">
                <LogoutSvg />
            </div>
            <span className="logout-text">Do you wish to Logout?</span>
        </Modal>
    );
};

export default LogoutDialog;
