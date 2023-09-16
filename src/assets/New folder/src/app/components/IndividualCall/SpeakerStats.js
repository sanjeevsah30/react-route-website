import React from "react";

function SpeakerStats({
    talkRatio,
    longestMonologue,
    patience,
    questionRate,
    fillerRate,
    overlapRate,
    talkSpeed,
}) {
    return (
        <div className="heatmap__stat--popoverWrapper">
            <p className="heatmap__stat--title">Conversation Skills</p>
            <p className="font13 paddingB5 srchSummary__stats">
                <span className="text-bold">Talk Ratio:&nbsp;</span>
                <span>{(talkRatio * 100).toFixed(2)} %</span>
            </p>
            <p className="font13 paddingB5 srchSummary__stats">
                <span className="text-bold">Longest Monologue:&nbsp;</span>
                <span>{(longestMonologue / 60).toFixed(2)} min</span>
            </p>
            <p className="font13 paddingB5 srchSummary__stats">
                <span className="text-bold">Patience:&nbsp;</span>
                <span>{patience.toFixed(2)}</span>
            </p>
            <p className="font13 paddingB5 srchSummary__stats">
                <span className="text-bold">Question Count:&nbsp;</span>
                <span>{questionRate}</span>
            </p>
            <p className="font13 paddingB5 srchSummary__stats">
                <span className="text-bold">Filler Words:&nbsp;</span>
                <span>{Math.floor(fillerRate * 60)} words per min</span>
            </p>
            <p className="font13 paddingB5 srchSummary__stats">
                <span className="text-bold">Interruption Count:&nbsp;</span>
                <span>{overlapRate}</span>
            </p>
            <p className="font13 paddingB5 srchSummary__stats">
                <span className="text-bold">Talk Speed:&nbsp;</span>
                <span>{Math.floor(talkSpeed * 60)} words per min</span>
            </p>
        </div>
    );
}

export default SpeakerStats;
