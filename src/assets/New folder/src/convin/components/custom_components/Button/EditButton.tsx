import { EditSvg } from "@convin/components/svg";
import { FunctionComponent } from "react";
import { CrudButtonWrapper } from "./CrudButtonWrapper";

export const EditButton: FunctionComponent<{ onClick: () => void }> = ({
    onClick,
}) => (
    <CrudButtonWrapper {...{ onClick }}>
        <EditSvg />
    </CrudButtonWrapper>
);
