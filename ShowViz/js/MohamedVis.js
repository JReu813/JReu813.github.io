class MohamedVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.seasons = [];
        this.data.forEach(d => this.seasons.push(d.season));
        this.selectValue = "grossRevenue";
        this.keys = ["musicals", "plays", "specials", "total"];
        this.colors = ["#c32a2a", "#d17c72", "#dfceb9", "#cca354"]

        this.initVis();
    }


    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 30, right: 40, bottom: 20, left: 100};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = (document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom);

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        //legend group
        vis.legend = vis.svg.append("g")
            .attr("transform", "translate(10, 0)")

        // Add one box in the legend for each name.
        vis.legend.selectAll(".dots")
            .data(vis.keys)
            .enter()
            .append("rect")
            .attr("class", "dots")
            .attr("x", 0)
            .attr("y", (d, i) => i*(10+5))
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", (d, i) => vis.colors[i]);

        // Add one label in the legend for each name.
        vis.legend.selectAll(".labels")
            .data(vis.keys)
            .enter()
            .append("text")
            .attr("class", "labels")
            .attr("x", 10*1.2)
            .attr("y", (d, i) => 5+i*(10+5))
            .attr("fill", (d, i) => vis.colors[i])
            .text(d => d)

        // Scales and axes
        vis.x = d3.scalePoint()
            .domain(vis.seasons)
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.yaxis = vis.svg.append("g")
            .append("text")
            .attr("class", "axisLabel");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate(0, ${vis.height})`);


        // Append a path for the area function, so that it is later behind the brush overlay
        vis.totPath = vis.svg.append("path")
            .attr("class", "area");

        vis.musOut = vis.svg.append("path")
            .attr("class", "outline");
        vis.musPath = vis.svg.append("path")
            .attr("class", "path");

        vis.playOut = vis.svg.append("path")
            .attr("class", "outline");
        vis.playPath = vis.svg.append("path")
            .attr("class", "path");

        vis.specOut = vis.svg.append("path")
            .attr("class", "outline");
        vis.specPath = vis.svg.append("path")
            .attr("class", "path");

        vis.title = vis.svg.append("text")
            .attr("class", "mtitle")
            .attr("transform", `translate(${vis.width/2}, -10)`);

        vis.circles = vis.svg.selectAll("circle")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("id", (d, i) => `mohamedcirc${i}`)
            .attr("cx", d => vis.x(d.season))
            .attr("r", 9)
            .attr("fill", vis.colors[3])
            .attr("stroke", "black")
            .on("mouseover", vis.mouseover)
            .style("cursor", "hand")
            .on("mouseout", vis.mouseout)
            .on("click", onClick);

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
        // Update domain
        vis.y
            .domain([0, d3.max(vis.data, d=>d[vis.selectValue].total)*1.15]);

        vis.area = d3.area()
            .curve(d3.curveCatmullRom.alpha(0.5))
            .x((d) => vis.x(d.season))
            .y0(vis.height)
            .y1((d) => vis.y(d[vis.selectValue].total));

        vis.mus = d3.line()
            .curve(d3.curveCatmullRom.alpha(0.5))
            .x((d) => vis.x(d.season))
            .y((d) => vis.y(d[vis.selectValue].musicals));

        vis.play = d3.line()
            .curve(d3.curveCatmullRom.alpha(0.5))
            .x((d) => vis.x(d.season))
            .y((d) => vis.y(d[vis.selectValue].plays));

        vis.spec = d3.line()
            .curve(d3.curveCatmullRom.alpha(0.5))
            .x((d) => vis.x(d.season))
            .y((d) => vis.y(d[vis.selectValue].specials));



        // Call the area function and update the path
        // D3 uses each data point and passes it to the area function. The area function translates the data into positions on the path in the SVG.
        vis.totPath
            .datum(vis.data)
            .transition()
            .duration(400)
            .attr("d", vis.area(vis.data))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", vis.colors[3]);

        vis.musOut
            .datum(vis.data)
            .transition()
            .duration(400)
            .attr("d", vis.mus(vis.data))
            .attr("stroke", vis.colors[0])
            .attr("stroke-width", 8)
            .attr("fill", "none");
        vis.musPath
            .datum(vis.data)
            .transition()
            .duration(400)
            .attr("d", vis.mus(vis.data))
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("fill", "none");

        vis.playOut
            .datum(vis.data)
            .transition()
            .duration(400)
            .attr("d", vis.play(vis.data))
            .attr("stroke", vis.colors[1])
            .attr("stroke-width", 8)
            .attr("fill", "none");
        vis.playPath
            .datum(vis.data)
            .transition()
            .duration(400)
            .attr("d", vis.play(vis.data))
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("fill", "none");

        vis.specOut
            .datum(vis.data)
            .transition()
            .duration(400)
            .attr("d", vis.spec(vis.data))
            .attr("stroke", vis.colors[2])
            .attr("stroke-width", 8)
            .attr("fill", "none");
        vis.specPath
            .datum(vis.data)
            .transition()
            .duration(400)
            .attr("d", vis.spec(vis.data))
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("fill", "none");

        vis.circles
            .transition()
            .duration(400)
            .attr("cy", d => vis.y(d[vis.selectValue].total));
        vis.circles.exit().remove();

        // Update axes
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);

        // Update axes
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);

        if (vis.selectValue === "grossRevenue") {
            vis.title.text(`Gross Revenue by Broadway Season`);
        }
        else if (vis.selectValue === "attendance") {
            vis.title.text(`Attendance by Broadway Season`);
        }
        else if (vis.selectValue === "weeksPlaying") {
            vis.title.text(`Total Playing Weeks by Broadway Season`);
        }
        else {
            vis.title.text(`New Productions by Broadway Season`);
        }
    }
    mouseover(event) {
        let vis = this;
        d3.select(`#${event.toElement.id}`).attr("stroke", "#c32a2a")
            .attr("stroke-width", 2);
    }
    mouseout(event) {
        let vis = this;
        d3.select(`#${event.fromElement.id}`).attr("stroke", "black")
            .attr("stroke-width", 1);
    }
}