class TimeLine {

    constructor(parentElement, data, fulltimeline) {
        this.parentElement = parentElement;
        this.data = data;
        this.weeks = fulltimeline;
        this.parseDate = d3.timeParse("%Y-%m-%d");
        this.initVis();


    }


    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 55, bottom: 20, left: 40};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - 2 * vis.margin.left - 2 * vis.margin.right;
        vis.height = (document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom);


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${2 * vis.margin.left}, ${vis.margin.top})`);


        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(8);

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate(0, ${vis.height})`);


        // Append a path for the area function, so that it is later behind the brush overlay
        vis.timePath = vis.svg.append("path")
            .attr("class", "area");

        // TO-DO: Add Brushing to Chart
        let brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", brushed);
        vis.svg.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("height", vis.height);

        vis.svg.append("text")
            .attr("class", "title")
            .text("Weekly Attendance in All Broadway Theaters")
            .attr("transform", `translate(${vis.width / 2}, 30)`)

        vis.yaxis = vis.svg.append("g")
            .attr("class", "axis-title")
            .attr("transform", `translate(-50, ${vis.height/2})`);

       vis.yaxis.append("text")
            .text("Weekly Attendees")
            .attr("transform", "rotate(270)");

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */
    wrangleData() {
        let vis = this;

        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;
        vis.start = d3.min(vis.weeks, d => d.week);
        vis.stop = d3.max(vis.weeks, d => d.week);
        // Update domain
        vis.x.domain([vis.parseDate(vis.start), vis.parseDate(vis.stop)]);
        vis.max = d3.max(vis.data, d => d.attendance);
        vis.y.domain([0, vis.max * 1.1]);

        vis.area = d3.area()
            .curve(d3.curveCardinal)
            .x((d) => vis.x((vis.parseDate(d.week))))
            .y0(vis.height)
            .y1((d) => vis.y((d.attendance)));

        // Call the area function and update the path
        // D3 uses each data point and passes it to the area function. The area function translates the data into positions on the path in the SVG.
        vis.timePath
            .datum(vis.data)
            .attr("d", vis.area(vis.data))
            .attr("stroke", "#cca354")
            .attr("fill", "#444444");


        // Update axes
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);
    }
}