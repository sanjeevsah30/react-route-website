import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { uid } from "@convin/utils/UniqueId";
import { DataTableHead } from "./DataTableHead";
import { PaginationAction } from "./PaginationAction";
import { getComparator, stableSort } from "./Sorting";
import { Columns, Order } from "./constants";
import ThreeDotsWave from "../ThreeDotsWave";

export default function DataTable({
    columns,
    data: rows,
    onRowClicked,
    children,
    lastElementRef = null,
    isLoading = false,
    pagination = true,
}: {
    columns: Columns[];
    data: any;
    onRowClicked?: (data: any) => void;
    children?: JSX.Element;
    isLoading?: boolean;
    lastElementRef?: any;
    pagination?: boolean;
}): JSX.Element {
    const [order, setOrder] = React.useState<Order>(undefined);
    const [orderBy, setOrderBy] = React.useState<string>("");
    const [columnDataType, setColumnDataType] = React.useState<string | null>(
        ""
    );
    const [page, setPage] = React.useState(0);
    const rowsPerPage = 8;
    const totalPages = Math.ceil(rows.length / rowsPerPage) - 1;

    const handleRequestSort = (
        event: React.MouseEvent<unknown, MouseEvent>,
        property: string,
        dataType: string | null
    ): void => {
        const isAsc = orderBy === property && order === "asc";
        const isDesc = orderBy === property && order === "desc";
        setOrder(isAsc ? "desc" : isDesc ? undefined : "asc");
        setOrderBy(property);
        setColumnDataType(dataType);
    };

    const handleChangePage = (event: unknown, newPage: number): void => {
        if (newPage === -1 || newPage > totalPages) return;
        setPage(newPage);
    };

    return (
        <Box sx={{ width: "100%", mb: 8 }}>
            <Paper sx={{ width: "100%", mb: 2, px: 3 }}>
                {children}
                <TableContainer>
                    <Table aria-labelledby="tableTitle" size="medium">
                        <DataTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            columns={columns}
                        />
                        <TableBody>
                            {stableSort(
                                rows,
                                order,
                                getComparator(order, orderBy, columnDataType)
                            ).map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={uid()}
                                        sx={{ position: "relative" }}
                                        ref={
                                            index + 1 === rows.length
                                                ? lastElementRef
                                                : null
                                        }
                                        onClick={() =>
                                            onRowClicked && onRowClicked(row)
                                        }
                                    >
                                        {columns.map((currentCol) => {
                                            const currentCellData =
                                                row[currentCol.id] !== null &&
                                                row[currentCol.id] !== undefined
                                                    ? row[currentCol.id]
                                                    : "";
                                            return (
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    key={uid()}
                                                    scope="row"
                                                    padding="none"
                                                    colSpan={currentCol.colSpan}
                                                    align={currentCol.alignData}
                                                    sx={{
                                                        fontSize: "14px",
                                                        fontWeight:
                                                            currentCol.fontWeight,
                                                        color: "textColors.333",
                                                        p: 3,
                                                        ...currentCol?.dataCellSx,
                                                    }}
                                                >
                                                    {currentCol.render
                                                        ? currentCol.render(row)
                                                        : currentCellData}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {Boolean(lastElementRef) && isLoading && <ThreeDotsWave />}
                {pagination && (
                    <TablePagination
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[]}
                        page={page}
                        onPageChange={handleChangePage}
                        ActionsComponent={() =>
                            PaginationAction({
                                page,
                                totalPages,
                                handleChangePage,
                            })
                        }
                        labelDisplayedRows={() => undefined}
                    />
                )}
            </Paper>
        </Box>
    );
}

DataTable.defaultProps = {
    children: undefined,
};
