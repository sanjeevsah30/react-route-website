import { Box, Button, Divider, Typography, Grid } from "@mui/material";
import { FunctionComponent, useState } from "react";
import CreateEditFieldModal from "./components/CreateEditFieldModal";
import QmsStateProvider from "./context/QmsStateContext";
import NoDataSvg from "@convin/components/svg/NoDataSvg";
import { useGetManualQmsFieldsListQuery } from "@convin/redux/services/settings/qms.service";
import PageLoader from "@convin/components/custom_components/PageLoader";
import QmsFieldComponent from "./components/QmsFieldComponent";

const QmsManager = (): JSX.Element => {
    const [openModal, setOpenModal] = useState(false);
    const { data, isFetching } = useGetManualQmsFieldsListQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const defaultFields =
        data?.filter((item) => item.card_type === "default") || [];
    const customFields =
        data?.filter((item) => item.card_type === "custom") || [];

    return (
        <>
            {isFetching ? (
                <PageLoader />
            ) : (
                <QmsStateProvider>
                    <div>
                        <Box
                            className="flex justify-between items-center"
                            sx={{
                                mb: 2.5,
                                px: 2.5,
                                pt: 2.5,
                            }}
                        >
                            <Typography
                                variant="h4"
                                className="font-semibold"
                                sx={{ color: "grey.333" }}
                            >
                                Manual QMS
                            </Typography>
                            <Button
                                variant="global"
                                onClick={() => {
                                    setOpenModal(true);
                                }}
                                sx={{ py: 1, px: 3 }}
                            >
                                + Custom Field
                            </Button>
                        </Box>
                        <Divider />
                        {data?.length !== 0 ? (
                            <Box>
                                {defaultFields?.length ? (
                                    <>
                                        <Box
                                            className="flex flex-col"
                                            sx={{ p: 3 }}
                                        >
                                            <SectionHeading
                                                heading="Default Fields"
                                                subHeading=" These fields are not editable."
                                            />
                                            <Grid
                                                container
                                                rowSpacing={2}
                                                columnSpacing={4}
                                            >
                                                {defaultFields.map(
                                                    (field, index) => (
                                                        <Grid
                                                            item
                                                            key={index}
                                                            xs={11}
                                                            lg={5}
                                                        >
                                                            <QmsFieldComponent
                                                                field={field}
                                                                setOpenModal={
                                                                    setOpenModal
                                                                }
                                                            />
                                                        </Grid>
                                                    )
                                                )}
                                            </Grid>
                                        </Box>
                                        <Box sx={{ px: 2.5 }}>
                                            <Divider />
                                        </Box>
                                    </>
                                ) : (
                                    <></>
                                )}
                                {customFields?.length ? (
                                    <Box
                                        className="flex flex-col"
                                        sx={{ p: 3 }}
                                    >
                                        <SectionHeading
                                            heading=" Custom Fields"
                                            subHeading="These fields are customizable."
                                        />
                                        <Grid
                                            container
                                            rowSpacing={2}
                                            columnSpacing={4}
                                        >
                                            {customFields.map(
                                                (field, index) => (
                                                    <Grid
                                                        item
                                                        key={index}
                                                        xs={11}
                                                        lg={5}
                                                    >
                                                        <QmsFieldComponent
                                                            field={field}
                                                            setOpenModal={
                                                                setOpenModal
                                                            }
                                                        />
                                                    </Grid>
                                                )
                                            )}
                                        </Grid>
                                    </Box>
                                ) : (
                                    <></>
                                )}
                            </Box>
                        ) : (
                            <Box
                                className="flex items-center justify-center flex-col"
                                sx={{ height: "80vh" }}
                            >
                                <NoDataSvg />
                                <Typography
                                    variant="h5"
                                    className="font-semibold"
                                    sx={{ color: "grey.333" }}
                                >
                                    No Data
                                </Typography>
                            </Box>
                        )}
                    </div>
                    <CreateEditFieldModal
                        open={openModal}
                        onClose={() => {
                            setOpenModal(false);
                        }}
                    />
                </QmsStateProvider>
            )}
        </>
    );
};

const SectionHeading: FunctionComponent<{
    heading: string;
    subHeading: string;
}> = ({ heading, subHeading }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography
                variant="h6"
                className="font-semibold"
                sx={{ color: "grey.333" }}
            >
                {heading}
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.999" }}>
                {subHeading}
            </Typography>
        </Box>
    );
};

export default QmsManager;
