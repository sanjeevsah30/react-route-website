import { Button, Checkbox, Input, Tooltip } from "antd";
import React, { useContext, useState } from "react";
import { EnterOutlined } from "@ant-design/icons";
import config from "@constants/CI";
import "./Header.scss";
import { useDispatch, useSelector } from "react-redux";
import { addTabKeyWord } from "@store/ci/actions";
import ShareTabModal from "../../../../CustomerIntelligence/ShareTabModal/ShareTabModal";
import { CiContext } from "../../../../CustomerIntelligence/CustomerIntelligence";
import PlusSvg from "app/static/svg/PlusSvg";
import { CustomTrackigContext } from "../CustomTrackingDashboard";
import { useParams } from "react-router-dom";
import {
    addCIPhrase,
    getGraphByTabId,
} from "@store/cutsomerIntelligence/CISlice";
import apiErrors from "@apis/common/errors";

export default function Header({
    id,
    placeholder,
    saidByFilter,
    handleSaidByFilter,
    exclude,
    toggleExclude,
}) {
    const { tabs } = useSelector((state) => state.CISlice);
    const dispatch = useDispatch();
    const [newKeyword, setNewKeyword] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    const { generatePayload } = useContext(CustomTrackigContext);
    const { slug } = useParams();
    const handleNewKeyword = () => {
        if (newKeyword) {
            dispatch(
                addCIPhrase({
                    ...generatePayload(),
                    phrase: newKeyword,
                    tab: tabs.find(
                        (e) => e.slug.toLowerCase() === slug.toLowerCase()
                    )?.id,
                })
            ).then(({ payload }) => {
                if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                    setNewKeyword("");
                    dispatch(
                        getGraphByTabId({
                            id: payload.id,
                            payload: generatePayload(),
                        })
                    );
                }
            });
        }
    };
    const handleShare = (users) => {
        setShowShareModal(false);
    };

    return (
        <div
            className="flex flexShrink  paddingT10 paddingB20 alignCenter"
            style={{
                gap: "60px",
            }}
        >
            <div className="maxWidth30 keywordSearch">
                <Input
                    placeholder={placeholder}
                    className="borderRadius6 padding6"
                    suffix={
                        <>
                            <Button
                                type="primary"
                                className="borderRadius6"
                                onClick={handleNewKeyword}
                            >
                                <span className="marginR5">
                                    <PlusSvg />
                                </span>{" "}
                                Add New
                            </Button>
                        </>
                    }
                    value={newKeyword}
                    onChange={(evt) => setNewKeyword(evt.target.value)}
                    onPressEnter={handleNewKeyword}
                />
            </div>
            <div className="advance-section-row">
                <Checkbox onChange={toggleExclude} defaultChecked={exclude}>
                    Exclude
                </Checkbox>
                <span className="font14 bold600 mine_shaft_cl marginR6 marginL3">
                    {config.SPEAKERLABEL}{" "}
                </span>
                <span>
                    <Checkbox
                        onChange={(e) => {
                            handleSaidByFilter(e.target.checked, "saidByOwner");
                        }}
                        checked={saidByFilter.saidByOwner}
                    >
                        {config.SAID_BY_REP_LABEL}
                    </Checkbox>

                    <Checkbox
                        onChange={(e) => {
                            handleSaidByFilter(
                                e.target.checked,
                                "saidByClient"
                            );
                        }}
                        checked={saidByFilter.saidByClient}
                    >
                        {config.SAID_BY_CLIENT_LABEL}
                    </Checkbox>
                </span>
            </div>
            <ShareTabModal
                onCancel={() => setShowShareModal(false)}
                onOk={handleShare}
                isVisible={showShareModal}
            />
        </div>
    );
}
