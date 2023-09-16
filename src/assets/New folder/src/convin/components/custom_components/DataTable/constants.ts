import { jsx } from "@emotion/react";
import { ReactElement } from "react";

export interface Columns {
    id: string;
    dataType: string | null;
    label: string;
    sorting?: boolean;
    render?: (data: any) => JSX.Element;
    renderHead?: (
        sortIcon:
            | null
            | ((
                  sorting: boolean | undefined,
                  columnId: string
              ) => ReactElement),
        column: Columns
    ) => JSX.Element;
    alignHead?: Align;
    fontWeight?: number;
    colSpan?: number;
    headCellSx?: any;
    innerHeadCellSx?: any;
    dataCellSx?: any;
    alignData?: Align;
}
export type Order = "asc" | "desc" | undefined;
export type Align =
    | "inherit"
    | "left"
    | "center"
    | "right"
    | "justify"
    | undefined;
