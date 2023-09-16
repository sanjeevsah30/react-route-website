import React from "react";

export default function InteractionLegend() {
    return (
        <div className="interaction-legend row">
            <div className="col-6">
                <span className="legend-label"></span>
            </div>
            <div className="col-4 legend-detail">
                <div className="row">
                    <div className="col-4">
                        <span className="call-dot"></span>
                    </div>
                    <div className="col-20 legend-label">
                        <span>Call</span>
                    </div>
                </div>
            </div>
            <div className="col-6 legend-detail">
                <div className="row">
                    <div className="col-2">
                        <span className="team-avg"></span>
                    </div>
                    <div className="col-22 legend-label">
                        <span>Team's Avg</span>
                    </div>
                </div>
            </div>
            <div className="col-8 legend-detail">
                <div className="row">
                    <div className="col-4">
                        <span className="ideal-range"></span>
                    </div>
                    <div className="col-20 legend-label">
                        <span>Ideal Range</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
