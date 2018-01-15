import React, { Component } from "react"
import logo from "./logo.svg"
import DataLayer from "./datalayer.js"
import Drawer from "material-ui/Drawer"
import "./App.css"
import EList from "./components/list.jsx"

import IconButton from 'material-ui/IconButton';
import AddShoppingCartIcon from 'material-ui-icons/AddShoppingCart';

import Tooltip from 'material-ui/Tooltip';

class App extends Component {
	constructor() {
		super()
		this.state = {"details_open": false}
		this.handleRowClick = this.handleRowClick.bind(this)
	}
	getData() {
		DataLayer.getData({}, (d) => {
			this.clusters_list.setData(d)
		})
	}
	handleRowClick(event) {
		this.openDrawer();
	}
	openDrawer(open = true) {
		this.setState({"details_open": open});
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
				<Drawer anchor="bottom" className="details" onClose={() => this.openDrawer(false)} open={this.state.details_open} ref={(e) => this.details_drawer = e}>3.14159265358979323846264338</Drawer>
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
