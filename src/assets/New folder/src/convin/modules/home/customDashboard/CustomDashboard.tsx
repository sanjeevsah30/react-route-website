import { dashboardRoutes } from "app/components/AnalyticsDashboard/Constants/dashboard.constants";
import { Route, Switch } from "react-router-dom";
import CustomDashboardCreateView from "./components/CustomDashboardCreate";
import CustomDashboardView from "./components/CustomDashboardView";
import CustomDashboardStateProvider from "./context/CustomDahboardStateContext";

export default function CustomDashboard(): JSX.Element {
    return (
        <CustomDashboardStateProvider>
            <div className="height100p">
                <Switch>
                    <Route
                        exact
                        path={dashboardRoutes.custom}
                        render={() => <CustomDashboardCreateView />}
                    />
                    <Route
                        path={`${dashboardRoutes.custom}/:id`}
                        render={() => <CustomDashboardView />}
                    />
                </Switch>
            </div>
        </CustomDashboardStateProvider>
    );
}
