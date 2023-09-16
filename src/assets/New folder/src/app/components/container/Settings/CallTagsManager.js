import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTags, createNewTag } from "@store/common/actions";
import CallTagsManagerUI from "@presentational/Settings/CallTagsManagerUi";

export default function CallTagsManager() {
    const dispatch = useDispatch();
    const allTags = useSelector((state) => state.common.tags);
    const [newTag, setnewTag] = useState("");

    useEffect(() => {
        if (!allTags.length) {
            dispatch(getTags());
        }
    }, []);

    const handleChange = (e) => {
        setnewTag(e.target.value);
    };

    const addTag = (e) => {
        if (newTag) {
            dispatch(createNewTag(newTag));
        }
        setnewTag("");
    };

    return (
        <CallTagsManagerUI
            tags={allTags}
            addTag={addTag}
            handleChange={handleChange}
            newTag={newTag}
        />
    );
}
