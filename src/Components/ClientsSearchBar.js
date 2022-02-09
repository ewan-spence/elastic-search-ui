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

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector/lib/AppSearchAPIConnector";


import React, { useEffect, useState } from "react";

export default function ClientsSearchBar({ serviceUrl, searchUrl }) {
  const [connector, setConnector] = useState();

  useEffect(() => {
    if (!connector) {
      fetch(serviceUrl + "/clients", {
        method: 'GET',
      }).then(res => {
        res.text().then(text => {
          var searchKey = text;
          var engineName = "clients";
          var endpointBase = searchUrl;

          setConnector(new AppSearchAPIConnector({
            searchKey,
            engineName,
            endpointBase
          }));
        })
      });
    }
  });

  const sorts = [{
    name: "Relevance",
    value: "",
    dirction: ""
  }];
  const facets = {};

  const resultFields = [
    "name",
    "date_of_birth",
    "date_joined",
  ];

  const searchOptions = {
    result_fields: {
      ...resultFields.reduce((acc, n) => {
        acc = acc || {};
        acc[n] = {
          raw: {},
          snippet: {
            size: 100,
            fallback: true
          }
        }
        return acc;
      }, undefined)
    },
    search_fields: undefined
  }

  const autocompleteQuery = {
    suggestions: {
      types: {
        documents: {
          fields: []
        }
      }
    }
  }

  const config = {
    searchQuery: {
      facets: facets,
      ...searchOptions
    },
    apiConnector: connector,
    autocompleteQuery,
    alwaysSearchOnInitialLoad: true
  }

  if (connector) {
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
                          sortOptions={sorts}
                        />
                      )}
                      {Object.keys(facets).map(field => (
                        <Facet key={field} field={field} label={field} />
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

