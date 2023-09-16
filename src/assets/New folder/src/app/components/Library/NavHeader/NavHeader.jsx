// import { Button } from 'antd'
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import "./navHeader.style.scss";
import { LeftArrowSvg } from "app/static/svg/indexSvg";
import { Link } from "react-router-dom";
import routes from "@constants/Routes/index";
import CustomButton from "../CustomButton/CustomButton";
import { LibraryContext } from "../NewLibraryContainer";

function NavHeader() {
    const { setUploadSnippetsModal } = useContext(LibraryContext);
    const { selectedFolder, categories } = useSelector(
        (state) => state.librarySlice
    );
    return (
        <div className="nav_container flex alignCenter justifySpaceBetween widthp100">
            <div className="nav_left_section flex alignCenter justifyCenter mine_shaft_cl bold600 font22">
                <Link
                    // to={routes.LIBRARY}
                    to={routes.LIBRARY.resources}
                    // onClick={() => { }}
                    className="back_btn"
                >
                    <LeftArrowSvg />
                </Link>
                <span className="folder_name marginL24">
                    {
                        categories.find(
                            (category) => category.id === +selectedFolder
                        )?.name
                    }
                </span>
            </div>
            <div className="nav_right_section">
                <CustomButton onClick={() => setUploadSnippetsModal(true)} />
            </div>
        </div>
    );
}

export default NavHeader;
