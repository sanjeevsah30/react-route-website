import { getTimeZone } from "@tools/helpers";
import {
    fields,
    models,
    types,
    getTopbarFilters,
    saidByPayload,
    getCallLevelStage,
    searchTagsFilters,
} from "@tools/searchFactory";
import { getMeetingField } from "tools/searchFactory";

export const prepareCIData = ({
    saidByFilter,
    topBarFilter,
    phrase,
    filters,
}) => {
    let preparedData = [];
    if (topBarFilter) {
        preparedData = [
            ...getTopbarFilters(topBarFilter),
            ...searchTagsFilters(
                topBarFilter?.activeCallTag?.length
                    ? topBarFilter.activeCallTag
                    : null
            ),
        ];
    }

    preparedData = [
        ...preparedData,
        saidByPayload(saidByFilter),
        ...getMeetingField(topBarFilter.meetingType),
    ];

    if (phrase) {
        preparedData = [
            ...preparedData,
            {
                name: fields.combined_ts_vector,
                model: models.transcript,
                type: types.SearchVectorField,
                search_attributes: {
                    exact: phrase,
                    negate: false,
                },
            },
        ];
    }
    if (filters?.stage) {
        preparedData = [...preparedData, ...getCallLevelStage(filters)];
    }
    return {
        search_data: preparedData,
        timezone: getTimeZone(),
    };
};
