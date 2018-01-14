import React, { Component } from "react"
import logo from "./logo.svg"
import DataLayer from "./datalayer.js"
import Drawer from "material-ui/Drawer"
import "./App.css"
import EList from "./components/list.jsx"

class App extends Component {
	getData() {
		DataLayer.getData()
	}
	render() {
		this.getData()
		return (
			<div className="App">
				<Drawer type="permanent">Hello!</Drawer>

			</div>
		)
	}
}

export default App
