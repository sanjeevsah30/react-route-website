import { useEffect, useState } from "react";
import CustomPopover from "@convin/components/custom_components/Popover/CustomPopover";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    useTheme,
    Typography,
} from "@mui/material";
import SearchSvg from "@convin/components/svg/SearchSvg";
import { FilterData } from "@convin/type/UserManager";
import { Label } from "@convin/components/custom_components/Typography/Label";

interface FilterProps<A> {
    anchorEl: HTMLDivElement | null;
    onClose: () => void;
    onSelected: (filters: FilterData[]) => void;
    filters: FilterData[];
    selectedFilters: FilterData[];
}

const FilterTableColumn = <A,>({
    anchorEl,
    onClose,
    onSelected,
    filters,
    selectedFilters,
}: FilterProps<A>): JSX.Element => {
    const [filterSearch, setFilterSearch] = useState<string>("");
    const [data, setData] = useState<FilterData[]>(filters);
    const [currentFilters, setCurrentFilters] =
        useState<FilterData[]>(selectedFilters);

    useEffect(() => {
        setCurrentFilters(selectedFilters);
    }, []);

    useEffect(() => {
        if (filterSearch !== "") {
            const filteredData = filters.filter(({ label }) => {
                return label.toLowerCase().includes(filterSearch.toLowerCase());
            });
            setData(filteredData);
        } else setData(filters);
    }, [filterSearch]);

    const handleApplyFilters = () => {
        onSelected(currentFilters);
        onClose();
    };

    const isFilterSelected = (filter: FilterData) => {
        return currentFilters?.some((curr) => curr.label === filter.label);
    };

    return (
        <CustomPopover anchorEl={anchorEl} onClose={onClose}>
            <TextField
                size="small"
                sx={{
                    width: "100%",
                    ".MuiInputBase-input": {
                        py: 1,
                        height: "30px",
                    },
                    ".MuiInputAdornment-root": {
                        mt: "0px !important",
                    },
                }}
                placeholder="Search in filters"
                variant="filled"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchSvg sx={{ color: "grey.999" }} />
                        </InputAdornment>
                    ),
                }}
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
            />
            <Box sx={{ p: 1, maxHeight: "300px", overflowY: "scroll" }}>
                {data.length > 0 ? (
                    data.map((item, index) => {
                        const { label } = item;
                        return (
                            <Typography
                                component="li"
                                key={index}
                                className="list-none select-none"
                                sx={{
                                    color: (theme) =>
                                        theme.palette.textColors[333],
                                }}
                                onClick={() => {
                                    if (isFilterSelected(item)) {
                                        setCurrentFilters(
                                            currentFilters?.filter(
                                                (filter) =>
                                                    filter.label !== item.label
                                            )
                                        );
                                    } else {
                                        setCurrentFilters([
                                            ...currentFilters,
                                            item,
                                        ]);
                                    }
                                }}
                            >
                                <Checkbox
                                    key={index}
                                    size="small"
                                    sx={{ mr: 1 }}
                                    checked={isFilterSelected(item)}
                                />
                                {label}
                            </Typography>
                        );
                    })
                ) : (
                    <Label
                        className="font-semibold mx-auto text-center"
                        variant="body1"
                        colorType="999"
                        sx={(theme) => ({
                            fontSize: theme.spacing(1.5),
                            m: 2,
                        })}
                    >
                        Not Found
                    </Label>
                )}
            </Box>
            <Divider />
            <Stack direction="row" justifyContent="space-between" sx={{ p: 1 }}>
                <Button onClick={() => setCurrentFilters([])}>RESET</Button>
                <Button
                    variant="global"
                    sx={{ px: 1 }}
                    onClick={handleApplyFilters}
                >
                    OK
                </Button>
            </Stack>
        </CustomPopover>
    );
};

export default FilterTableColumn;
