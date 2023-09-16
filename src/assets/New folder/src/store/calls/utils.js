import { getTopbarFilters } from "@tools/searchFactory";
export const prepareCallData = (data) => {
    const topbarData = {
        callDuration: data.activeCallDuration,
        repId: data.activeReps,
        teamId: data.activeTeam,
        startDate: data.activeDateRange[0],
        endDate: data.activeDateRange[1],
    };

    return getTopbarFilters(topbarData);
};
