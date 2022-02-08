import { SearchProvider, WithSearch, ErrorBoundary } from "@elastic/react-search-ui";
import { Layout, SearchBox } from "@elastic/react-search-ui-views";
import { Facet, Paging, PagingInfo, Results, ResultsPerPage, Sorting } from "@elastic/react-search-ui/lib/containers";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector/lib/AppSearchAPIConnector";
import React, { useEffect, useState } from "react";

export default function ClientsSearchBar({ serviceUrl, searchUrl }) {
  const [connector, setConnector] = useState();

  useEffect(() => {
    if (!connector) {
      fetch(serviceUrl + "/clients", {
        method: 'GET',
      }).then(res => {
        var searchKey = res.text;
        var engineName = "clients";
        var endpointBase = searchUrl;

        setConnector(new AppSearchAPIConnector({
          searchKey,
          engineName,
          endpointBase
        }));
      });
    }
  });

  const sorts = [{
    name: "Relevance",
    value: "",
    dirction: ""
  }];
  const facets = {};

  const searchOptions = {
    result_fields: [

    ],
    search_fields: [

    ]
  }

  const config = {
    searchQuery: {
      facets: facets,
      ...searchOptions
    },
    connector,
    alwaysSearchOnInitialLoad: false
  }

  if (connector) {
    return (<SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">
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
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>);
  } else {
    return null;
  }

}

