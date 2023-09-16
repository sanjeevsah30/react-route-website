import React, { useState, useEffect } from "react";
// import icons
import EditSvg from "./editsvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import { Tabs, Table, Button, Tooltip, Popconfirm, message } from "antd";

const { TabPane } = Tabs;

const TopicTable = ({
    topics,
    deleteTopicHandler,
    editTopicHandler,
    createdTopicId,
    isDeleting,
}) => {
    const [all_topics, setTopics] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const defaultKey = 0;

    useEffect(() => {
        setTopics([...topics]);
    }, [topics, deleted]);

    function callback(category_type) {
        // filter topics by category
        if (category_type === "All") {
            setTopics([...topics]);
        } else {
            const filtered_topics = topics.filter(
                (topic) => topic.category === category_type
            );
            setTopics([...filtered_topics]);
        }
    }

    // cleaning topic data
    topics = topics.map((topic) => {
        return (topic = {
            ...topic,
            category: topic.category?.name ? topic.category.name : "",
            last_edited_date: new Date(
                topic.last_edited_date
            ).toLocaleDateString("en-US"),
        });
    });
    let categories = [
        ...new Set(topics.map((el) => el.category.length > 0 && el.category)),
    ];
    categories.length > 0 && categories.unshift("All");
    categories = categories.filter((category) => category !== false);

    const columns = [
        {
            title: "Topic Name",
            dataIndex: "name",
            sorter: {
                compare: (a, b) => a.name.length - b.name.length,
            },
            render: (text) => {
                const t =
                    topics.length > 0 &&
                    topics.find((el) => el.id === createdTopicId);

                if (t?.name === text) {
                    return (
                        <div className="tag_container">
                            <p className="custom_text1">{text}</p>
                            <p className="tag">New</p>
                        </div>
                    );
                } else {
                    return <p className="custom_text1">{text}</p>;
                }
            },
        },
        {
            title: "Type / Category",
            dataIndex: "category",
            render: (text) => {
                return <p className="custom_text2">{text}</p>;
            },
        },
        {
            title: "Last Edited By",
            dataIndex: "last_edited_by",
            width: "20%",
            render: (text) => {
                return <p className="custom_text2">{text}</p>;
            },
        },
        {
            title: "Last Edited Date",
            dataIndex: "last_edited_date",
            render: (text) => {
                return <p className="custom_text2">{text}</p>;
            },
            sorter: {
                compare: (a, b) => {
                    const a_date = new Date(a.last_edited_date);
                    const b_date = new Date(b.last_edited_date);
                    return a_date.getTime() - b_date.getTime();
                },
            },
        },
        {
            title: "Action",
            dataIndex: "action",
        },
    ];

    function confirm(id) {
        deleteTopicHandler(id);
        setTopics(topics.filter((topic) => topic.id !== id));
        setDeleted(true);
        message.success("Topic Deleted Successfully");
    }

    function cancel() {
        return;
    }
    // console.log('Topics', topics);
    // console.log('All Topics', all_topics);

    all_topics.length > 0 &&
        all_topics.map(
            (el) =>
                (el.action = (
                    <div className="flex">
                        <Tooltip title="Edit">
                            <Button
                                icon={<EditSvg />}
                                onClick={() => {
                                    editTopicHandler(el.id);
                                }}
                                className="flex alignCenter justifyCenter"
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Popconfirm
                                title="Are you sure to delete this topic?"
                                onConfirm={() => confirm(el.id)}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    icon={<DeleteSvg />}
                                    disabled={isDeleting}
                                />
                            </Popconfirm>
                        </Tooltip>
                    </div>
                ))
        );

    return (
        <div className="table_container">
            <div className="table_container_header">
                {topics.length > 0 ? (
                    <Tabs defaultActiveKey={defaultKey} onChange={callback}>
                        {categories.map((tab) => (
                            <TabPane tab={tab} key={tab}>
                                <Table
                                    columns={columns}
                                    dataSource={all_topics}
                                />
                            </TabPane>
                        ))}
                    </Tabs>
                ) : (
                    <p>
                        {topics.length === 0
                            ? "No Topics Found!"
                            : "loading..."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TopicTable;
