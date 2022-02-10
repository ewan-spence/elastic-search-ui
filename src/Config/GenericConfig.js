import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector/lib/AppSearchAPIConnector";

async function configureConnector(serviceUrl, searchUrl, config) {
  var response = await fetch(serviceUrl + "/clients", {
    method: 'GET',
  });

  if (response.ok) {
    var searchKey = await response.text()

    var engineName = config.engineName;
    var endpointBase = searchUrl;

    return new AppSearchAPIConnector({
      searchKey,
      engineName,
      endpointBase
    });
  } else {
    return false;
  }
}

export function formatFieldName(field) {
  var fieldWords = field.split(new RegExp("[-_]"));

  var fieldWordsCapitalised = fieldWords.map(word =>
    word.length <= 3
      ? word
      : (word.substring(0, 1).toUpperCase().concat(word.substring(1)))
  )

  return fieldWordsCapitalised.join(" ");
}

export function buildSortOptionsFromEngine(config) {
  return [
    {
      name: "Relevance",
      value: "",
      direction: ""
    },
    ...(config.sortFields || []).reduce((acc, fieldName) => {
      var formattedFieldName = formatFieldName(fieldName)

      acc.push({
        name: `${formattedFieldName} (Low-to-High)`,
        value: fieldName,
        direction: "asc"
      });

      acc.push({
        name: `${formattedFieldName} (High-to-Low)`,
        value: fieldName,
        direction: "desc"
      });

      return acc;
    }, [])
  ];
}

export function getFilterableFacetsFromEngine(config) {
  return config.filterableFacets || [];
}

export function buildFacetsFromEngine(config) {
  return (config.facets || []).reduce((acc, facetField) => {
    acc = acc || {};

    acc[facetField] = {
      type: "value",
      size: 100,
    };
    return acc;
  }, undefined);
}


export async function makeConfig(serviceUrl, searchUrl, config, customFacets) {
  const resultFields = config.resultFields || [];
  const searchFields = config.searchFields;

  const searchOptions = {
    result_fields: resultFields.reduce((acc, n) => {
      acc = acc || {};
      acc[n] = {
        raw: {},
        snippet: {
          size: 100,
          fallback: true
        }
      }
      return acc;
    }, undefined),
    search_fields: searchFields
  }

  const connector = await configureConnector(serviceUrl, searchUrl, config);

  if (connector) {
    return ({
      searchQuery: {
        facets: customFacets,
        ...searchOptions
      },
      apiConnector: connector,
      alwaysSearchOnInitialLoad: true
    });
  } else {
    return undefined;
  }
}