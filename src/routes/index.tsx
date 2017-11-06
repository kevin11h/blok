import * as React from "react";
import { observer, inject } from "mobx-react/native";
import { Router as ReactRouter, Switch, Route } from "react-router-native";
import Dashboard from "./_dashboard";
import { RouterInterface } from "../store/_router";

// -- types ----------------------------------------------------------------- //
export interface Props {
  router?: RouterInterface;
}

@inject("router")
@observer
class Router extends React.Component<Props, {}> {
  // -- render -------------------------------------------------------------- //
  render() {
    const { router } = this.props;
    return (
      <ReactRouter history={router.history}>
        <Switch location={router.location}>
          <Route path="/" component={Dashboard} />
        </Switch>
      </ReactRouter>
    );
  }
}

export default Router;
