import React from "react";
import SearchIcon from "@mui/icons-material/Search";

type CustomSearchComponentPropType = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
};

function CustomSearchComponent({
    value,
    setValue,
    placeholder,
}: CustomSearchComponentPropType) {
    return (
        <div className="w-full h-[45px] bg-slate-100 rounded-md flex flex-row items-center border-1 border-[rgba(153, 153, 153, 0.1)] lg:w-3/5 md:w-3/4">
            <div className="px-4">
                <SearchIcon />
            </div>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-full outline-none bg-inherit rounded-md"
                placeholder={placeholder}
            />
        </div>
    );
}

export default CustomSearchComponent;
