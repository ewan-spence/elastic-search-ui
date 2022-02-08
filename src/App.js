import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ClientsSearchBar from './Components/ClientsSearchBar';
import { Tab, Tabs } from 'react-bootstrap';
import { useState } from 'react';

function App() {
  const serviceUrl = "https://localhost:44373/api";
  const searchUrl = "https://trial-deployment.ent.europe-west2.gcp.elastic-cloud.com";

  const [active, setActive] = useState("clients");

  return <Tabs
    activeKey={active}
    onSelect={setActive}
  >
    <Tab eventKey="clients" title="Clients">
      <ClientsSearchBar serviceUrl={serviceUrl} searchUrl={searchUrl} engine={{}} />
    </Tab>

  </Tabs>
}

export default App;
