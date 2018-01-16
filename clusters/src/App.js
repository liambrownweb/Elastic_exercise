import React, { Component } from "react"
import logo from "./logo.svg"
import DataLayer from "./datalayer.js"
import Drawer from "material-ui/Drawer"
import "./App.css"
import EList from "./components/list.jsx"
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import AddShoppingCartIcon from 'material-ui-icons/AddShoppingCart';

import Tooltip from 'material-ui/Tooltip';
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
		return (<span className="details_drawer">
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
			</span>)
	}
}

class App extends Component {
	constructor() {
		super()
		this.state = {"details_open": false}
		this.handleRowClick = this.handleRowClick.bind(this)
	}
	getData() {
		DataLayer.getData({}, (d) => this.clusters_list.setData(d))
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
		let drawer_buttons = [
			"regionId",
			"healthy",
			"isStopped",
			"plan.isPending",
			"kibana.enabled",
			"monitoring.enabled"
			],
			drawer_button_els = drawer_buttons.map(b => (
					<Tooltip key={b} id={b} title={b}>
						<IconButton color="contrast" aria-label="Add to shopping cart">
							<AddShoppingCartIcon />
						</IconButton>
					</Tooltip>)
				)

		return (
			<div className="App">
				<Drawer className="drawer gray" type="permanent">
					{drawer_button_els}
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
		)
	}
	setClustersList(list) {
		this.clusters_list = list
		this.getData()
	}
}

export default App
