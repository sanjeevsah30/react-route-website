import { createContext } from "react";

export default createContext({
    graph: [],
    graphContainer: null,
    loading: false,
    headerStyle: {},
    isAccountsGraph: false,
    callId: null,
    sales_task: {},
});
