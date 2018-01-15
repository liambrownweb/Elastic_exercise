import React, {Component} from "react"
import List, {ListItem} from "material-ui/List"
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
class EList extends Component {
	constructor() {
		super()
		this.state = {"data": {"record": []}, "headers": []};
		this.handleClick = this.handleClick.bind(this);
	}

	generateTableRow(data) {
		let output = (<TableRow onClick={this.handleClick}>
				{this.state.headers.map((e) => <TableCell>{data[e]}</TableCell>)}
			</TableRow>)
		return output
	}

	handleClick(event) {
		if (this.props.hasOwnProperty("onRowClick")) {
			this.props.onRowClick(event);
		}
	}

	setData(data) {
		this.setState({"data": data,
			"headers": ["name", "regionId", "healthy"]
		})
	}

	render() {
		let list_items = this.state.data.record.map((e) => this.generateTableRow(e)),
			headers = this.state.headers.map((e) => <TableCell>{e}</TableCell>)
		return (
			<Table>
				<TableHead>{headers}</TableHead>
				<TableBody>{list_items}</TableBody>
			</Table>)
	}
}
export default EList
