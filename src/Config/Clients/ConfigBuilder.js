import config from "./Engine.json";

import moment from "moment";
import { buildFacetsFromEngine, buildSortOptionsFromEngine, formatFieldName, getFilterableFacetsFromEngine, makeConfig } from "../GenericConfig";

export function buildClientFacets() {
  var facets = buildFacetsFromEngine(config)

  facets["date_joined"] = {
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

  facets["date_of_birth"] = {
    type: "range",
    ranges: [
      {
        to: moment().subtract(66, "years").toISOString(),
        name: "Retirement age"
      },
      {
        from: moment().subtract(66, "years").toISOString(),
        to: moment().subtract(50, "years").toISOString(),
        name: "Older than 50, but not retirement age"
      },
      {
        from: moment().subtract(50, "years").toISOString(),
        to: moment().toISOString(),
        name: "Younger than 50"
      }
    ]
  }

  return facets;
}

export function formatClientFieldName(field) {
  if (Object.keys(config.facetFieldNames).includes(field)) {
    return config.facetFieldNames[field];
  } else {
    return formatFieldName(field);
  }
}

export function buildClientSortOptions() {
  return buildSortOptionsFromEngine(config);
}

export function makeClientConfig(serviceUrl, searchUrl) {
  var facets = buildClientFacets()

  return makeConfig(serviceUrl, searchUrl, config, facets);
}

export function getClientFilterableFacets() {
  return getFilterableFacetsFromEngine(config);
}