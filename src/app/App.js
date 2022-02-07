import React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "../components/Main";
import Trade from "../components/Trade";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" exact>
          <Main />
        </Route>

        <Route path="/trade/:currencyName" exact>
          <Trade />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
