function generateData() {
	newData = [
			{ Month: "January", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "February", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "March", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "April", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "May", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "June", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "July", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "August", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "September", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "October", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "November", Revenue: Math.round(Math.random() * 30000) },
			{ Month: "December", Revenue: Math.round(Math.random() * 30000) },
	]

	return newData;
}

function makeGraph() {
	//Width and height
	var w = 800;
	var h = 600;
	var padding = 50;
	var barPadding = 10;
	var margin = {top: 20, right: 20, bottom: 30, left: 40};

	newData = generateData();

	console.log(newData);

	var dataset, xScale, yScale, xAxis, yAxis;  //Empty, for now

	//For converting strings to Dates
	var parseTime = d3.timeParse("%B");

	//For converting Dates to strings
	var formatTime = d3.timeFormat("%e");

	var parseMonth = d3.timeParse("%b");

	//Function for converting CSV values from strings to Dates and numbers
	var rowConverter = function(d) {
		return {
			Month: d.Month,
			Revenue: parseInt(d.Revenue)
		};
	}

	//Load in the data
	d3.csv("revenue.csv", rowConverter, function(data) {

		//Copy data into global dataset
		dataset = newData;

		console.log(dataset);

		var yScale = d3.scaleLinear()
			.domain([0, d3.max(dataset, function(d) { return d.Revenue; })])
			.range([h, 0+margin.top]);

		var theScale = d3.scaleLinear()
			.domain([0, d3.max(dataset, function(d) { return d.Revenue; })])
			.range([0, h-margin.top]);

		//xScale = d3.scaleBand().rangeRound([0, w]).padding(0.1);

		var colourScale = d3.scaleLinear()
			.domain([0, 28000, d3.max(dataset, function(d) { return d.Revenue; })])
			.range(['red', 'green']);

		yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(10)
			.tickFormat(function(d) { return "£" + d } );

		xAxis = d3.scaleBand()
				.domain(dataset.map(function(d) { return d.Month }))
				.range([0, w])

		var svg = d3.select("body")
			.append("svg")
			.attr("height", h+padding)
			.attr("width", w+padding);

		svg.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
			.on("click", function(d) {
				alert(d.Revenue);
			})
			.attr("x", function(d, i) {
				return i * (w / dataset.length) + padding;
			})
			.attr("y", function(d) {
				return h - theScale(d.Revenue);
			})
			.attr("fill", function(d) {
				return colourScale(d.Revenue);
			})
			.attr("width", function(d, i) {
				return w / dataset.length - barPadding;
			})
			.attr("height", function(d, i) {
				return theScale(d.Revenue);
			});

		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + padding + ",0)")
			.call(yAxis);
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + padding + "," + h + ")")
			.call(d3.axisBottom(xAxis));

		d3.select("button")
			.on("click", function() {
				newData = generateData();
				svg.selectAll("rect")
					.data(newData)
					.transition()
					.duration(3000)
					.attr("y", function(d) {
						return h - theScale(d.Revenue);
					})
					.attr("fill", function(d) {
						return colourScale(d.Revenue);
					})
					.attr("height", function(d) {
						return theScale(d.Revenue);
					});
			});
	});
}

function updateGraph() {

}