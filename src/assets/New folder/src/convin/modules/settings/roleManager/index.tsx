import { SettingRoutes } from "@convin/config/routes.config";
import { Route, Switch } from "react-router-dom";
import RoleManagerList from "./components/RoleManagerList";

export default function RoleManager(): JSX.Element {
    return (
        <>
            <Switch>
                <Route
                    exact
                    path={`/settings/${SettingRoutes.ROLE_MANAGER.path}`}
                    render={() => <RoleManagerList />}
                />
            </Switch>
            /
        </>
    );
}
