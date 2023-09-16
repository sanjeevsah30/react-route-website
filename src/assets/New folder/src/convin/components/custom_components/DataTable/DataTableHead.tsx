import SortColumnSvg from "@convin/components/svg/SortColumnSvg";
import {
    Box,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Theme,
    useTheme,
} from "@mui/material";
import { uid } from "@convin/utils/UniqueId";
import { Columns, Order } from "./constants";

interface DataTableProps {
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: string,
        dataType: string | null
    ) => void;
    order: Order;
    orderBy: string;
    columns: Columns[];
}

export function DataTableHead(props: DataTableProps): JSX.Element {
    const { order, onRequestSort, columns, orderBy } = props;
    const theme: Theme = useTheme();
    // eslint-disable-next-line max-len
    const createSortHandler =
        (property: string, dataType: string | null) =>
        (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property, dataType);
        };

    const sortIconComponent = (
        sorting: boolean | undefined,
        columnId: string
    ): React.JSXElementConstructor<{ className: string }> | undefined | any => {
        if (sorting) {
            let upperColor = theme?.palette?.textColors?.[999];
            let lowerColor = theme?.palette?.textColors?.[999];
            if (orderBy === columnId) {
                if (order === "asc") upperColor = theme.palette.primary.main;
                else if (order === "desc")
                    lowerColor = theme.palette.primary.main;
            }
            return SortColumnSvg({
                sx: { fontSize: "0.8rem" },
                upperColor,
                lowerColor,
            });
        }

        return sorting;
    };

    return (
        <TableHead>
            <TableRow>
                {columns.map((column: Columns, i: number) => (
                    <TableCell
                        key={uid()}
                        align={column.alignHead}
                        colSpan={column.colSpan}
                        sx={{
                            p: 3,
                            pt: 5,
                            pr: 0,
                            ...column?.headCellSx,
                        }}
                    >
                        {column.sorting ? (
                            <TableSortLabel
                                active={column.id === orderBy}
                                key={uid()}
                                onClick={createSortHandler(
                                    column.id,
                                    column.dataType
                                )}
                                direction={
                                    orderBy === column.id ? order : undefined
                                }
                                IconComponent={() => null}
                                className="justify-between"
                                sx={{
                                    borderRight: "1px solid",
                                    borderColor: "divider",
                                    width: "100%",
                                    fontSize: "12px",
                                    paddingRight: "12px",
                                    fontWeight:
                                        column.id === orderBy && order
                                            ? theme.typography.fontWeightMedium
                                            : theme.typography
                                                  .fontWeightRegular,
                                    ...column?.innerHeadCellSx,
                                }}
                            >
                                {column.renderHead ? (
                                    column.renderHead(sortIconComponent, column)
                                ) : (
                                    <>
                                        {column.label}{" "}
                                        {sortIconComponent(
                                            column.sorting,
                                            column.id
                                        )}
                                    </>
                                )}
                            </TableSortLabel>
                        ) : (
                            <Box
                                key={uid()}
                                sx={{
                                    borderRight: "1px solid",
                                    borderColor: "divider",
                                    paddingRight: "12px",
                                    ...column?.innerHeadCellSx,
                                }}
                            >
                                {column.renderHead
                                    ? column.renderHead(null, column)
                                    : column.label}
                            </Box>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
