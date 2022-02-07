import logo from './logo.svg';
import './App.css';

import { SearchProvider, WithSearch } from "@elastic/react-search-ui";
import SearchBar from './SearchBar';
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector/lib/AppSearchAPIConnector';

const connector = new AppSearchAPIConnector({
  searchKey: "search-5j1xsnh31jjm1qd55szdq7qf",
  engineName: "wpsearch",
  endpointBase: "http://localhost:3002"
})

function App() {
  const config = {
    apiConnector = connector
  };

  return (
    <SearchProvider config={config} >
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return <div className="App">
            <SearchBar wasSearched={wasSearched} />
          </div>
        }}
      </WithSearch>
    </SearchProvider>
  );
}

export default App;
