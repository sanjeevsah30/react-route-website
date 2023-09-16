import LeftArrowSvg from "@convin/components/svg/LeftArrowSvg";
import { useHistory } from "react-router-dom";

export default function GoBack({ path }: { path: string }): JSX.Element {
    const history = useHistory();
    return (
        <span onClick={() => history.push(path)} className="cursor-pointer">
            <LeftArrowSvg />
        </span>
    );
}
