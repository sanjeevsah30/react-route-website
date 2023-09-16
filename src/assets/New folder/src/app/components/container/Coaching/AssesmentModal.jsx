import CloseSvg from "@container/Settings/MomentsSettings/CloseSvg";
import Spinner from "@presentational/reusables/Spinner";
import { Modal } from "antd";
import React from "react";
import { useSelector } from "react-redux";

export default function AssesmentModal({
    open,
    handleClose = () => {},
    id,
    urlId,
}) {
    const {
        coaching_dashboard: { verifying_assessment },
    } = useSelector((state) => state);
    return (
        <Modal
            title="Complete Assessment"
            visible={open}
            onCancel={handleClose}
            closeIcon={<CloseSvg />}
            width={1327}
            destroyOnClose={true}
            className="create_coaching_modal mine_shaft_cl"
        >
            <Spinner loading={verifying_assessment}>
                <iframe
                    title="IFRAME"
                    id="iframe"
                    src={urlId}
                    width="100%"
                    height="100%"
                    style={{ position: "relative" }}
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                >
                    Loading…
                </iframe>
            </Spinner>
        </Modal>
    );
}
