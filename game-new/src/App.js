import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import './App.css';

import { ErrorView, withAsync, Cache } from './utils';

import { BuildMenu } from './views/builds';
import { ItemsView } from './views/items';
import { ItemSetsView } from './views/itemsets';
import { SkillsMenu, SkillsView } from './views/skills';
import { PowersView } from './views/powers';
import { KadalaView } from './views/kadala';
import { RawMenu, RawView } from './views/raw';
import { DiffMenu } from './views/diff';
import { StatusMenu } from './views/status';
import { HomeScreen } from './views/home';

const Spinner = () => <div className="Spinner"/>;

const DefaultBuildRedirect = withAsync({
  versions: (props, {cache}) => cache.fetch("/api/versions")
}, ({versions, location}) => (
  <Redirect to={"/" + Math.max(...Object.keys(versions.versions).map(x => parseInt(x, 10))) + location.pathname}/>
));
DefaultBuildRedirect.contextTypes = Cache.context;

const NavMenuInner = ({versions, match: {params: {build, diff}}}) => {
  const suffix = (diff ? `/diff/${diff}` : "");
  return (
    <Nav>
      <BuildMenu versions={versions}/>
      <LinkContainer to={`/${build}/items${suffix}`}><NavItem eventKey="items">Items</NavItem></LinkContainer>
      <LinkContainer to={`/${build}/itemsets${suffix}`}><NavItem eventKey="itemsets">Sets</NavItem></LinkContainer>
      <SkillsMenu build={build} suffix={suffix}/>
      <LinkContainer to={`/${build}/powers${suffix}`}><NavItem eventKey="powers">Powers</NavItem></LinkContainer>
      <LinkContainer to={`/${build}/kadala`}><NavItem eventKey="kadala">Kadala</NavItem></LinkContainer>
      <RawMenu build={build}/>
      <DiffMenu versions={versions}/>
    </Nav>
  );
};

const NavMenu = ({versions}) => (
  <Switch>
    <Route path="/:build/:path*/diff/:diff" render={props => <NavMenuInner versions={versions} {...props}/>}/>
    <Route path="/:build" render={props => <NavMenuInner versions={versions} {...props}/>}/>
  </Switch>
);

class App extends React.Component {
  static contextTypes = Cache.context;
  state = {
    loading: 0,
    versions: this.context.cache.fetch("/api/versions"),
  }
  onLoading = (loading) => {
    this.setState({loading});
  }
  componentDidMount() {
    this.context.cache.subscribe(this.onLoading);
  }
  componentWillUnmount() {
    this.context.cache.unsubscribe(this.onLoading);
  }
  onRefresh = () => {
    this.setState({versions: this.context.cache.refresh("/api/versions")});
  }
  render() {
    const { versions, loading } = this.state;
    return (
      <div className="App">
        <Navbar className="app-navbar" fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">D3Planner Data</Link>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse>
            <NavMenu versions={versions}/>
            <StatusMenu versions={versions} onRefresh={this.onRefresh}/>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route path="/:build/items" component={ItemsView}/>
          <Route path="/:build/itemsets" component={ItemSetsView}/>
          <Route path="/:build/skills" component={SkillsView}/>
          <Route path="/:build/powers" component={PowersView}/>
          <Route path="/:build/kadala" component={KadalaView}/>
          <Route path="/:build/raw" component={RawView}/>}/>
          <Route path="/:build" exact component={HomeScreen}/>
          <Route render={() => <ErrorView type="warning" data={{error: "Invalid request."}}/>}/>
        </Switch>
        {loading > 0 && <Spinner/>}
      </div>
    );
  }
}

class Root extends React.Component {
  static childContextTypes = Cache.context;
  getChildContext() {
    return {cache: this.cache};
  }

  constructor(props, context) {
    super(props, context);
    this.cache = new Cache();
  }
  render() {
    return (
      <Router basename="/game">
        <Switch>
          <Route path="/(\d+)" component={App}/>
          <Route component={DefaultBuildRedirect}/>
        </Switch>
      </Router>
    );
  }
}

export default Root;
