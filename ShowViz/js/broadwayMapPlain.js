
/*
 *  broadwayMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class BroadwayMap {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;

        vis.broadwayMap = L.map('broadway-map').setView([40.757980, -73.985545], 16);
        L.Icon.Default.imagePath = 'img/';
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.broadwayMap);
        vis.stationGroup = L.layerGroup().addTo(vis.broadwayMap);


        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
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
                popupAnchor:  [0, -25]
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
                let marker = L.marker([vis.data[i]["lat"], vis.data[i]["long"]], {icon: BrightIcon})
                    .addTo(vis.broadwayMap)
                    .bindPopup(popupContent)
                vis.stationGroup.addLayer(marker);
            }
        )



        // let LeafIcon = L.Icon.extend({
        // 	options: {
        // 		iconSize:     [20, 20],
        // 		iconAnchor:   [22, 94],
        // 		popupAnchor:  [-3, -76]
        // 	}
        // });
        // let gershwinIcon = new LeafIcon({iconUrl: 'img/gershwin.png'})
        // L.marker([40.76251, -73.98494], {icon: gershwinIcon}).addTo(vis.broadwayMap).bindPopup("I am a green leaf.")


    }

}