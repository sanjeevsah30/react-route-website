import React from "react";
import { Card } from "antd";

const { Meta } = Card;
const TourCard = ({ title, onClick }) => {
    return (
        <Card
            hoverable
            style={{ minWidth: 240 }}
            onClick={onClick}
            className="tour-card"
        >
            <Meta title={title} />
        </Card>
    );
};

export default TourCard;
