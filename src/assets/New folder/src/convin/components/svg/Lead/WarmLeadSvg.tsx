import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";
<svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
></svg>;

export default function WarmLeadSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 16 16"
            sx={{ ...sx, width: 16, height: 16, fill: "none" }}
        >
            <path
                d="M15.5 10.0001C15.5 10.1327 15.4473 10.2599 15.3536 10.3536C15.2598 10.4474 15.1326 10.5001 15 10.5001H1C0.867392 10.5001 0.740215 10.4474 0.646447 10.3536C0.552678 10.2599 0.5 10.1327 0.5 10.0001C0.5 9.86747 0.552678 9.74029 0.646447 9.64652C0.740215 9.55275 0.867392 9.50008 1 9.50008H3.52813C3.50967 9.33404 3.50028 9.16713 3.5 9.00008C3.5 7.8066 3.97411 6.66201 4.81802 5.8181C5.66193 4.97418 6.80653 4.50008 8 4.50008C9.19347 4.50008 10.3381 4.97418 11.182 5.8181C12.0259 6.66201 12.5 7.8066 12.5 9.00008C12.4997 9.16713 12.4903 9.33404 12.4719 9.50008H15C15.1326 9.50008 15.2598 9.55275 15.3536 9.64652C15.4473 9.74029 15.5 9.86747 15.5 10.0001ZM13 12.0001H3C2.86739 12.0001 2.74021 12.0528 2.64645 12.1465C2.55268 12.2403 2.5 12.3675 2.5 12.5001C2.5 12.6327 2.55268 12.7599 2.64645 12.8536C2.74021 12.9474 2.86739 13.0001 3 13.0001H13C13.1326 13.0001 13.2598 12.9474 13.3536 12.8536C13.4473 12.7599 13.5 12.6327 13.5 12.5001C13.5 12.3675 13.4473 12.2403 13.3536 12.1465C13.2598 12.0528 13.1326 12.0001 13 12.0001ZM5.0525 3.72383C5.08188 3.78259 5.12255 3.835 5.17219 3.87805C5.22182 3.92109 5.27945 3.95394 5.34178 3.97472C5.40412 3.9955 5.46993 4.0038 5.53547 3.99914C5.601 3.99448 5.66498 3.97696 5.72375 3.94758C5.78252 3.91819 5.83492 3.87752 5.87797 3.82789C5.92102 3.77825 5.95387 3.72062 5.97465 3.65829C5.99542 3.59596 6.00372 3.53015 5.99906 3.46461C5.9944 3.39907 5.97688 3.33509 5.9475 3.27633L5.4475 2.27633C5.38816 2.15764 5.2841 2.06739 5.15822 2.02543C5.03233 1.98347 4.89493 1.99323 4.77625 2.05258C4.65757 2.11192 4.56732 2.21598 4.52535 2.34186C4.48339 2.46775 4.49316 2.60514 4.5525 2.72383L5.0525 3.72383ZM1.27625 6.44758L2.27625 6.94758C2.39485 7.00692 2.53217 7.01672 2.65799 6.97481C2.78382 6.93291 2.88785 6.84274 2.94719 6.72414C3.00653 6.60554 3.01633 6.46822 2.97442 6.34239C2.93252 6.21657 2.84235 6.11254 2.72375 6.0532L1.72375 5.5532C1.66502 5.52382 1.60109 5.50629 1.53559 5.50162C1.47009 5.49694 1.40431 5.50522 1.34201 5.52596C1.2797 5.54671 1.2221 5.57953 1.17248 5.62254C1.12286 5.66555 1.0822 5.71791 1.05281 5.77664C1.02343 5.83536 1.0059 5.8993 1.00123 5.9648C0.996554 6.0303 1.00483 6.09608 1.02558 6.15838C1.04632 6.22069 1.07914 6.27829 1.12215 6.32791C1.16516 6.37753 1.21752 6.41819 1.27625 6.44758ZM13.5 7.00008C13.5774 7.00009 13.6538 6.98212 13.7231 6.94758L14.7231 6.44758C14.7819 6.41819 14.8342 6.37753 14.8772 6.32791C14.9202 6.27829 14.9531 6.22069 14.9738 6.15838C14.9945 6.09608 15.0028 6.0303 14.9981 5.9648C14.9935 5.8993 14.9759 5.83536 14.9466 5.77664C14.9172 5.71791 14.8765 5.66555 14.8269 5.62254C14.7773 5.57953 14.7197 5.54671 14.6574 5.52596C14.5951 5.50522 14.5293 5.49694 14.4638 5.50162C14.3983 5.50629 14.3344 5.52382 14.2756 5.5532L13.2756 6.0532C13.175 6.1037 13.0944 6.18668 13.0468 6.2887C12.9992 6.39072 12.9874 6.50582 13.0134 6.61537C13.0393 6.72491 13.1015 6.82249 13.1898 6.89231C13.2781 6.96213 13.3874 7.0001 13.5 7.00008ZM10.2762 3.94758C10.335 3.977 10.399 3.99456 10.4645 3.99924C10.5301 4.00392 10.5959 3.99563 10.6583 3.97485C10.7206 3.95407 10.7782 3.9212 10.8279 3.87813C10.8775 3.83506 10.9181 3.78262 10.9475 3.72383L11.4475 2.72383C11.5068 2.60514 11.5166 2.46775 11.4746 2.34186C11.4327 2.21598 11.3424 2.11192 11.2238 2.05258C11.1051 1.99323 10.9677 1.98347 10.8418 2.02543C10.7159 2.06739 10.6118 2.15764 10.5525 2.27633L10.0525 3.27633C10.0231 3.33508 10.0055 3.39907 10.0008 3.46462C9.99616 3.53016 10.0044 3.59599 10.0252 3.65833C10.046 3.72068 10.0789 3.77831 10.1219 3.82794C10.165 3.87757 10.2175 3.91823 10.2762 3.94758Z"
                fill="#F8AA0D"
            />
        </SvgIcon>
    );
}

WarmLeadSvg.defaultProps = {
    sx: {},
};