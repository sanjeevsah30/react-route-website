import { createContext } from "react";
// import CommentCard from './CommentCard';

export default createContext({
    aiData: [],
    label: "Ai Call Score",
    closeDrawer: () => {},
    ai_score: 0,
});
