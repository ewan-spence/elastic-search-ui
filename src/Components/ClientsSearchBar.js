import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  Paging,
  PagingInfo,
  Result,
  Results,
  ResultsPerPage,
  SearchBox,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";

import { Layout, SingleLinksFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import React, { useEffect, useState } from "react";

import { buildFacetsFromEngine, buildSortOptionsFromEngine, formatFieldName, getFilterableFacetsFromEngine, makeConfig } from "../Config/Clients/ConfigBuilder";

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
                        <Facet
                          isFilterable={filterableFacets.includes(field)}
                          key={field}
                          field={field}
                          label={formatFieldName(field)}
                          view={SingleLinksFacet}
                        />
                      ))}
                    </div>
                  }
                  bodyContent={
                    <Results
                      view={({ children }) => {
                        return children.map(result => {
                          var resultData = {};

                          Object.keys(result.props.result)
                            .forEach(key => resultData[formatFieldName(key)] = result.props.result[key])

                          console.log(Object.keys(resultData))

                          return <Result
                            key={result.key}
                            result={resultData}
                            titleField="Name"
                          ></Result>
                        })
                      }}
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
