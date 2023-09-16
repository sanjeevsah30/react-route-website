export interface CustomTrackingTab {
    contains_graph: boolean;
    id: numberboolean;
    is_removable: boolean;
    slug: string;
    sub_tabs: boolean;
    title: string;
}
export interface CIGraphData {
    id: number;
    distinct_meetings_graph_data: Array<Reacord<string, number>>;
    sentences_count_graph_data: Array<Reacord<string, number>>;
}
