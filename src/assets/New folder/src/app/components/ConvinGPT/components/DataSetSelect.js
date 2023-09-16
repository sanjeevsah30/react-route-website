import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { Select } from "antd";
import debounce from "lodash/debounce";
import Icon from "@presentational/reusables/Icon";

const { Option } = Select;
export default function DataSetSelect({
    fetchOptions,
    debounceTimeout = 500,
    optionsArr,
    nextLoading,
    onClear,
    NotFoundContent,
    handleSearch,
    className,
    suffixIcon,
    dropdownClassName,
    loadMore,
    ...props
}) {
    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([...optionsArr]);
    const fetchRef = React.useRef(0);
    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                handleSearch(value);
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    useEffect(() => {
        if (nextLoading)
            setOptions([
                ...optionsArr,
                {
                    label: "...LOADING",
                    value: "loading",
                    id: 0,
                },
            ]);
        else setOptions(optionsArr);
    }, [optionsArr, nextLoading]);
    return (
        <Select
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={
                fetching ? (
                    <div className="loading">
                        LOADING
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                ) : (
                    <NotFoundContent />
                )
            }
            {...props}
            showSearch
            onClear={onClear}
            className={className}
            suffixIcon={suffixIcon}
            popupClassName={dropdownClassName}
            onPopupScroll={loadMore}
        >
            {options.map(({ label, value, id }, idx) => (
                <Option
                    value={value}
                    key={id + id * idx}
                    disabled={id === "loading"}
                >
                    {label}
                </Option>
            ))}
        </Select>
    );
}

DataSetSelect.defaultProps = {
    onClear: () => {},
    handleSearch: () => {},
    className: "",
    suffixIcon: <Icon className="fas fa-chevron-down dove_gray_cl" />,
    dropdownClassName: "account_select_dropdown",
    loadMore: () => {},
};
