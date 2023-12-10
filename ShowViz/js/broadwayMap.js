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
		L.tileLayer('https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg', {
			maxZoom: 18,
			attribution: 'Maptiles by Stamen Design, under <a target="_blank" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="https://www.openstreetmap.org/#map=4/38.01/-95.84">OpenStreetMap</a>, under <a target="_top" href="http://creativecommons.org/licenses/by-sa/2.0">CC BY-SA 2.0'
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

