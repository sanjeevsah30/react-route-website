import { Tooltip } from "antd";
import { downloadableReports } from "../Constants/dashboard.constants";

export const getColumns = (columns = [], color_index = [], data) => {
    return [
        ...columns.map((key, index) => {
            const give_color = color_index.includes(index);

            const column = {
                title: (
                    <Tooltip destroyTooltipOnHide title={key}>
                        <div
                            style={
                                key.length > 30
                                    ? {
                                          width: "200px",
                                          textOverflow: "ellipsis",
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                      }
                                    : {
                                          display: "flex",
                                          justifyContent: `${
                                              index === 0 ? "" : "center"
                                          }`,
                                      }
                            }
                        >
                            {key}
                        </div>
                    </Tooltip>
                ),
                dataIndex: key,
                key,
                filters: Array.from(
                    new Set(
                        data.map((e) => {
                            return e[index];
                        })
                    )
                ).map((e) => {
                    return {
                        text: e,
                        value: e,
                    };
                }),
                filterSearch: true,
                onFilter: (value, record) =>
                    Object.values(record)?.includes(value),
                render: (text) => {
                    const color = give_color
                        ? text < 50
                            ? "bitter_sweet_bg50 bold600 justifyCenter"
                            : text < 75
                            ? "average_orng_bg50 bold600 justifyCenter"
                            : "lima_bg50 bold600 justifyCenter"
                        : index === 0
                        ? "bold600"
                        : text === null
                        ? "justifyCenter dusty_gray_bg_10_percent "
                        : "newBlue_bg10 justifyCenter";
                    return (
                        <div
                            style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                borderRadius: "6px",
                                ...(index === 0 && {
                                    fontSize: "14px",
                                }),
                                // justifyContent: 'center',
                            }}
                            className={`flex paddingLR16 paddingTB14 font16 ${color}`}
                        >
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: text === null ? "N/A" : text,
                                }}
                            />
                            <span className="mariginL4">
                                {key.includes("%") ? "%" : ""}
                            </span>
                        </div>
                    );
                },
                showSorterTooltip: false,
            };
            if (key.length > 30) {
                column.width = 200;
            }
            if (index === 0) {
                column.fixed = "left";
            }
            if (give_color) {
                column.sorter = (a, b) => a[key] - b[key];
            }
            return column;
        }),
    ];
};

export const getReportsJson = (data = [], columns = []) => {
    const json = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (!json[i]) json[i] = { id: i };
            json[i][columns[j]] = data[i][j];
        }
    }
    return json;
};

export const isOnlyDownloadableReport = (reportName) => {
    return downloadableReports.has(reportName);
};
