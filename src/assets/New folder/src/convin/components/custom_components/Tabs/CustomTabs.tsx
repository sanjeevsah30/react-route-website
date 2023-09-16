import { Tab, Box, Tabs, Typography } from "@mui/material";
import { useState } from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface CustomTabsProps {
    tabs: Array<{
        label: string;
        content: JSX.Element;
    }>;
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export const CustomTabs = ({ tabs }: CustomTabsProps): JSX.Element => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ px: 1, borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    {tabs.map(({ label }, index) => (
                        <Tab
                            sx={{ px: 0, mx: 2 }}
                            key={index}
                            label={label}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
            </Box>
            {tabs.map(({ content }, index) => (
                <TabPanel key={index} value={value} index={index}>
                    {content}
                </TabPanel>
            ))}
        </>
    );
};
