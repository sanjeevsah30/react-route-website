import { List, ListItem } from "@mui/material";

export default function ExtrasToolTip({
    extras,
}: {
    extras: string[];
}): JSX.Element {
    return (
        <List sx={{ maxHeight: "200px" }} className="overflow-y-scroll">
            {extras.map((extra, idx) => (
                <ListItem sx={{ py: 0.2 }} key={idx}>
                    {extra}
                </ListItem>
            ))}
        </List>
    );
}
