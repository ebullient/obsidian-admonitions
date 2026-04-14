import { Notice } from "obsidian";
import type { Admonition } from "../@types";

function startsWithAny(str: string, needles: string[]) {
    for (let i = 0; i < needles.length; i++) {
        if (str.startsWith(needles[i])) {
            return i;
        }
    }

    return false;
}

export function getParametersFromSource(
    type: string,
    src: string,
    admonition: Admonition,
) {
    const admonitionTitle =
        admonition.title ?? type[0].toUpperCase() + type.slice(1).toLowerCase();
    const keywordTokens = [
        "title:",
        "collapse:",
        "icon:",
        "color:",
        "metadata:",
    ];

    const keywords = ["title", "collapse", "icon", "color", "metadata"];

    const lines = src.split("\n");

    let skipLines = 0;

    const params: { [k: string]: string } = {};

    for (let i = 0; i < lines.length; i++) {
        const keywordIndex = startsWithAny(lines[i], keywordTokens);

        if (keywordIndex === false) {
            break;
        }

        const foundKeyword = keywords[keywordIndex];

        if (params[foundKeyword] !== undefined) {
            break;
        }

        params[foundKeyword] = lines[i]
            .slice(keywordTokens[keywordIndex].length)
            .trim();
        ++skipLines;
    }

    let { title, collapse, icon, color, metadata } = params;

    // If color is a legacy RGB triplet (e.g. "255, 0, 0"), wrap it
    if (color && /^\d+,\s*\d+,\s*\d+$/.test(color)) {
        color = `rgb(${color})`;
    }

    // rgb(...), hsl(...), and #hex are valid CSS — leave as-is

    // If color is in HSB format, convert it to rgb(...)
    if (color && (color.startsWith("hsb") || color.startsWith("hsv"))) {
        const [h, s, v] = color
            .slice(4, -1)
            .split(",")
            .map((str) => Number(str.replace("%", "").trim()));
        const [r, g, b] = hsbToRgb(h, s, v);
        color = `rgb(${r}, ${g}, ${b})`;
    }

    const content = lines.slice(skipLines).join("\n");

    /**
     * If the admonition should collapse, but something other than open or closed was provided, set to closed.
     */
    if (
        collapse !== undefined &&
        collapse !== "none" &&
        collapse !== "open" &&
        collapse !== "closed"
    ) {
        collapse = "closed";
    }

    if (!("title" in params)) {
        if (!admonition.noTitle) {
            title = admonitionTitle;
        }
    }
    /**
     * If the admonition should collapse, but title was blanked, set the default title.
     */
    if (
        title &&
        title.trim() === "" &&
        collapse !== undefined &&
        collapse !== "none"
    ) {
        title = admonitionTitle;
        new Notice("An admonition must have a title if it is collapsible.");
    }

    return { title, collapse, content, icon, color, metadata };
}

function hsbToRgb(h: number, s: number, b: number) {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const bNorm = b / 100;
    let r = 0;
    let g = 0;
    let bb = 0;
    const i = Math.floor(hNorm * 6);
    const f = hNorm * 6 - i;
    const p = bNorm * (1 - sNorm);
    const q = bNorm * (1 - f * sNorm);
    const t = bNorm * (1 - (1 - f) * sNorm);
    switch (i % 6) {
        case 0:
            r = bNorm;
            g = t;
            bb = p;
            break;
        case 1:
            r = q;
            g = bNorm;
            bb = p;
            break;
        case 2:
            r = p;
            g = bNorm;
            bb = t;
            break;
        case 3:
            r = p;
            g = q;
            bb = bNorm;
            break;
        case 4:
            r = t;
            g = p;
            bb = bNorm;
            break;
        case 5:
            r = bNorm;
            g = p;
            bb = q;
            break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(bb * 255)];
}
