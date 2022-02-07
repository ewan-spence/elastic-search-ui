import { Layout } from "@elastic/react-search-ui-views";
import { ErrorBoundary, Facet, Paging, PagingInfo, Results, ResultsPerPage, SearchBox, Sorting } from "@elastic/react-search-ui/lib/containers";
import React from "react";

function SearchBar({ wasSearched }) {
    const facets = []

    return (
        <ErrorBoundary>
            <Layout
                header={<SearchBox autocompleteSuggestions={true} />}
                sideContent={
                    <div>
                        {wasSearched && (
                            <Sorting
                                label={"Sort By"}
                                sortOptions={[]}
                            />
                        )}
                        {facets.map(field => {
                            <Facet key={field} field={field} label={field} />
                        })}
                    </div>
                }
                bodyContent={
                    <Results
                        titleField={""}
                        urlField={""}
                        thumbnailField={""}
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
        </ErrorBoundary>)
}

export default SearchBar;