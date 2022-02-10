import config from "./Engine.json";

import moment from "moment";
import { buildFacetsFromEngine, buildSortOptionsFromEngine, formatFieldName, getFilterableFacetsFromEngine, makeConfig } from "../GenericConfig";

export function buildPortfolioFacets() {
    var facets = buildFacetsFromEngine(config)

    facets["date_created"] = {
        type: "range",
        ranges: [
            {
                to: moment().subtract(5, "years").toISOString(),
                name: "More than 5 years ago"
            },
            {
                from: moment().subtract(5, "years").toISOString(),
                to: moment().toISOString(),
                name: "Within the last 5 years"
            },
            {
                from: moment().subtract(1, "years").toISOString(),
                name: "Within the last year"
            }
        ],
    }

    return facets;
}

export function formatPortfolioFieldName(field) {
    if (Object.keys(config.facetFieldNames || {}).includes(field)) {
        return config.facetFieldNames[field];
    } else {
        return formatFieldName(field);
    }
}

export function buildPortfolioSortOptions() {
    return buildSortOptionsFromEngine(config);
}

export function makePortfolioConfig(serviceUrl, searchUrl) {
    var facets = buildPortfolioFacets()

    return makeConfig(serviceUrl, searchUrl, config, facets);
}

export function getPortfolioFilterableFacets() {
    return getFilterableFacetsFromEngine(config);
}