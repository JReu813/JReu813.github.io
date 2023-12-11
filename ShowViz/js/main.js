let w = document.getElementById("s1").getBoundingClientRect().width;
let h = document.getElementById("s1").getBoundingClientRect().height;

let svg1 = d3.select("#s1").append("svg")
    .attr("width", w)
    .attr("height", h);
svg1.append("circle")
    .attr("cx", w/2+10)
    .attr("cy", h/2-10)
    .attr("r", 220)
    .attr("fill", "#626262");
svg1.append("circle")
    .attr("cx", w/2)
    .attr("cy", h/2)
    .attr("r", 200)
    .attr("fill", "whitesmoke");
svg1.append("text")
    .attr("id", "pageTitle")
    .text("ShowViz!")
    .attr("stroke", "gold")
    .attr("fill", "#c32a2a")
    .attr("transform", `translate(${w/2}, ${h/2})`)
svg1.append('svg:image')
    .attr('href', 'img/curtain.svg')
    .attr("height", h)
    .attr("transform", "scale(1, 1)");
svg1.append('svg:image')
    .attr('href', 'img/curtainr.svg')
    .attr("height", h)
    .attr("transform", `translate(${w-326}, 0)`);

let finalslide = d3.select("#s6").append("svg")
    .attr("width", w)
    .attr("height", h);
finalslide.append('svg:image')
    .attr('href', 'img/EndScreen.svg')
    .attr("height", h)
    .attr("transform", `translate(30, 0)`);

let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

let timeLine,
    attenDance,
    broadwayMap,
    myEmpVis,
    mohamedVis,
    grossVis,
    attendVis,
    weeksVis,
    prodVis;

let promises = [
    d3.csv("data/total-seats.csv"),
    d3.csv("data/weekly-capacity.csv"),
    d3.csv("data/week-attendance.csv"),
    d3.csv("data/mapData.csv"),
    d3.csv("data/employment.csv"),
    d3.json("data/overview.json")
];

Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });
function createVis(data) {
    let totalSeats = data[0];
    let weeklyCapacity = data[1];
    let weeklyAttendance = data[2];
    let mapData = data[3];
    let empData = data[4];
    let MohamedData = data[5];

    console.log(data)
    console.log(totalSeats)
    console.log(weeklyCapacity)
    console.log(weeklyAttendance)
    console.log(empData)

    attenDance = new IsoType("isotype", "title", totalSeats, weeklyCapacity);
    timeLine = new TimeLine("timeline", weeklyAttendance, weeklyCapacity);
    broadwayMap = new BroadwayMap("broadway-map", mapData);
    myEmpVis = new EmpVis('emp-vis', "s5", empData);
    mohamedVis = new MohamedVis("main", MohamedData);
    grossVis = new MiniVis("grossRevenue", MohamedData)
    attendVis = new MiniVis("attendance", MohamedData)
    weeksVis = new MiniVis("weeksPlaying", MohamedData)
    prodVis = new MiniVis("productions", MohamedData)
}

function brushed() {
    attenDance.svg.selectAll(".delete").remove()
    attenDance.container.selectAll("text").remove()
    let selectionRange = d3.brushSelection(d3.select(".brush").node());
    // Convert the extent into the corresponding domain values
    let selectionDomain = selectionRange.map(timeLine.x.invert);
    let filtered = timeLine.weeks
    // Update focus chart (detailed information)
    let lengthTest = filtered.filter(d => dateParser(d.week) >= selectionDomain[0] &&
        dateParser(d.week) <= selectionDomain[1]);
    if (lengthTest.length > 0) {
        attenDance.filteredData = lengthTest;
        attenDance.selectStart = dateFormatter(selectionDomain[0]);
        attenDance.selectEnd = dateFormatter(selectionDomain[1]);
    }
    attenDance.wrangleData();
}

d3.select("#mohamedBox").on("change", change);
function change() {
    mohamedVis.selectValue = document.getElementById("mohamedBox").value;
    mohamedVis.updateVis();
}
function onClick(event) {
    let seasonIndex = event.target.id.slice(11)
    grossVis.seasonIndex = seasonIndex;
    attendVis.seasonIndex = seasonIndex;
    weeksVis.seasonIndex = seasonIndex;
    prodVis.seasonIndex = seasonIndex;
    grossVis.svg.transition()
        .duration(400)
        .attr("opacity", 1);
    attendVis.svg.transition()
        .duration(400)
        .attr("opacity", 1);
    weeksVis.svg.transition()
        .duration(400)
        .attr("opacity", 1);
    prodVis.svg.transition()
        .duration(400)
        .attr("opacity", 1);
    grossVis.updateVis();
    attendVis.updateVis();
    weeksVis.updateVis();
    prodVis.updateVis();
}