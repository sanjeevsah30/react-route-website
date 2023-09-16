import React from "react";
import { Modal, Button, Input } from "antd";
import libraryConfigs from "@constants/Library/index";
import { Error } from "@reusables";
import LibraryFolder from "./LibraryFolder";

export default function LibraryFolders({
    isCallActive,
    showCreateFolder,
    createFormHandlers,
    formFolder,
    categories,
    handleSelectFolder,
    loading,
    openAddFolder,
}) {
    return (
        <div className={`library-container ${isCallActive ? "hidden" : ""}`}>
            <Modal
                style={{ minWidth: "auto" }}
                width={300}
                visible={showCreateFolder}
                title={libraryConfigs.CREATE_FOLDER}
                className="modal"
                onOk={createFormHandlers.handleCreateFolderModal}
                onCancel={createFormHandlers.handleCreateFolderModal}
                footer={[
                    <Button
                        className={"cancel-folder"}
                        key="back"
                        onClick={createFormHandlers.handleCreateFolderModal}
                        shape={"round"}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={createFormHandlers.handleCreateNewFolder}
                        shape={"round"}
                    >
                        {libraryConfigs.CREATE_FOLDER_BTN}
                    </Button>,
                ]}
            >
                <div className="create-folder-form-content">
                    <div className="folder-name uppercase">
                        <p className="font14 bold marginB4">
                            {libraryConfigs.FOLDER_NAME_LABEL}
                        </p>
                        <Input
                            className="marginL16"
                            placeholder={libraryConfigs.FOLDER_NAME_LABEL}
                            onChange={createFormHandlers.handleNewFolder}
                            value={formFolder.folder.value}
                            name={libraryConfigs.FOLDER_NEW}
                        />

                        {formFolder.folder.error && (
                            <Error errorMessage={formFolder.folder.errorMsg} />
                        )}
                    </div>
                </div>
            </Modal>
            <div className="folder-wrapper library-calls-container">
                <LibraryFolder
                    folders={categories}
                    hasFolders={true}
                    onClick={handleSelectFolder}
                    loading={loading}
                    openAddFolder={openAddFolder}
                />
            </div>
        </div>
    );
}
