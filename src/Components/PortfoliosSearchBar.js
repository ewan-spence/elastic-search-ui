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

import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import "./SearchBar.css";

import React, { useEffect, useState } from "react";

import { buildPortfolioFacets, buildPortfolioSortOptions, formatPortfolioFieldName, getPortfolioFilterableFacets, makePortfolioConfig } from "../Config/Portfolios/ConfigBuilder";

export default function PortfoliosSearchBar({ searchUrl, serviceUrl }) {
  const [config, setConfig] = useState();

  const facets = buildPortfolioFacets();
  const filterableFacets = getPortfolioFilterableFacets();

  useEffect(() => {
    makePortfolioConfig(serviceUrl, searchUrl)
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
                  header={<SearchBox autocompleteSuggestions={false} searchAsYouType={true} />}
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting
                          label={"Sort By"}
                          sortOptions={buildPortfolioSortOptions()}
                        />
                      )}
                      {Object.keys(facets).map(field => (
                        <Facet
                          isFilterable={filterableFacets.includes(field)}
                          key={field}
                          field={field}
                          label={formatPortfolioFieldName(field)}
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
                            .forEach(key => resultData[formatPortfolioFieldName(key)] = result.props.result[key])

                          return <Result
                            key={result.key}
                            result={resultData}
                            titleField="Client Name"
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
