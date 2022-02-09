import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  Paging,
  PagingInfo,
  Results,
  ResultsPerPage,
  SearchBox,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";

import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import React, { useEffect, useState } from "react";

import { buildFacetsFromEngine, buildSortOptionsFromEngine, getFilterableFacetsFromEngine, makeConfig } from "../Config/Clients/ConfigBuilder";

export default function ClientsSearchBar({ serviceUrl, searchUrl }) {
  const [config, setConfig] = useState();

  const facets = buildFacetsFromEngine();
  const filterableFacets = getFilterableFacetsFromEngine();

  useEffect(() => {
    makeConfig(serviceUrl, searchUrl)
      .then(res => setConfig(res));
  }, [serviceUrl, searchUrl, setConfig])

  if (config) {
    return (
      <SearchProvider config={config}>
        <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
          {({ wasSearched }) => {
            return (
              <ErrorBoundary>
                <Layout
                  header={<SearchBox autocompleteSuggestions={false} />}
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting
                          label={"Sort By"}
                          sortOptions={buildSortOptionsFromEngine()}
                        />
                      )}
                      {Object.keys(facets).map(field => (
                        <Facet isFilterable={filterableFacets.includes(field)} key={field} field={field} label={field.replaceAll(/[-_]/g, " ")} />
                      ))}
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField="name"
                      urlField=""
                      thumbnailField=""
                      shouldTrackClickThrough={true}
                    />
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
