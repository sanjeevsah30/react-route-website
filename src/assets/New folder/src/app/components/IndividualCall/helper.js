import IndividualCallConfig from "@constants/IndividualCall/index";
import { getParticipantType } from "@store/individualcall/actions";
import { secondsToTime } from "@tools/helpers";

export const generateSentimentMonologue = (obj) => {
    if (!obj) {
        return {};
    }

    const { negative = [], positive = [] } = obj;

    const sentimentMonologues = {};
    for (let transcript of [
        ...negative.map((e) => ({ ...e, sentiment_score: -1 })),
        ...positive.map((e) => ({ ...e, sentiment_score: 1 })),
    ]) {
        if (!sentimentMonologues[transcript?.speaker_name]) {
            sentimentMonologues[transcript?.speaker_name] = [];
        }
        sentimentMonologues[transcript?.speaker_name].push({
            startsAt: transcript.start_time,
            endsAt: transcript.end_time,
            color: transcript?.sentiment_score > 0 ? "#52C41A" : "#FC3E01",
            name: transcript.speaker_name,
            speaker_type: getParticipantType(transcript.speaker_type),
            type:
                transcript?.sentiment_score > 0
                    ? IndividualCallConfig.POSITIVE_MOMENTS
                    : IndividualCallConfig.NEGATIVE_MOMENTS,
        });
    }

    return sentimentMonologues;
};

export const generateSentimentMoments = (obj) => {
    if (!obj) {
        return {};
    }

    const { negative = [], positive = [] } = obj;
    const data = [
        ...negative.map((e) => ({ ...e, sentiment_score: -1 })),
        ...positive.map((e) => ({ ...e, sentiment_score: 1 })),
    ];
    const sentimentMonologues = {};
    for (let transcript of data) {
        if (!sentimentMonologues[transcript.speaker_name]) {
            sentimentMonologues[transcript.speaker_name] = {
                count: 0,
                data: [],
            };
        }
        const obj = {
            startsAt: transcript.start_time,
            endsAt: transcript.end_time,
            color: transcript?.sentiment_score > 0 ? "#52C41A" : "#FC3E01",
            name: transcript.speaker_name,
            speaker_type: getParticipantType(transcript.speaker_type),
            time: secondsToTime(transcript.start_time),
            text: transcript.headline,
            type:
                transcript?.sentiment_score > 0
                    ? IndividualCallConfig.POSITIVE_MOMENTS
                    : IndividualCallConfig.NEGATIVE_MOMENTS,
        };
        sentimentMonologues[transcript.speaker_name].data.push(obj);
    }

    return sentimentMonologues;
};
