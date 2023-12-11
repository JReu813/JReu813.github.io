class EmpVis {

    constructor(parentElement, tooltipElement, data) {
        this.parentElement = parentElement;
        this.tooltipElement = tooltipElement;
        this.empData = data;

        this.initVis();
    }

    initVis(){
        let vis = this;
        console.log("success")

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${2*vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text(`Employment Data`)
            .attr('transform', `translate(${vis.margin.left+vis.width/ 2}, 20)`)
            .attr('text-anchor', 'middle');

        // tooltip
        vis.tooltip = d3.select(`#${vis.tooltipElement}`).append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

        vis.xScale = d3.scaleBand()
            .range([0, vis.width])

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)
            .ticks(5);

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .call(vis.xAxis)
            .attr("transform", "translate(0," + vis.height + ")")

        vis.svg.selectAll(".x-axis text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .call(vis.yAxis)

        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        console.log(vis.empData)

        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        vis.xScale.domain(vis.empData.map(d => d.year));
        vis.yScale.domain([0, d3.max(vis.empData, d => parseInt(d.employees))]);

        vis.bars = vis.svg.selectAll('rect')
            .data(vis.empData, d => d.year);

        vis.bars.exit().remove()

        vis.bars
            .enter()
            .append('rect')
            .merge(vis.bars)
            .attr("fill", "#c32a2a")
            .attr('x', d => vis.xScale(d.year))
            .attr("y", d => vis.yScale(parseInt(d.employees)))
            .attr("width", vis.xScale.bandwidth() - 5)
            .attr("height", d => vis.height - vis.yScale(parseFloat(d.employees)))

            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('fill', "#d17c72")
                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX + "px")
                        .style("top", event.pageY + "px")
                        .html(`
                                 <div style="border: thin solid grey; border-radius: 5px; background: darkred; padding: 20px">
                                 <h4> Year: ${d.year}</h4>
                                 <h4> Employees in the theater industry: ${d["employees"]}</h4>
                             </div>`);
                })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr("fill", d => ("#c32a2a"))
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })


        vis.bars.exit().remove()

        vis.svg.select(".x-axis")
            .call(vis.xAxis)

        vis.svg.select(".y-axis")
            .call(vis.yAxis)

    }



}