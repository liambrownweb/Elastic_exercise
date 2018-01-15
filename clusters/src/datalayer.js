class DataLayer {
	static getData(params, callback) {
		console.log("getting data");
		fetch("/clusters.json").then(function (response) {
			return response.json();
		}).then(function (json) {
			callback(json);
		});
	}
}

export default DataLayer;
