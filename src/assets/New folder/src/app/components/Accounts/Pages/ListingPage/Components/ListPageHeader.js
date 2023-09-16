import AntClose from "@presentational/reusables/AntClose";
import {
    setAccountActiveFilterDate,
    setAccountCallDuration,
    setAccountListSearchText,
    setActiveRepAccounts,
    setActiveTeamAccounts,
} from "@store/accounts/actions";
import { Input } from "antd";
import React, { useContext, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SearchSvg from "app/static/svg/SearchSvg";
import { AccountsContext } from "../../../Accounts";
import ListPageFilters from "./ListPageFilters";

function ListingPageHeader(props) {
    const {
        accountListSlice: { count },
    } = useContext(AccountsContext);
    const ref = useRef();
    const dispatch = useDispatch();

    const [value, setValue] = useState("");

    const [searchActive, setSearchActive] = useState(false);

    const handleSearch = (e) => {
        dispatch(setAccountListSearchText(e.target.value));
        dispatch(setActiveTeamAccounts(0));
        dispatch(setActiveRepAccounts(0));

        dispatch(setAccountActiveFilterDate("all"));

        dispatch(setAccountCallDuration("0"));
    };

    return (
        <div className="flex justifySpaceBetween alignCenter flexShrink  posRel">
            <div>
                <div className="font24 bold700" role="heading" aria-level="2">
                    Accounts/Deals {count ? `(${count})` : null}
                </div>
                <div className="dove_gray_cl">Track your deals & accounts</div>
            </div>

            <div className="flex alignCenter posRel">
                <div className="search-container marginR28">
                    <Input
                        className={`search expandright ${
                            searchActive ? "search__active" : ""
                        }`}
                        id="searchright"
                        type="search"
                        placeholder={
                            searchActive
                                ? "Search for account name or number"
                                : ""
                        }
                        value={searchActive ? value : ""}
                        ref={ref}
                        onChange={(e) => setValue(e.target.value)}
                        onPressEnter={(e) => {
                            handleSearch(e);
                        }}
                    />
                    {value && (
                        <AntClose
                            onClick={() => {
                                setValue("");
                                dispatch(setAccountListSearchText(""));
                            }}
                        />
                    )}

                    <SearchSvg
                        onClick={() => {
                            if (ref.current && !searchActive)
                                ref.current.focus();
                            setSearchActive((prev) => !prev);
                        }}
                        className="button searchbutton"
                    />
                </div>
                <div className="font14 bold600 marginR15">FILTER BY</div>
                <ListPageFilters {...props} />
            </div>
        </div>
    );
}

export default ListingPageHeader;
