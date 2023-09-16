import { getRandomInt } from "@tools/helpers";

export default function getSnippets() {
    return Promise.resolve(
        new Array(2000).fill(0).map((_, idx) => ({
            id: idx,
            owner: {
                first_name: ["John", "Evelyn", "Kathrina"][getRandomInt(0, 2)],
            },
            title: "ACME - Convin Product  Demo",
            updated: new Date().toISOString(),
            duration: "2 Min",
            comment: [
                "Aenean volutpat libero nec magna scelerisque imperdiet.",
                "",
            ][getRandomInt(0, 1)],
        }))
    );
}

export const getSnippetShareLinkAjx = (id) => {
    return Promise.resolve("http://dev.localhost:3000/call/1537");
};
