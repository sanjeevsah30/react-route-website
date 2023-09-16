import Icon from "@presentational/reusables/Icon";
import { Select } from "antd";
import React, { Fragment } from "react";
import "./style.scss";
import { emptyCache, getDisplayName, getDomain, uid } from "@tools/helpers";

function CustomMultipleSelect({
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
    ...rest
}) {
    return (
        <Select
            name="tags"
            mode="multiple"
            placeholder={placeholder}
            onChange={onChange}
            className={className}
            value={value}
            showSearch
            optionFilterProp="children"
            suffixIcon={<Icon className="fas fa-chevron-down dove_gray_cl" />}
            popupClassName={"custom_select_dropdown"}
            disabled={isDisabled}
            {...rest}
        >
            {type === "team"
                ? data.map((team) => {
                      return team?.subteams?.length ? (
                          <Select.OptGroup label={team.name} key={team.id}>
                              {team.subteams.map((team) => (
                                  <Select.Option key={team.id}>
                                      {team.name}
                                  </Select.Option>
                              ))}
                          </Select.OptGroup>
                      ) : (
                          <Select.Option key={team.id}>
                              {team.name}
                          </Select.Option>
                      );
                  })
                : type === "topic"
                ? data?.map((item) => (
                      <Select.Option key={item.id} value={item[option_name]}>
                          {item[option_name]}
                      </Select.Option>
                  ))
                : data?.map((item) => (
                      <Select.Option key={item.id}>
                          {type === "user"
                              ? getDisplayName(item)
                              : item[option_name]}
                      </Select.Option>
                  ))}
        </Select>
    );
}

export default CustomMultipleSelect;
