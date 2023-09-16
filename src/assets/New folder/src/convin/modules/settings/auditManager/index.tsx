import { SettingRoutes } from "@convin/config/routes.config";
import { Route } from "react-router-dom";
import TemplateList from "./components/templates/TemplateList";
import TemplateCreateEditForm from "./components/templates/TemplateCreateEditForm";
import TemplateCategoryParameterView from "./components/templates/TemplateCategoryParameterView";

export default function AuditManager(): JSX.Element {
    return (
        <>
            <Route
                exact
                path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}`}
                render={() => <TemplateList />}
            />
            <Route
                exact
                path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/template/edit/:template_id`}
                render={() => <TemplateCreateEditForm />}
            />
            <Route
                exact
                path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/template/create`}
                render={() => <TemplateCreateEditForm />}
            />
            <Route
                exact
                path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/:template_id`}
                render={() => <TemplateCategoryParameterView />}
            />
            <Route
                exact
                path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/:template_id/category/:category_id`}
                render={() => <TemplateCategoryParameterView />}
            />
        </>
    );
}
