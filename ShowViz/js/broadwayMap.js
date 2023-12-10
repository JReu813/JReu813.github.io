class BroadwayMap {

	constructor(parentElement, data) {
		this.parentElement = parentElement;
		this.data = data;

		this.initVis();
	}

	initVis () {
		let vis = this;

		vis.broadwayMap = L.map('broadway-map').setView([40.757980, -73.985545], 16);
		L.Icon.Default.imagePath = 'img/';
		L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
			attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			ext: 'jpg'
		}).addTo(vis.broadwayMap);
		vis.stationGroup = L.layerGroup().addTo(vis.broadwayMap);


		vis.wrangleData();
	}

	wrangleData () {
		let vis = this;

		// No data wrangling/filtering needed

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		console.log(vis.data)

		let BuildingIcon = L.Icon.extend({
			options: {
				iconSize:     [28, 28],
				iconAnchor:   [18, 18],
				popupAnchor:  [-4, -25]
			}
		});

		let BrightIcon = new BuildingIcon({iconUrl: 'img/bright.svg.png'})
		let DarkIcon = new BuildingIcon({iconUrl: 'img/dark.png'})

		vis.data.forEach((row,i)=>{
			let popupContent =  "<strong>" + row["name"] + "</strong><br/>";
			popupContent += "Address: " + row["address"] + "<br>";
			popupContent += "Number of Seats: " + row["seats"] + "<br>";
			popupContent += "Year Built: " + row["yearBuilt"] + "<br>";
			popupContent += "Last Show Before Shutdown: " + row["pandemicShow"];
			let marker = L.marker([vis.data[i]["lat"], vis.data[i]["long"]], {icon: DarkIcon})
				.addTo(vis.broadwayMap)
			.bindPopup(popupContent)
			vis.stationGroup.addLayer(marker);
			}
		)

		//slider

		let dates = []
		vis.data.forEach((row,i) => {
			if (row["reopeningDate"] !== "N/A") {
					dates.push(row["reopeningDate"])
				}
			}
		)
		console.log(dates)
	}
}

