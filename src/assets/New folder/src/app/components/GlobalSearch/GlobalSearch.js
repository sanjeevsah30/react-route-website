import React, { useContext, useEffect, useRef, useState } from "react";
import { Input } from "antd";
import { useHistory } from "react-router";
import routes from "@constants/Routes/index";
import { useDispatch, useSelector } from "react-redux";
import {
    changeActiveTeam,
    clearFilters,
    setActiveCallDuration,
    setActiveFilterDate,
    setGSText,
} from "@store/common/actions";
import { setActiveSearchView, setSearchFilters } from "@store/search/actions";
import { HomeContext } from "@container/Home/Home";
import SearchSvg from "app/static/svg/SearchSvg";

const { Search } = Input;
export default function GlobalSearch({ activePageConfig }) {
    const ref = useRef("");

    const dispatch = useDispatch();
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [text, setText] = useState("");
    const gsText = useSelector((state) => state.common.gsText);
    const { defaultSearchFilters } = useSelector(({ search }) => search);
    const { auth } = useSelector(({ auth }) => auth);
    const { handleActiveComponent } = useContext(HomeContext);

    const handleSearch = (searchedText) => {
        dispatch(setGSText(searchedText));
        if (searchedText) {
            setIsSearchActive(false);
            // setText('');
            // dispatch(setGSText(''));
            ref.current.blur();
        }
    };
    useEffect(() => {
        setText(gsText);
        if (gsText) {
            dispatch(clearFilters());
            dispatch(changeActiveTeam([]));
            dispatch(setActiveSearchView(0));
            dispatch(setActiveCallDuration(0));
            dispatch(setActiveFilterDate("all"));
            dispatch(
                setSearchFilters({
                    ...defaultSearchFilters,
                    keywords: [gsText],
                    processing_status: null,
                })
            );
            if (activePageConfig?.title !== "Meetings") {
                handleActiveComponent("calls");
            }
        }
    }, [gsText]);

    // useEffect(() => {
    //     if (searchFilters?.keywords?.length === 1) {
    //         history.push(`${routes.CALLS}`);
    //     }
    // }, [searchFilters?.keywords?.length]);

    useEffect(() => {
        const handleEsc = (evt) => {
            if (evt.key === "Escape" || evt.keyCode === 27) {
                setIsSearchActive(false);
                // setText('');
                // dispatch(setGSText(''));
                ref.current && ref.current.blur();
            }
        };
        document.addEventListener("keyup", handleEsc);
        return () => {
            document.addEventListener("keyup", handleEsc);
        };
    }, []);

    const handleFocus = () => {
        if (!isSearchActive) {
            ref.current && ref.current.select();
        }
        setIsSearchActive((t) => !t);
    };
    return (
        <>
            <Search
                className="global_search"
                placeholder="Enter text to search conversation "
                allowClear
                style={{
                    width: 300,
                    zIndex: isSearchActive ? 1001 : 1,
                    height: "36px",
                }}
                onSearch={handleSearch}
                onFocus={handleFocus}
                value={text}
                onChange={(e) => setText(e.target.value)}
                ref={ref}
                enterButton={
                    <SearchSvg
                        style={{
                            color: "white",
                        }}
                    />
                }
            />
            {isSearchActive && (
                <div className="ant-modal-mask" onClick={handleFocus} />
            )}
        </>
    );
}
