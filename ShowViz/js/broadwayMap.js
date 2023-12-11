class BroadwayMap {

	constructor(parentElement, data) {
		this.parentElement = parentElement;
		this.data = data;

		this.initVis();
	}

	initVis () {
		let vis = this;

		vis.broadwayMap = L.map(vis.parentElement).setView([40.757980, -73.985545], 16);
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

		let sliderValue = d3.extent(dates);
		console.log(sliderValue)

		let slider = document.getElementById('slider');

		function timestamp(str) {
			return new Date(str).getTime();
		}

		noUiSlider.create(slider, {
			start: [timestamp(sliderValue[0])],
			// tooltips: true,
			pips: true,
			step: 24 * 60 * 60 * 1000,
			behaviour: 'drag',
			connect: true,
			range: {
				min: timestamp(sliderValue[0]),
				max: timestamp(sliderValue[1])
			},
			format: wNumb({
				decimals: 0,
			})})
		slider.style.width = '1000px'

		let dateValues = [
			document.getElementById('slider-value'),
		];

		let formatter = new Intl.DateTimeFormat('en-US', {
			dateStyle: 'full'
		});

		slider.noUiSlider.on('update', function (values, handle) {
			dateValues[handle].innerHTML = formatter.format(new Date(+values[handle]));
		});

		//comparison between theaters and circles

		slider.noUiSlider.on('slide', function (values, handle) {
			let sliderReturn = slider.noUiSlider.get();
			console.log("slider vals " + sliderReturn)
			vis.data.forEach((row,i) => {
				let reopeningDate = (new Date(row["reopeningDate"]).getTime()).toString()
				console.log("theater vals " + reopeningDate)
				if (sliderReturn >= reopeningDate) {
					// console.log("working!")
					let marker = L.marker([vis.data[i]["lat"], vis.data[i]["long"]], {icon: BrightIcon})
						.addTo(vis.broadwayMap)

				}
				if (reopeningDate >= sliderReturn) {
					// console.log("working!")
					let marker = L.marker([vis.data[i]["lat"], vis.data[i]["long"]], {icon: DarkIcon})
						.addTo(vis.broadwayMap)
				}
			})
		})
	}
}

