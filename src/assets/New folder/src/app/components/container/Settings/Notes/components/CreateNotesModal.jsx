import { Button, Modal, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import NotesCardProvider, { NotesCardContext } from "./NotesCardProvider";
import NoteSettingForm from "./NoteSettingForm";
import { openNotification } from "../../../../../../store/common/actions";
import {
    createUpdateNotesCard,
    getNotesCradToUpdate,
} from "../../../../../../store/notesSettingSlice/notesSettingSlice";
import apiErrors from "../../../../../ApiUtils/common/errors";

const CreateBattleCardModal = () => {
    const {
        notesSettingSlice: { loading },
    } = useSelector((state) => state);
    const [isFetching, setIsFetching] = useState(false);
    const {
        notesCardModalVisible: visible,
        notesCardToEditId,
        handleNotesCardModal,
        modalState: {
            name,
            team_ids,
            call_tags_ids,
            call_type_ids,
            meeting_type,
        },
        modalDispatch,
        setNotesCardToEditId,
    } = useContext(NotesCardContext);

    const dispatch = useDispatch();

    const handleSave = () => {
        if (!name.length)
            return openNotification("error", "Error", "Name is mandatory");
        // if (!team_ids.length)
        //     return openNotification(
        //         'error',
        //         'Error',
        //         'Select at least one team'
        //     );

        // if (!call_tags_ids.length)
        //     return openNotification(
        //         'error',
        //         'Error',
        //         'Select at least one call tag '
        //     );

        // if (!call_type_ids.length)
        //     return openNotification(
        //         'error',
        //         'Error',
        //         'Select at least one call type'
        //     );

        dispatch(
            createUpdateNotesCard({
                ...(notesCardToEditId && {
                    id: notesCardToEditId,
                }),
                name,
                teams: team_ids,
                meeting_type: meeting_type,
                call_type: call_type_ids,
                tags: call_tags_ids,
            })
        ).then(({ payload }) => {
            if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                setNotesCardToEditId(null);
                handleNotesCardModal();
                modalDispatch({
                    type: "RESET_STATE",
                });
            }
        });
    };

    useEffect(() => {
        if (notesCardToEditId) {
            setIsFetching(true);
            dispatch(getNotesCradToUpdate(notesCardToEditId)).then(
                ({ payload }) => {
                    setIsFetching(false);
                    if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                        if (payload?.id) {
                            modalDispatch({
                                type: "UPDATE_MODAL_STATE",
                                payload: {
                                    ...payload,
                                    team_ids: payload.teams.map((e) => e.id),
                                    // meeting_type: meeting_type,
                                    call_type_ids: payload.call_type.map(
                                        (e) => e.id
                                    ),
                                    call_tags_ids: payload.tags.map(
                                        (e) => e.id
                                    ),
                                },
                            });
                        }
                    }
                }
            );
        }
    }, [notesCardToEditId]);

    return (
        <Modal
            open={visible}
            centered
            onCancel={() => {
                if (notesCardToEditId) {
                    setNotesCardToEditId(null);
                    modalDispatch({
                        type: "RESET_STATE",
                    });
                }
                handleNotesCardModal();
            }}
            title={`${notesCardToEditId ? "Edit" : "Create"} Custom Field`}
            width="1000px"
            footer={
                <Button type="primary" onClick={handleSave} loading={loading}>
                    SAVE
                </Button>
            }
            wrapClassName="rule_modal"
        >
            {isFetching ? (
                <Skeleton
                    active
                    paragraph={{ rows: 8 }}
                    title={false}
                    style={{ marginTop: "10px" }}
                />
            ) : (
                <NoteSettingForm />
            )}
        </Modal>
    );
};

export default CreateBattleCardModal;
