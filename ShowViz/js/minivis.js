class MiniVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.keys = ["musicals", "plays", "specials"];
        this.colors = ["#c32a2a", "#d17c72", "#dfceb9"]
        this.seasonIndex = 14;

        this.initVis();
    }


    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 50, right: 100, bottom: 30, left: 100};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = (document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom);

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("opacity", 0)
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        //Totals Display
        vis.totals = vis.svg.append("g").attr("transform", `translate(${vis.width/2-26}, 0)`);
        vis.totals.append("image")
            .attr("href", "img/spiky.png")
            .attr("class", "img")
            .attr("width", 110);
        vis.totals.append("text")
            .attr("class", "totalTitle")
            .text("Total:")
            .attr("transform", `translate(55, 49)`);
        vis.totalVal = vis.totals.append("text")
            .attr("class", "totals")
            .attr("transform", `translate(55, 68)`);

        // Scales and axes
        vis.x = d3.scalePoint()
            .domain(vis.keys)
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate(30, ${vis.height})`)
            .call(vis.xAxis);

        vis.bars = vis.svg.selectAll("rect").data(vis.keys)
            .enter()
            .append("rect")
            .attr("id", (d, i) => `${vis.parentElement}bar${i}`)
            .attr("x", d => 5+vis.x(d))
            .attr("width", 50)
            .attr("stroke", "black");

        vis.title = vis.svg.append("text")
            .attr("class", "minititle")
            .attr("transform", `translate(${vis.width/2+31}, -5)`);

        vis.yaxis = vis.svg.append("g")
            .attr("class", "axis-title");

        vis.yAxisTitle = vis.yaxis.append("text")
            .attr("transform", "rotate(270)");

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */
    wrangleData() {
        let vis = this;
        console.log(vis.y(0))
        vis.updateVis();
    }



    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        //Update Domain
        vis.y
            .domain([0, vis.data[vis.seasonIndex][`${vis.parentElement}`].total*1.15+1])

        vis.keys.forEach((d, i) => {
            vis.barheight = vis.y(vis.data[vis.seasonIndex][vis.parentElement][d])
            d3.select(`#${vis.parentElement}bar${i}`)
                .transition()
                .duration(400)
                .attr("height", vis.height-vis.barheight)
                .attr("y", vis.barheight)
                .attr("fill", vis.colors[i]);
        })

        // Update axes
        vis.svg.select(".y-axis").transition().duration(400).call(vis.yAxis);

        if (vis.parentElement === "grossRevenue") {
            vis.totalVal.text(`${(vis.data[vis.seasonIndex][vis.parentElement].total/1000000000).toFixed(3)} Bil`);
            vis.title.text(`${vis.data[vis.seasonIndex].season} Season's Gross Revenue`);
            vis.yaxis.attr("transform", `translate(-71, ${vis.height/2})`);
            vis.yAxisTitle.text("Total USD");
        }
        else if (vis.parentElement === "attendance") {
            vis.totalVal.text(`${(vis.data[vis.seasonIndex][vis.parentElement].total/1000000).toFixed(2)} Mil`)
            vis.title.text(`${vis.data[vis.seasonIndex].season} Season's Attendance`);
            vis.yaxis.attr("transform", `translate(-61, ${vis.height/2})`);
            vis.yAxisTitle.text("Total Attendees");
        }
        else if (vis.parentElement === "weeksPlaying") {
            vis.totalVal.text(`${vis.data[vis.seasonIndex][vis.parentElement].total}`);
            vis.title.text(`${vis.data[vis.seasonIndex].season} Season's Total Playing Weeks`);
            vis.yaxis.attr("transform", `translate(-40, ${vis.height/2})`);
            vis.yAxisTitle.text("Total Weeks of Performance");
        }
        else {
            vis.totalVal.text(`${vis.data[vis.seasonIndex][vis.parentElement].total}`);
            vis.title.text(`${vis.data[vis.seasonIndex].season} Season's New Productions`);
            vis.yaxis.attr("transform", `translate(-30, ${vis.height/2})`);
            vis.yAxisTitle.text("Number of New Productions");
        }

    }
}