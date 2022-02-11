import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  Paging,
  PagingInfo,
  Result,
  ResultsPerPage,
  SearchBox,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";

import { Layout, SingleLinksFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import "./SearchBar.css";

import React, { useEffect, useState } from "react";

import { buildClientFacets, buildClientSortOptions, formatClientFieldName, formatFacetFieldName, getClientFilterableFacets, makeClientConfig } from "../Config/Clients/ConfigBuilder";

export default function ClientsSearchBar({ serviceUrl, searchUrl }) {
  const [config, setConfig] = useState();

  const facets = buildClientFacets();
  const filterableFacets = getClientFilterableFacets();

  useEffect(() => {
    makeClientConfig(serviceUrl, searchUrl)
      .then(res => setConfig(res));
  }, [serviceUrl, searchUrl, setConfig])

  if (config) {
    return (
      <SearchProvider config={config}>
        <WithSearch mapContextToProps={({ results, wasSearched }) => ({ results, wasSearched })}>
          {({ results, wasSearched }) => {
            return (
              <ErrorBoundary>
                <Layout
                  header={<SearchBox autocompleteSuggestions={false} />}
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting
                          label={"Sort By"}
                          sortOptions={buildClientSortOptions()}
                        />
                      )}
                      {Object.keys(facets).map(field => (
                        <Facet
                          isFilterable={filterableFacets.includes(field)}
                          key={field}
                          field={field}
                          label={formatFacetFieldName(field)}
                          view={SingleLinksFacet}
                        />
                      ))}
                    </div>
                  }
                  bodyContent={
                    results.map(res => {
                      var formattedResult = Object.keys(res).reduce((acc, key) => {
                        acc = acc || {}

                        acc[formatClientFieldName(key)] = res[key]

                        return acc;
                      }, undefined)

                      return <Result
                        result={formattedResult}
                        titleField="Name" />
                    })
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            );
          }}
        </WithSearch>
      </SearchProvider>);
  } else {
    return null;
  }
}
