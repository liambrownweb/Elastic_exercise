import React, { Component } from "react"
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import logo from "./logo.svg"
import DataLayer from "./datalayer.js"
import Drawer from "material-ui/Drawer"
import "./App.css"
import EList from "./components/list.jsx"
import List, {ListItem, ListItemIcon, ListItemText} from "material-ui/List"
import Collapse from 'material-ui/transitions/Collapse';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import { withStyles } from 'material-ui/styles'
import Checkbox from 'material-ui/Checkbox'

import SvgIcon from 'material-ui/SvgIcon'
import RemoveRedEyeIcon from 'material-ui-icons/RemoveRedEye'
import ThumbsUpDownIcon from 'material-ui-icons/ThumbsUpDown'
import ErrorIcon from 'material-ui-icons/Error'
import UpdateIcon from 'material-ui-icons/Update'
import LanguageIcon from 'material-ui-icons/Language'
import HearingIcon from 'material-ui-icons/Hearing'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});
class DetailsForm extends Component {
	constructor() {
		super()
		this.state = {"data": {}}
	}
	processConfigSteps(config_steps) {
		let current_step = null,
			elements = config_steps.map(function(s, idx) {
				if (current_step === null) {
					current_step = s
				} else if (s.type === "step-completed") {
					let start_time = new Date(current_step.time),
						end_time = new Date(s.time),
						duration = end_time.getTime() - start_time.getTime()
					current_step = null;
					return (<TableRow>
							<TableCell>{s.value}</TableCell>
							<TableCell>{start_time.toUTCString()}</TableCell>
							<TableCell>{duration}</TableCell>
							<TableCell>{(s.ok) ? "Yes" : "No"}</TableCell>
						</TableRow>)
				}
			})
		return (<Table><TableHead>
					<TableCell>Name</TableCell>
					<TableCell>Start Time</TableCell>
					<TableCell>Duration</TableCell>
					<TableCell>OK?</TableCell>
				</TableHead>
				<TableBody>{elements}</TableBody></Table>)
	}
	setData(data) {
		this.setState({"data": data})
	}
	render() {
		let data = this.props.data,
			title_class = (data.healthy) ? "green" : "pink"
		return (
			<span className="details_drawer">
				<div className={"details_drawer_title " + title_class}>
					<div>{data.name || data.display_name || data.id}</div>
					<div>{(data.healthy) ? "Healthy" : "Not Healthy"}</div>
				</div>
				<div className="details_drawer_columns">
					<div>
						<div>Running: {(!data.isStopped) ? "Yes" : "No"}</div>
						<div>Updating: {(data.plan.isPending) ? "Yes" : "No"}</div>
						<div>Cluster type: {(data.user.isPremium) ? "Premium" : "Standard"}</div>
						<div>Kibana: {(data.kibana.enabled) ? "Yes": "No"}</div>
						<div>Monitoring: {(data.monitoring.enabled) ? "Yes" : "No"}</div>
						<div></div>
					</div>
					<div>
						<div>Configuration Steps</div>
						<div className="plan_config_steps">
						{this.processConfigSteps(data.plan.configurationSteps)}
						</div>
					</div>
				</div>
			</span>
			)
	}
}

class App extends Component {
	constructor() {
		super()
		this.region_ids = []
		this.healthy_not = [
			{
				"label": "Healthy",
				"value": "true"
			}, {
				"label": "Not Healthy",
				"value": "false"
			}
		]
		this.yes_no = [
			{
				"label": "Yes",
				"value": "true"
			}, {
				"label": "No",
				"value": "false"
			}
		]
		this.filter_menus = [
				{
					"field": "regionId",
					"icon": <LanguageIcon/>,
					"sub_list": this.region_ids,
					"tooltip": "Region" 
				},
				{
					"field": "healthy",
					"icon": <ThumbsUpDownIcon/>,
					"sub_list": this.healthy_not,
					"tooltip": "Health Status"
				},
				{
					"field": "isStopped",
					"icon": <ErrorIcon/>,
					"sub_list": this.yes_no,
					"tooltip": "Running"
				},
				{
					"field": "plan.isPending",
					"icon": <UpdateIcon/>,
					"sub_list": this.yes_no,
					"tooltip": "Updating"
				},
				{
					"field": "kibana.enabled",
					"icon": <img style={{background: "#555555", borderRadius: "10%"}} src="/icons/kibana.svg"/>,
					"sub_list": this.yes_no,
					"tooltip": "Kibana"
				},
				{
					"field": "monitoring.enabled",
					"icon": <RemoveRedEyeIcon/>,
					"sub_list": this.yes_no,
					"tooltip": "Monitoring"
				}
			],
		this.state = {"details_open": false,
			"filter_menus":{},
			"checked": []
		}
		this.filter_functions = [];
		this.filter_values = {};
		let that = this;
		this.filter_menus.forEach(f => {
			this.filter_functions.push((e) => {
				let value = null
				eval(`value = (e.${f.field}).toString()`);
				return (that.filter_values[f.field].length === 0 || that.filter_values[f.field].indexOf(value) >= 0)
			})
			this.state[f.field] = false
			this.filter_values[f.field] = [];
		})
		this.handleRowClick = this.handleRowClick.bind(this)
		this.toggleMenu = this.toggleMenu.bind(this)
		this.toggleCheck = this.toggleCheck.bind(this)
	}
	getData() {
		DataLayer.getData({}, (d) => {
			d.record.forEach(datum => {
				if (this.region_ids.indexOf(datum.regionId) < 0) { this.region_ids.push(datum.regionId)}
			})
			d.record = d.record.filter(current => {
				let included = true
				this.filter_functions.forEach(f => {
					included = included && f(current)
				})
				return included
			})
			this.clusters_list.setData(d)
			this.region_ids.sort();
		})
	}
	handleRowClick(event) {
		let data = this.clusters_list.state.data.record.find((e) => e.id == event.currentTarget.id)
		this.setState({"details_data": data})
		this.openDrawer()
	}
	openDrawer(open = true) {
		this.setState({"details_open": open})
	}
	render() {
		const classes = this.props;
		let drawer_button_els = this.filter_menus.map(b => (
					<span><ListItem button key={b.field} id={b.field} onClick={this.toggleMenu}>
						<ListItemIcon>
							{b.icon}
						</ListItemIcon>
						<ListItemText primary={b.tooltip}>
						</ListItemText>
						{this.state[b.field] ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse className="sublist" in={this.state[b.field]} timeout="auto" unmountOnExit>
						<List disablePadding>
							{b.sub_list.map(e => {
								let element_id = b.field + (e.value || e)
								return (<ListItem inset button 
									data-value={e.value || e} data-field={b.field} id={element_id} key={element_id} onClick={this.toggleCheck}>
								 <Checkbox
								 	checked={this.state.checked.indexOf(element_id) !== -1}
									tabIndex={-1}
									disableRipple />
									<ListItemText primary={e.label || e}></ListItemText></ListItem>)})}
						</List>
					</Collapse>
					</span>)
				),
			drawer_list = (<List className={classes.root}>
						{drawer_button_els}
					</List>)

		return (
			<div className="App">
				<div className="App_bar">
				<AppBar position="static" color="default">
					<Toolbar>
					<img style={{"height": "40px", "margin-right": "32px"}} src="/icons/elastic-logo.svg"/>
						<Typography type="title" color="inherit">
							Cluster Management
						</Typography>
					</Toolbar>
				</AppBar>
				</div>
				<div className="App_main">
					<Drawer className="drawer gray" type="permanent">
						{drawer_list}
					</Drawer>
					<main>
						<div className="list_and_details">
							<div className="list_container">
								<EList ref={(e) => this.setClustersList(e)} onRowClick={this.handleRowClick}></EList>
							</div>
						</div>
						<Drawer 
							anchor="bottom" 
							className="details" 
							onClose={() => this.openDrawer(false)} 
							open={this.state.details_open} 
							ref={(e) => this.details_drawer = e}>
							<DetailsForm data={this.state.details_data}></DetailsForm>
						</Drawer>
					</main>
				</div>
			</div>
		)
	}
	setClustersList(list) {
		this.clusters_list = list
		this.getData()
	}
	toggleMenu(event) {
		let id = event.currentTarget.id,
			state = {}
		state[id] = !this.state[id];
		this.setState(state)
	}
	toggleCheck(event) {
		let id = event.currentTarget.id,
			value = event.currentTarget.getAttribute("data-value"),
			field = event.currentTarget.getAttribute("data-field"),
			field_idx = this.filter_values[field].indexOf(value);
		const { checked } = this.state
		const currentIndex = checked.indexOf(id)
		const newChecked = [...checked]

		if (field_idx === -1) {
			this.filter_values[field].push(value)
		} else {
			this.filter_values[field].splice(field_idx, 1)
		}

		if (currentIndex === -1) {
			newChecked.push(id);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		this.setState({
			checked: newChecked,
		});
	};
}

export default App
