import React, { useState, useEffect } from "react";
import "./styles.scss";

import { Checkbox } from "antd";
import { useSelector, useDispatch } from "react-redux";

const DropdownCustom = () => {
    const [isOpen, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen(!isOpen);
    };

    const [people, setPeople] = useState([]);

    function checkBoxHandler(checkedValues) {
        setPeople(checkedValues);
    }

    // get all users
    const users = useSelector((state) => state.askfeedback.users.people);

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
                <p>Select People</p>
                <i
                    className={`fa fa-chevron-right icon ${isOpen && "open"}`}
                ></i>
            </div>
            {isOpen && (
                <div className="dropdown_body">
                    <Checkbox.Group onChange={checkBoxHandler}>
                        {users.length > 0 &&
                            users.map((user) => (
                                <div className="single_option" key={user.id}>
                                    <Checkbox value={user.id}>
                                        {user.id}
                                    </Checkbox>
                                </div>
                            ))}
                    </Checkbox.Group>
                </div>
            )}
        </div>
    );
};

export default DropdownCustom;
