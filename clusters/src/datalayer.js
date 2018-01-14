class DataLayer {
	static getData() {
		console.log("getting data");
		fetch("/clusters.json").then(function (response) {
			return response.json();
		}).then(function (json) {
			console.log(json);
		});
	}
}

export default DataLayer;
