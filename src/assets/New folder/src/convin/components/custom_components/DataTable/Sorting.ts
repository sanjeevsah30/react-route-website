import { Order } from "./constants";

export function descendingComparator<Key extends keyof any>(
    a: { [key in Key]: any },
    b: { [key in Key]: any },
    orderBy: Key,
    columnDataType: string | null
): number {
    let firstValue: any =
        columnDataType !== "date" ? a[orderBy] : new Date(a[orderBy]).getTime();
    let secondValue: any =
        columnDataType !== "date" ? b[orderBy] : new Date(b[orderBy]).getTime();

    firstValue |= firstValue?.count;
    secondValue |= secondValue?.count;
    if (secondValue < firstValue) {
        return -1;
    }
    if (secondValue > firstValue) {
        return 1;
    }
    return 0;
}

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
    columnDataType: string | null
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy, columnDataType)
        : (a, b) => -descendingComparator(a, b, orderBy, columnDataType);
}

export function stableSort<T>(
    array: readonly T[],
    order: Order,
    comparator: (a: T, b: T) => number
): T[] {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    if (order === undefined) return stabilizedThis.map((el) => el[0]);
    stabilizedThis.sort((a, b) => {
        const value = comparator(a[0], b[0]);
        if (value !== 0) {
            return value;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
