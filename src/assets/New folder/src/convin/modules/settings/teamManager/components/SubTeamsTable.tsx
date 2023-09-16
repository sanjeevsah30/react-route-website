import { SubteamTableData } from "@convin/type/Team";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
} from "@mui/material";
import { alpha } from "@mui/system";

const subTeamColumns: Array<{
    field: "name" | "count";
    headerName: string;
    width: string;
    align: "left" | "center";
}> = [
    {
        field: "name",
        headerName: "Sub Team",
        width: "63%",
        align: "left",
    },

    {
        field: "count",
        headerName: "Members Count",
        width: "37%",
        align: "center",
    },
];

const SubTeamsTable = ({ data }: { data: SubteamTableData[] }): JSX.Element => {
    const theme = useTheme();
    return (
        <TableContainer component={Paper}>
            {data?.length ? (
                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                            }}
                        >
                            {subTeamColumns.map(
                                ({ headerName, width, align }, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            color: "primary.main",
                                            width,
                                            textAlign: align,
                                            fontSize: "12px",
                                            pl: 4,
                                        }}
                                        className="font-normal"
                                    >
                                        {headerName}
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((subTeam: SubteamTableData) => (
                            <TableRow key={subTeam.id}>
                                {subTeamColumns.map(
                                    ({ field, width, align }, index) => {
                                        return (
                                            <TableCell
                                                key={`row.id-${field}`}
                                                sx={{
                                                    width,
                                                    textAlign: align,
                                                    paddingLeft:
                                                        index === 0 ? 4 : 2,
                                                    fontWeight:
                                                        index === 0
                                                            ? "600"
                                                            : "400",
                                                }}
                                            >
                                                {subTeam[field]}
                                            </TableCell>
                                        );
                                    }
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <Box
                    className="flex justify-center items-center font-semibold"
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        py: 1,
                    }}
                >
                    No Sub-teams available
                </Box>
            )}
        </TableContainer>
    );
};

export default SubTeamsTable;
