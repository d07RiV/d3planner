/*global DiabloCalc*/
import React from 'react';
import classNames from 'classnames';
import { MenuItem, Navbar, Nav, NavItem, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { SlideDown } from 'react-slidedown'

import { ErrorView, withAsync, Cache } from 'utils';
import { charClasses, classIcons } from 'game';

import './kadala.css';

function formatNumber(num, decimal, separator) {
  if (separator == null) {
    return num.toFixed(decimal || 0);
  }
  const parts = num.toFixed(decimal || 0).split(".");
  if (parseFloat(num) >= separator) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return parts.join(".");
}

const ItemTooltip = ({tooltip, className, style}) => (
  <div className={classNames("d3-tooltip-wrapper", className)} style={style}>
    <div className="d3-tooltip-wrapper-inner" dangerouslySetInnerHTML={{__html: tooltip}}/>
  </div>
);

class KadalaList extends React.Component {
  render() {
    const { build, data, charClass, charLevel, hardcore, percent, collapsed, onToggle } = this.props;
    const kadalaWeight = {}, typeItems = {}, typeWeight = {};
    Object.keys(data.Items).forEach(id => {
      const item = data.Items[id];
      if (!item[charClass] || (item.hardcore && !hardcore) || !data.ItemTypes[item.type]) {
        return;
      }
      if (item.level <= charLevel) {
        const kc = data.ItemTypes[item.type].kadala;
        kadalaWeight[kc] = (kadalaWeight[kc] || 0) + item.weight;
        typeItems[item.type] = (typeItems[item.type] || []);
        typeItems[item.type].push(id);
      }
      typeWeight[item.type] = (typeWeight[item.type] || 0) + item.weight;
    });
    return (
      <ul className="KadalaList">
        {Object.keys(data.ItemTypes).sort().map(type => {
          if (!typeItems[type]) return null;
          typeItems[type].sort((a, b) => data.Items[a].name.localeCompare(data.Items[b].name));
          return (
            <li className="item-category">
              <div className={classNames("row-header", type, {
                     collapsed: collapsed[type],
                     weapon: data.ItemTypes[type].name.match(/1h|2h/i)
                   })}
                   onClick={() => onToggle(type)}>
                {data.ItemTypes[type].name}
              </div>
              <SlideDown closed={collapsed[type]}>
                <ul>
                  {typeItems[type].map(id => {
                    const item = data.Items[id];
                    const kc = data.ItemTypes[item.type].kadala;
                    const chance = item.weight / kadalaWeight[kc];
                    const uchance = item.weight / typeWeight[item.type];
                    const average = data.Types[kc].cost * 10 / chance;
                    const uaverage = 25 / uchance;
                    const percentile = data.Types[kc].cost * 10 * Math.log(1 - percent / 100) / Math.log(1 - chance);
                    const iconid = (DiabloCalc.itemIcons[id] || [0])[0];
                    let name = (
                      <div className="item-name">
                        <span className="item-icon" style={{
                          backgroundImage: `url(/css/items/${type}.png)`,
                          backgroundPosition: `0 -${(iconid || 0) * 24}px`
                        }}/>
                        {item.name}
                      </div>
                    );
                    if (item.tooltip) {
                      let tooltip = item.tooltip;
                      if (tooltip.includes("h3 class=\"d3-color-green\"")) {
                        tooltip = tooltip.replace("tooltip-head-orange", "tooltip-head-green");
                      }
                      name = (
                        <OverlayTrigger placement="right" overlay={<ItemTooltip tooltip={tooltip}/>}>
                          {name}
                        </OverlayTrigger>
                      );
                    }
                    return (
                      <li className="row-item">
                        {name}
                        <div className="item-col col-level">{item.level}</div>
                        <div className="item-col col-average">{formatNumber(average, 0, 10000)}</div>
                        <div className="item-col col-percent">{formatNumber(percentile, 0, 10000)}</div>
                        <div className="item-col col-db">{formatNumber(uaverage, 0, 10000)}</div>
                      </li>
                    );
                  })}
                </ul>
              </SlideDown>
            </li>
          );
        })}
      </ul>
    );
  }
}

class KadalaViewComponent extends React.Component {
  static state = {charClass: "demonhunter", charLevel: 70, hardcore: false, percent: 80, collapsed: {}};
  constructor(props, context) {
    super(props, context);
    this.state = KadalaViewComponent.state;
  }
  componentDidUpdate() {
    KadalaViewComponent.state = this.state;
  }
  setClass = (charClass) => {
    this.setState({charClass});
  }
  setLevel = (e) => {
    let charLevel = parseInt(e.target.value, 10);
    if (isNaN(charLevel)) charLevel = 70;
    charLevel = Math.min(charLevel, 70);
    charLevel = Math.max(charLevel, 1);
    this.setState({charLevel});
  }
  setHardcore = (e) => {
    this.setState({hardcore: e.target.checked});
  }
  setPercent = (e) => {
    let percent = parseInt(e.target.value, 10);
    if (isNaN(percent)) percent = 80;
    percent = Math.min(percent, 99);
    percent = Math.max(percent, 1);
    this.setState({percent});
  }
  toggleType = (type) => {
    this.setState(({collapsed}) => ({collapsed: {...collapsed, [type]: !collapsed[type]}}));
  }
  expand = () => {
    this.setState({collapsed: {}});
  }
  collapse = () => {
    const collapsed = {};
    Object.keys(this.props.data.ItemTypes).forEach(type => collapsed[type] = true);
    this.setState({collapsed});
  }
  render() {
    const { charClass, charLevel, hardcore, percent, collapsed } = this.state;
    return (
      <div className="KadalaView app-body">
        <Navbar fluid className="KadalaHeader">
          <Nav>
            <Dropdown componentClass="li" onSelect={this.setClass}>
              <Dropdown.Toggle useAnchor>
                <img src={classIcons[charClasses[charClass]]} className="skills-menu-icon"/>
                {charClasses[charClass]}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.keys(charClasses).map(id => (
                  <MenuItem eventKey={id} active={charClass === id}>
                    <img src={classIcons[charClasses[id]]} className="skills-menu-icon"/>
                    {charClasses[id]}
                  </MenuItem>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Navbar.Toggle/>
          </Nav>
          <Navbar.Collapse>
            <Navbar.Form pullLeft>
              <FormGroup controlId="char-level">
                <ControlLabel>Level</ControlLabel>{" "}
                <FormControl type="number" value={charLevel} min={1} max={70} onChange={this.setLevel}/>
              </FormGroup>
              <Checkbox inline checked={hardcore} onChange={this.setHardcore} className="hc-box">Hardcore</Checkbox>
            </Navbar.Form>
            <Nav>
              <NavItem eventKey="expand" onClick={this.expand}>Expand All</NavItem>
              <NavItem eventKey="collapse" onClick={this.collapse}>Collapse All</NavItem>
            </Nav>
          </Navbar.Collapse>
          <OverlayTrigger placement="bottom" overlay={
              <Tooltip id="level-tooltip">Required level to gamble (if below 16, can be gambled by any character)</Tooltip>
            }>
            <div className="navbar-col col-level">
              Level
            </div>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={
              <Tooltip id="level-tooltip">Average Bood Shards required to obtain the item</Tooltip>
            }>
            <div className="navbar-col col-average">
              Average
            </div>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={
              <Tooltip id="level-tooltip">Blood Shards required to obtain the item with {percent}% certainty</Tooltip>
            }>
            <div className="navbar-col col-percent">
              <Navbar.Form>
                <FormGroup>
                  <InputGroup>
                    <FormControl type="number" value={percent} min={1} max={99} onChange={this.setPercent}/>
                    <InputGroup.Addon>%</InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
              </Navbar.Form>
            </div>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={
              <Tooltip id="level-tooltip">Average Death's Breaths required to cube the item by upgrading rares</Tooltip>
            }>
            <div className="navbar-col col-db">
              Breaths
            </div>
          </OverlayTrigger>
        </Navbar>
        <KadalaList {...this.props}
                    charClass={charClass}
                    charLevel={Math.max(charLevel, 16)}
                    hardcore={hardcore}
                    percent={percent}
                    collapsed={collapsed}
                    onToggle={this.toggleType}/>
      </div>
    );
  }
}

const KadalaView = withAsync({
  data: ({match}, {cache}) => cache.fetch(`/api/${match.params.build}/kadala`, {global: true})
}, ({data, match}) => (
  <KadalaViewComponent build={match.params.build} data={data}/>
), undefined, ErrorView);
KadalaView.contextTypes = Cache.context;

export { KadalaView };
