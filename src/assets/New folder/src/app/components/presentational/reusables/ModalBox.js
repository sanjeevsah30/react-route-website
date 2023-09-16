// Reusable Modal Box Component
import React, { useState } from "react";
import Input from "./Input";
import Label from "./Label";
import DropdownSelect from "./DropdownSelect";
import Error from "./Error";
import Success from "./Success";
import { Modal, Button } from "antd";

const ModalBox = (props) => {
    const className = `modal ${props.className ? props.className : ""}`,
        formfields =
            props.formfields && props.formfields.length >= 2
                ? props.formfields
                : [];

    const [formdata, setformdata] = useState({
        [formfields[0]]: "",
        [formfields[1]]: props.hasOwnProperty("defaultVal")
            ? props.defaultVal
            : 1,
    });

    // Closer for Modal Box on outisde click.

    const handleChange = (e) => {
        if (e.target.name === formfields[0]) {
            if (e.target.value) e.target.classList.add("filled");
            else e.target.classList.remove("filled");

            setformdata({
                ...formdata,
                [e.target.name]: e.target.value,
            });
        } else {
            setformdata({
                ...formdata,
                [e.target.name]: Number(e.target.value),
            });
        }
    };

    return (
        <Modal
            visible={props.isVisible}
            title={props.topLabel}
            className={`modal ${className}`}
            onOk={props.toggleCreator}
            onCancel={props.toggleCreator}
            footer={[
                <Button
                    className={"cancel-folder"}
                    key="back"
                    onClick={props.toggleCreator}
                    shape={"round"}
                >
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    shape={"round"}
                    onClick={() => {
                        props.submitAction(formdata);
                        // Clearing formdata.
                        setformdata({
                            [formfields[0]]: "",
                            [formfields[1]]: props.hasOwnProperty("defaultVal")
                                ? props.defaultVal
                                : 1,
                        });
                    }}
                >
                    {props.submitTitle}
                </Button>,
            ]}
        >
            {/* Now the modal contents. */}
            <div className={"modal-contents"}>
                {props.children && !props.extendWithChildren ? (
                    // If the user has sent their own custom contens, render them.
                    props.children
                ) : (
                    // If the user hasn't sent their own custom input, just render a pre-made form.
                    <form
                        className={"modal-contents-form"}
                        onSubmit={(event) => {
                            event.preventDefault();
                            props.submitAction(formdata);
                            // Clearing formdata.
                            setformdata({
                                [formfields[0]]: "",
                                [formfields[1]]: props.hasOwnProperty(
                                    "defaultVal"
                                )
                                    ? props.defaultVal
                                    : 1,
                            });
                        }}
                    >
                        <div className={"modal-contents-inputfield"}>
                            <Label label={props.inputLabel} />
                            <Input
                                inputRequired={true}
                                inputTitle={props.inputTitle}
                                inputPlaceholder={props.inputTitle}
                                inputName={formfields[0]}
                                inputValue={formdata[formfields[0]]}
                                handleChange={handleChange}
                                autoFocus={true}
                            />
                        </div>

                        {props.selectOptions.length > 0 && (
                            <div className={"modal-contents-inputfield"}>
                                <Label label={props.dropdownLabel} />
                                <DropdownSelect
                                    options={props.selectOptions}
                                    selectTitle={props.dropdownTitle}
                                    selectClass={"darkinput"}
                                    selectName={formfields[1]}
                                    withIds={props.selectWithIds}
                                    field={props.selectField}
                                    handleChange={handleChange}
                                    selectValue={formdata[formfields[1]]}
                                />
                            </div>
                        )}
                        {props.children && props.extendWithChildren
                            ? props.children
                            : null}

                        {
                            // Show success and error messages here.
                            props.errorMessage ? (
                                <Error errorMessage={props.errorMessage} />
                            ) : (
                                ""
                            )
                        }
                        {props.successMessage ? (
                            <Success successMessage={props.successMessage} />
                        ) : (
                            ""
                        )}
                    </form>
                )}
            </div>
        </Modal>
    );
};

export default ModalBox;
