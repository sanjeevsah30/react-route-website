import { Row } from "antd";
import React, { useEffect, useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMove } from "react-sortable-hoc";

import { useDispatch, useSelector } from "react-redux";
import { openNotification } from "@store/common/actions";
import apiErrors from "@apis/common/errors";

const SortableItem = SortableElement(({ value, rest }) => {
    const { Component } = rest;
    return <Component item={value} {...rest} />;
});

const SortableList = SortableContainer(({ items, rest }) => {
    return (
        <Row gutter={rest.gutter}>
            {items.map((item, index) => (
                <SortableItem
                    key={item.id}
                    index={index}
                    value={item}
                    rest={rest}
                />
            ))}
        </Row>
    );
});

function SortableFuctionComponent({ data, ...rest }) {
    const [items, setItems] = useState(data || []);
    const { save, action } = rest;
    const { domain } = useSelector((state) => state.common);
    const dispatch = useDispatch();
    useEffect(() => {
        setItems(data);
    }, [data]);
    return (
        <SortableList
            axis="xy"
            items={items}
            onSortEnd={({ oldIndex, newIndex }) => {
                document.body.className = "";
                const newOrder = arrayMove(items, oldIndex, newIndex);
                setItems(newOrder);
                save(
                    domain,
                    newOrder.map(({ id }, index) => ({ id, seq_no: index + 1 }))
                ).then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    }
                    dispatch(
                        action(
                            newOrder.map((item, index) => ({
                                ...item,
                                seq_no: index + 1,
                            }))
                        )
                    );
                });
            }}
            onSortStart={() => (document.body.className = "grabbing")}
            rest={rest}
        />
    );
}

SortableFuctionComponent.defaultPorps = {
    save: () => {},
};

export default SortableFuctionComponent;
