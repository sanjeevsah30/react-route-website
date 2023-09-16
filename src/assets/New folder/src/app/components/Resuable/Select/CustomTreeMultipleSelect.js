import { TreeSelect } from "antd";
import Icon from "@presentational/reusables/Icon";
import "./style.scss";
import { flattenTeams } from "../../../../tools/helpers";

const CustomTreeMultipleSelect = ({
    data = [],
    onChange,
    value,
    className = "select",
    option_name,
    option_key,
    type,
    placeholder,
    isDisabled = false,
    filter_type,
    popupClassName,
    allowClear,
    showSearch,
    ...rest
}) => {
    return (
        <TreeSelect
            name="tags"
            allowClear={allowClear}
            treeCheckable
            placeholder={placeholder}
            onChange={onChange}
            className={className}
            value={value}
            showArrow={true}
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            showSearch
            autoClearSearchValue={false}
            treeData={
                data?.length
                    ? [
                          {
                              name:
                                  value?.length > 0 ? (
                                      <span
                                          onClick={() => onChange([])}
                                          style={{
                                              display: "inline-block",
                                              color: "#286FBE",
                                              cursor: "pointer",
                                          }}
                                      >
                                          Unselect all
                                      </span>
                                  ) : (
                                      <span
                                          onClick={() => {
                                              if (type === "team") {
                                                  onChange(
                                                      flattenTeams(data).map(
                                                          ({ id }) => id
                                                      )
                                                  );
                                              } else {
                                                  onChange(
                                                      data.map(({ id }) => id)
                                                  );
                                              }
                                          }}
                                          style={{
                                              display: "inline-block",
                                              color: "#286FBE",
                                              cursor: "pointer",
                                          }}
                                      >
                                          Select all
                                      </span>
                                  ),
                              id: 0,
                              disableCheckbox: true,
                              disabled: true,
                          },
                          ...data,
                      ]
                    : []
            }
            suffixIcon={<Icon className="fas fa-chevron-down dove_gray_cl" />}
            popupClassName={`custom_select_dropdown ${popupClassName}`}
            disabled={isDisabled}
            {...rest}
        />
    );
};

export default CustomTreeMultipleSelect;
