import PageFilters from "@presentational/PageFilters/PageFilters";

import { Col, Row, Button } from "antd";

import FillterSvg from "app/static/svg/FillterSvg";

function ListPageFilters({ openFilters }) {
    return (
        <Row gutter={[12, 12]}>
            <PageFilters
                durationPlaceholder={
                    "or Select Minimum and Maximum Account Level Duration"
                }
            />
            <Col>
                <Button
                    className="borderRadius4 capitalize flex alignCenter"
                    size={36}
                    onClick={openFilters}
                    style={{
                        height: "36px",
                    }}
                >
                    <FillterSvg
                        style={{
                            color: "#333333",
                        }}
                    />
                    <span>Filters</span>
                </Button>
            </Col>
        </Row>
    );
}

export default ListPageFilters;
