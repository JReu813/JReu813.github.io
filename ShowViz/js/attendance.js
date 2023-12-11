class IsoType {

    constructor(parentElement, titleElement, seats, capacity) {
        this.parentElement = parentElement;
        this.titleElement = titleElement;
        this.attendanceData = capacity;
        this.seatsData = seats;
        this.filteredData = this.attendanceData;
        this.selectStart = "2022-01-01";
        this.selectEnd = "2023-10-14";
        this.keys = ["Filled Seat", "Empty Seat"];
        this.colors = ["#c32a2a", "#444444"]

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.totalSeats = 0;
        vis.seatsData.forEach(d=>{
            vis.totalSeats += parseInt(d.count);
        })

        vis.sumCapacity = 0;
        vis.count = 0;
        vis.attendanceData.forEach(d=>{
            vis.sumCapacity += parseFloat(d.capacity);
            vis.count += 1;
        })
        vis.avgCapacity = vis.sumCapacity/vis.count;
        vis.percent = Math.round(vis.avgCapacity)

        //width and height of the SVG
        vis.margin = {top: 20, right: 10, bottom: 20, left: 40};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - 2*vis.margin.left - 2*vis.margin.right;
        vis.height = (document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom);
        //create an svg with width and height
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

        //10 rows and 10 columns
        vis.numRows = 10;
        vis.numCols = 10;

        //the data is just an array of numbers for each cell in the grid
        vis.gridData = d3.range(vis.numCols*vis.numRows);

        //container to hold the grid
        vis.container = vis.svg.append("g")
            .attr("transform", "translate(0, 20)");

        vis.svg.append("text")
            .attr("class", "title")
            .text("Percent of Seats Filled in All Broadway Theaters")
            .attr("transform", `translate(${vis.width/2}, 50)`)

        //legend group
        vis.legend = vis.svg.append("g")
            .attr("transform", "translate(15, 80)")

        // Add one box in the legend for each name.
        vis.legend.selectAll(".dots")
            .data(vis.keys)
            .enter()
            .append("rect")
            .attr("class", "dots")
            .attr("x", 0)
            .attr("y", (d, i) => i*(20+5))
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", (d, i) => vis.colors[i])
            .attr("stroke", "#cca354");

        // Add one label in the legend for each name.
        vis.legend.selectAll(".labels")
            .data(vis.keys)
            .enter()
            .append("text")
            .attr("class", "labels")
            .attr("x", 20*1.2)
            .attr("y", (d, i) => 10+i*(20+5))
            .attr("fill", (d, i) => vis.colors[i])
            .text(d => d)

        vis.title = d3.select(`#${vis.titleElement}`).append("text");

        vis.wrangleData();
    }

    drawGraph(percentNumber) {
        let vis = this;

        vis.container.selectAll("rect")
            .data(vis.gridData)
            .enter().append('rect')
            .attr("id", function (d) {
                return "id" + d;
            })
            .attr('x', function (d) {
                return 3 + vis.width / 2 + ((d%vis.numRows) * 1.2 + 5) * Math.cos(3.5*Math.PI / 16 + Math.floor(d / vis.numCols) * Math.PI / 16) * vis.width / (2.5 * vis.numCols);
            })
            .attr('y', function (d) {
                return 2 + vis.height - ((d%vis.numRows) * 2 + 6) * Math.sin(3.5*Math.PI / 16 + Math.floor(d / vis.numCols) * Math.PI / 16) * vis.height / (3 * vis.numRows);
            })
            .attr('width', 14)
            .attr("height", 16)
            .attr("class", "delete")
            .attr("rx", 1)
            .attr("ry", 1)
            .attr('fill', function (d) {
                return d > 99 - percentNumber ? vis.colors[0] : vis.colors[1];
            });

        vis.container.selectAll("img")
            .data(vis.gridData)
            .enter().append('svg:image')
            .attr('href', 'img/chair.svg')
            .attr("class", "delete")
            .attr("id", function (d) {
                return "chair" + d;
            })
            .attr('x', function (d) {
                return vis.width / 2 + ((d%vis.numRows) * 1.2 + 5) * Math.cos(3.5*Math.PI / 16 + Math.floor(d / vis.numCols) * Math.PI / 16) * vis.width / (2.5 * vis.numCols);
            })
            .attr('y', function (d) {
                return vis.height - ((d%vis.numRows) * 2 + 6) * Math.sin(3.5*Math.PI / 16 + Math.floor(d / vis.numCols) * Math.PI / 16) * vis.height / (3 * vis.numRows);
            })
            .attr('width', 20)
            .attr("height", 20);

        vis.container.append("text")
            .text(`${vis.avgCapacity.toFixed(2)}%`)
            .attr("id", "percent")
            .attr("transform", `translate(${13+vis.width/2}, ${vis.height-40})`);

        vis.container.append("text")
            .text("of seats filled")
            .attr("id", "capacity")
            .attr("transform", `translate(${11+vis.width/2}, ${vis.height-25})`);
    }


    //call function to draw the graph
    wrangleData() {
        let vis = this;

        vis.sumCapacity = 0;
        vis.count = 0;
        vis.filteredData.forEach(d=>{
            vis.sumCapacity += parseFloat(d.capacity);
            vis.count += 1;
        })
        vis.avgCapacity = vis.sumCapacity/vis.count;
        vis.percent = Math.round(vis.avgCapacity)

        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;
        vis.drawGraph(vis.percent);
        vis.title.text(`Broadway Attendance Data from ${vis.selectStart} to ${vis.selectEnd}`);
    }
}