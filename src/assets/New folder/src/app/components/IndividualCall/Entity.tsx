import { useHistory } from "react-router-dom";
import NoDataSvg from "app/static/svg/NoDataSvg";
import { flattenObject } from "tools/helpers";
import { Box, Typography } from "@mui/material";
import StarFeatureSvg from "@convin/components/svg/StarFeatureSvg";
import { alpha } from "@mui/system";
import BorderedBox from "@convin/components/custom_components/BorderedBox";

interface MyObject {
    [key: string]: any;
}

const Entity = ({ notes }: any): JSX.Element => {
    const history = useHistory();
    const formatedCustom_ner: MyObject = flattenObject(
        notes?.ner_config?.custom_ner
    );
    return (
        <BorderedBox
            sx={{
                background: "common.white",
                borderRadius: "6px",
                pl: 2.5,
                mb: 3,
                pr: 1,
                py: 2.5,
            }}
        >
            <Box>
                <StarFeatureSvg sx={{ mr: 1 }} />
                <Typography className="font-semibold" variant="medium">
                    Custom Entity
                </Typography>
            </Box>
            {notes &&
            !!Object.keys(notes).length &&
            notes?.ner_config &&
            !!Object.keys(notes?.ner_config)?.length ? (
                <>
                    {!!notes?.ner_config && (
                        <Box
                            sx={{
                                mt: 2,
                                maxHeight: "164px",
                            }}
                            className="overflow-y-scroll"
                        >
                            {formatedCustom_ner &&
                            !!Object.keys(formatedCustom_ner)?.length ? (
                                Object.keys(formatedCustom_ner).map(
                                    (item, idx) => (
                                        <Box
                                            display="grid"
                                            gridTemplateColumns="repeat(12, 1fr)"
                                            gap={3}
                                            key={idx}
                                            sx={{ mb: 1 }}
                                        >
                                            <Box gridColumn="span 4">
                                                <span>{item}</span>
                                            </Box>
                                            <Box gridColumn="span 8">
                                                <Typography
                                                    className="font-semibold"
                                                    variant="medium"
                                                    sx={{
                                                        color: "#333333",
                                                    }}
                                                >
                                                    {formatedCustom_ner[
                                                        item
                                                    ] === null
                                                        ? "-"
                                                        : formatedCustom_ner[
                                                              item
                                                          ]}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )
                                )
                            ) : (
                                <Box className="flex flex-col items-center justify-center">
                                    <NoDataSvg />
                                    <Typography variant="medium">
                                        There are no entities which are
                                        configured.
                                    </Typography>
                                    <Box
                                        className="curPoint primary"
                                        onClick={() => {
                                            history.push("/settings/notes");
                                        }}
                                    >
                                        Click to configure
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </>
            ) : (
                <Box className="flex flex-col items-center justify-center">
                    <NoDataSvg />
                    <Typography>No Data</Typography>
                </Box>
            )}
        </BorderedBox>
    );
};

export default Entity;
