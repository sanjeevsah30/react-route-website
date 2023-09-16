import { Table } from "antd";
import React, { useEffect, useState } from "react";

function ReportTable({
    columns,
    dataSource,
    onChange,
    total,
    filterDates,
    onRow,
    rowKey,
    dependency = [],
}) {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterDates, ...dependency]);

    let myAttr = { "data-testid": "component-report-table" };

    return (
        <Table
            className="marginB30 auditor_list_table"
            columns={columns}
            rowKey={rowKey}
            dataSource={dataSource}
            scroll={{ x: "max-content" }}
            onChange={onChange}
            pagination={{
                total: total,
                current: currentPage,
                onChange: (page, pageSize) => {
                    setCurrentPage(page);
                },
            }}
            onRow={onRow}
            {...myAttr}
        />
    );
}

ReportTable.defaultProps = {
    columns: [],
    dataSource: [],
    onChange: () => {},
    total: 0,
    onRow: () => {},
    rowKey: "id",
};

export default ReportTable;
