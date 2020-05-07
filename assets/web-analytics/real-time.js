$(function () {

	var activeUsers = 13,
			pageViewsPerSecondLowerLimit,
			pageViewsPerSecondUpperLimit,
			yValuePageViewsPerSecond,
			sumYValuePageViewsPerSecond = 0,
			numberOfSeconds = 1,
			updateChartsInterval,
			updateChartsIntervalLowerLimit = 4000, // milliseconds
			updateChartsIntervalUpperLimit = 6000, // milliseconds
			timeoutIdUpdateCharts;
	
	var pageViewsPerSecondDataPoints = [];
	var pageViewsPerMinuteDataPoints = [];
	
	// data for demo only
	var initialDataPageViewsPerSecond = [1,2,4,4,3,2,1,5,1,2,2,0,0,1,2,4,5,3,4,2,2,2,2,0,1,2,4,4,4,5,5,1,2,4,1,1,1,0,0,1,2,3,3,5,5,2,0,1,1,0,2,2,2,0,4,1,4,4,2,2];
	var initialDataPageViewsPerMinute = [110,107,122,107,128,108,100,110,118,93,95,112,108,95,96,114,107,105,124,104,131,94,109,110,108,99,104,90,104,109,89,121,118,93,109,113,106,100,101,119,76,137,112,104,98,89,104,96,120,111,108,95,93,100,101,110,98,105,107,135];
	
	// data for demo only
	var data = [
		{
			activeUsers: 21,
			pageViewsPerSecondLowerLimit: 0,
			pageViewsPerSecondUpperLimit: 3,

			device: [
				{ name: "Articles", users: 10 },
				{ name: "Conference Proceedings", users: 2 },
				{ name: "Posters", users: 5 },
				{ name: "Reports", users: 2 },
				{ name: "Data Depository", users: 2 }
			],
			trafficMedium: [
				{ name: "Climate Change", users: 8 },
				{ name: "Hydrology", users: 10 },
				{ name: "Reservoir Management", users: 5 },
				{ name: "Socio-economic Development", users: 4 },
				{ name: "Computational Engineering", users: 2 },
				{ name: "Risk Analysis", users: 4 }
			],
			categories: [
				{ name: "MATLAB", users: 19 },
				{ name: "R", users: 18},
				{ name: "GIS", users: 20 },
				{ name: "Python", users:4 },
				{ name: "HTML", users: 6 }
			],
			states: [
				{ name: "Turkey", users: 1 },
				{ name: "Philippines", users: 1 },
				{ name: "India", users: 2 },
				{ name: "Thailand", users: 5 },
				{ name: "Lao PDR", users: 1 },
				{ name: "Vietnam", users:3 },
			]
		}
		
	];
	
	CanvasJS.addColorSet("customColorSet", [ 
		"#393f63",
		"#e5d8B0", 
		"#ffb367", 
		"#f98461", 
		"#d9695f",
		"#e05850",
	]);
	
	// CanvasJS doughnut chart to show device type of active users
	var usersDeviceDoughnutChart = new CanvasJS.Chart("users-device-doughnut-chart", {
		animationDuration: 800,
		animationEnabled: true,
		backgroundColor: "transparent",
		colorSet: "customColorSet",
		theme: "theme2",
		legend: {
			fontFamily: "calibri",
			fontSize: 14,
			horizontalAlign: "left",
			verticalAlign: "center",
			itemTextFormatter: function (e) {
				return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / activeUsers * 100) + "%";  
			} 
		},
		title: {
			dockInsidePlotArea: true,
			fontSize: 55,
			fontWeight: "normal",
			horizontalAlign: "center",
			verticalAlign: "center",
			text: "22"
		},
		toolTip: {
			cornerRadius: 0,
			fontStyle: "normal",
			contentFormatter: function (e) {
				return e.entries[0].dataPoint.name + ": " + Math.round(e.entries[0].dataPoint.y / activeUsers * 100) + "% (" + e.entries[0].dataPoint.y  + ")";
			} 
		},
		data: [
			{
				innerRadius: "80%",
				radius: "86%",
				legendMarkerType: "square",
				showInLegend: true,
				startAngle: 90,
				type: "doughnut",
				dataPoints: [
					{  y: 1, name: "Articles" },
					{  y: 1, name: "Proceedings" },
					{  y: 1, name: "Posters" },
					{  y: 1, name: "Final Reports" },
					{  y: 1, name: "Data Depository" }
				]
			}
		]
	});
	
	// CanvasJS pie chart to traffic medium of active users
	var usersMediumPieChart = new CanvasJS.Chart("users-medium-pie-chart", {
		animationDuration: 800,
		animationEnabled: true,
		backgroundColor: "transparent",
		colorSet: "customColorSet",
		legend: {
			fontFamily: "calibri",
			fontSize: 14,
			horizontalAlign: "left",
			verticalAlign: "center",
			itemTextFormatter: function (e) {
				return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / activeUsers * 100) + "%";  
			}
		},
		toolTip: {
			cornerRadius: 0,
			fontStyle: "normal",
			contentFormatter: function (e) {
				return e.entries[0].dataPoint.name + ": " + Math.round(e.entries[0].dataPoint.y / activeUsers * 100) + "% (" + e.entries[0].dataPoint.y  + ")";  
			} 
		},
		data: [
			{
				legendMarkerType: "square",
				radius: "100%",
				showInLegend: true,
				startAngle: 90,
				type: "pie",
				dataPoints: [
					{  y: 1, name:"Climate Change" },
					{  y: 1, name:"Hydrology" },
					{  y: 1, name:"Reservoirs" },
					{  y: 1, name:"Socioeconomic " },
					{  y: 1, name:"Computation" },
					{  y: 1, name:"Risk Analysis" }
				]
			}
		]
	});

	// CanvasJS pie chart to active users by category
	var usersCategoryPieChart = new CanvasJS.Chart("users-category-pie-chart", {
		animationDuration: 800,
		animationEnabled: true,
		backgroundColor: "transparent",
		colorSet: "customColorSet",
		legend: {
			fontFamily: "calibri",
			fontSize: 14,
			horizontalAlign: "left",
			verticalAlign: "center",
			maxWidth: null,
			itemTextFormatter: function (e) {
				return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / activeUsers * 100) + "%";  
			}
		},
		toolTip: {
			cornerRadius: 0,
			fontStyle: "normal",
			contentFormatter: function (e) {
				return e.entries[0].dataPoint.name + ": " + Math.round(e.entries[0].dataPoint.y / activeUsers * 100) + "% (" + e.entries[0].dataPoint.y  + ")";
			} 
		},
		data: [
			{
				legendMarkerType: "square",
				radius: "86%",
				showInLegend: true,
				startAngle: 90,
				type: "pie",
				dataPoints: [
					{ y: 1, name:"MATLAB" },
					{ y: 1, name:"R" },
					{ y: 1, name:"GIS" },
					{ y: 1, name:"Python" },
					{ y: 1, name:"HTML" }
				]
			}
		]
	});
			
	// CanvasJS column chart to show live page views per minute
	var pageViewsPerMinuteColumnChart = new CanvasJS.Chart("page-views-per-minute-column-chart", {
		animationDuration: 800,
		animationEnabled: true,
		backgroundColor: "transparent",
		axisX: {
			interval: 1,
			intervalType: "minute",
			labelAutoFit: false,
			labelFontColor: "#717171",
			lineColor: "#a2a2a2",
			tickColor: "transparent",
			tickLength: 2,
			labelFormatter: function(e) {
				var diff, currentTime = (new Date()).getTime();
				diff = Math.floor((e.value.getTime() - currentTime) / (1000 * 60));
				return diff % 15 < 0 ? "" : diff + " min";
			}
		},
		axisY: {
			includeZero: false,
			gridThickness: 0,
			labelFontColor: "#717171",
			lineColor: "#a2a2a2",
			tickColor: "#a2a2a2"
		},
		toolTip: {
			cornerRadius: 0,
			fontStyle: "normal"
		},
		data: [
			{
				color: "#424973",
				xValueFormatString: "hh:mm TT",
				type: "column",
				dataPoints : pageViewsPerMinuteDataPoints
			}
		]
	});

	// CanvasJS column chart to show live page views per second
	var pageViewsPerSecondColumnChart = new CanvasJS.Chart("page-views-per-second-column-chart", {
		animationDuration: 800,
		animationEnabled: true,
		backgroundColor: "transparent",
		axisX: {						
			interval: 1,
			intervalType: "second",
			labelAutoFit: false,
			labelFontColor: "#717171",
			lineColor: "#a2a2a2",
			tickColor: "transparent",
			tickLength: 2,
			labelFormatter: function(e) {
				var diff, currentTime = (new Date()).getTime();
				diff = Math.floor((e.value.getTime() - currentTime) / 1000);
				return diff % 15 < 0 ? "" : diff + " sec";
			}
		},
		axisY: {
			gridThickness: 0,
			labelFontColor: "#717171",
			lineColor: "#a2a2a2",
			tickColor: "#a2a2a2"
		},
		toolTip: {
			cornerRadius: 0,
			fontStyle: "normal",
		},
		data: [
			{
				color: "#CD5740",
				xValueFormatString: "hh:mm:ss TT",
				type: "column",
				dataPoints : pageViewsPerSecondDataPoints
			}
		]
	});

	// CanvasJS bar chart to show active users by state
	var usersStateBarChart = new CanvasJS.Chart("users-state-bar-chart", {
		animationDuration: 800,
		animationEnabled: true,
		backgroundColor: "transparent",
		colorSet: "customColorSet",
		axisX: {
			labelFontColor: "#717171",
			labelFontSize: 18,
			lineThickness: 0,
			tickThickness: 0
		},
		axisY: {
			gridThickness: 0,
			lineThickness: 0,
			tickThickness: 0,
			valueFormatString: " "
		},
		toolTip: {
			cornerRadius: 0,
			fontStyle: "normal",
			contentFormatter: function (e) {
				return e.entries[0].dataPoint.label + ": " + Math.round(e.entries[0].dataPoint.y / activeUsers * 100) + "% (" + e.entries[0].dataPoint.y  + ")";
			} 
		},
		data: [
			{
				indexLabelFontColor: "#717171",
				indexLabelFontFamily: "calibri",
				indexLabelFontSize: 18,
				indexLabelPlacement: "outside",
				indexLabelFormatter: function (e) {
					return Math.round(e.dataPoint.y / activeUsers * 100) + "%";  
				},
				type: "bar",
				dataPoints: [
					{ y: 1,  label: "Turkey" },
					{ y: 1, label: "Philippines" },
					{ y: 1,  label: "India" },
					{ y: 7, label: "Thailand" },
					{ y: 1, label: "Lao PDR" },
					{ y: 1, label: "Vietnam" }
				]
			}
		]
	});

	usersStateBarChart.render();
	
	//----------------------------------------------------------------------------------//
	var allCharts = [
		usersDeviceDoughnutChart,
		usersMediumPieChart,
		usersCategoryPieChart,
		pageViewsPerSecondColumnChart,
		pageViewsPerMinuteColumnChart,
		usersStateBarChart
	];
	
	// generate random number between given range
	function generateRandomNumber (minimum, maximum) {
		return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
	}
	
	function updateUsersDeviceChart(dataIndex) {
		usersDeviceDoughnutChart.options.title.text = activeUsers.toString();
		
		for (var i = 0; i < data[dataIndex].device.length; i++)
			usersDeviceDoughnutChart.options.data[0].dataPoints[i].y = data[dataIndex].device[i].users;
		
		usersDeviceDoughnutChart.render();
	}
	
	function updateUsersMediumPieChart(dataIndex) {
		for (var i = 0; i < data[dataIndex].trafficMedium.length; i++)
			usersMediumPieChart.options.data[0].dataPoints[i].y = data[dataIndex].trafficMedium[i].users;
		
		usersMediumPieChart.render();
	}
	
	function updateUsersCategoryChart(dataIndex) {
		for (var i = 0; i < data[dataIndex].categories.length; i++)
			usersCategoryPieChart.options.data[0].dataPoints[i].y = data[dataIndex].categories[i].users;
		
		usersCategoryPieChart.render();
	}
	
	function updateUsersStateChart(dataIndex) {
		for (var i = 0; i < data[dataIndex].states.length; i++)
			usersStateBarChart.options.data[0].dataPoints[i].y = data[dataIndex].states[i].users;
		
		usersStateBarChart.render();
	}
	
	// update all charts with revelant demo data, except "Page Views Per Second" and "Page Views Per Minute" charts
	function updateCharts(dataIndex) {
		activeUsers = data[dataIndex].activeUsers;
		pageViewsPerSecondLowerLimit = data[dataIndex].pageViewsPerSecondLowerLimit;
		pageViewsPerSecondUpperLimit = data[dataIndex].pageViewsPerSecondUpperLimit;

		updateUsersDeviceChart(dataIndex);
		updateUsersMediumPieChart(dataIndex);
		updateUsersCategoryChart(dataIndex);
		updateUsersStateChart(dataIndex);
	}
	
	function updateChartsAtRandomIntervals() {
		var dataIndex = generateRandomNumber(0, data.length - 1);
		updateChartsInterval = generateRandomNumber(updateChartsIntervalLowerLimit, updateChartsIntervalUpperLimit);
				
		updateCharts(dataIndex);
		
		if (timeoutIdUpdateCharts)
			clearTimeout(timeoutIdUpdateCharts);
		
		timeoutIdUpdateCharts = setTimeout(function () {
			updateChartsAtRandomIntervals();
		}, updateChartsInterval);
	}
	
	// populate "Page Views Per Second" and "Page Views Per Minute" charts with initial data
	function populatePageViewsCharts() {
		var time1, time2;
		
		for (var i = 0; i < 60; i++) {
			time1 = new Date((new Date).getTime() - ((59 - i) * 1000)); // for pageViewsPerSecond chart 
			time1.setMilliseconds(0);
			
			time2 = new Date((new Date).getTime() - ((59 - i) * 60 * 1000)); // for pageViewsPerMinute chart
			time2.setSeconds(0);
			
			pageViewsPerSecondDataPoints.push({ x: time1, y: initialDataPageViewsPerSecond[i] });
			pageViewsPerMinuteDataPoints.push({ x: time2, y: initialDataPageViewsPerMinute[i] });
		}
	
		pageViewsPerSecondColumnChart.render();
		pageViewsPerMinuteColumnChart.render();	
	}
	
	// update "Page Views Per Second" chart every second and "Page Views Per Minute" chart every minute
	function updatePageViewsCharts() {
		var time1, time2;
		time1 = new Date();
		time1.setMilliseconds(0);
		
		yValuePageViewsPerSecond = generateRandomNumber(pageViewsPerSecondLowerLimit, pageViewsPerSecondUpperLimit); 
		
		pageViewsPerSecondDataPoints.push({ x: time1, y: yValuePageViewsPerSecond });
    
    if (pageViewsPerSecondDataPoints.length > 60)
    	pageViewsPerSecondDataPoints.shift();

		pageViewsPerSecondColumnChart.render();		

    sumYValuePageViewsPerSecond += yValuePageViewsPerSecond;
		
		if (numberOfSeconds >= 60) {
			time2 = new Date();
			time2.setSeconds(0);
			
    	pageViewsPerMinuteDataPoints.push({ x: time2, y: sumYValuePageViewsPerSecond });
			
			if (pageViewsPerMinuteDataPoints.length > 60) 
				pageViewsPerMinuteDataPoints.shift();
			
      pageViewsPerMinuteColumnChart.render();
      
			sumYValuePageViewsPerSecond = 0;
      numberOfSeconds = 0;
    }
    
    numberOfSeconds++;
}
	
	// chart properties cutomized further based on screen width	
	function chartPropertiesCustomization(chart) {
		if ($(window).outerWidth() >= 1920) {			
			
			chart.options.legend.fontSize = 14;
			chart.options.legend.horizontalAlign = "left";
			chart.options.legend.verticalAlign = "center";
			chart.options.legend.maxWidth = null;
			
		}else if ($(window).outerWidth() < 1920 && $(window).outerWidth() >= 1200) {
			
			chart.options.legend.fontSize = 14;
			chart.options.legend.horizontalAlign = "left";
			chart.options.legend.verticalAlign = "center";
			chart.options.legend.maxWidth = 140;
			
		} else if ($(window).outerWidth() < 1200 && $(window).outerWidth() >= 992) {
			
			chart.options.legend.fontSize = 12;
			chart.options.legend.horizontalAlign = "center";
			chart.options.legend.verticalAlign = "top";
			chart.options.legend.maxWidth = null;
			
		} else if ($(window).outerWidth() < 992) {
			
			chart.options.legend.fontSize = 14;
			chart.options.legend.horizontalAlign = "center";
			chart.options.legend.verticalAlign = "bottom";
			chart.options.legend.maxWidth = null;
			
		}
		
		chart.render();
	}
	
	function customizeCharts() {
		chartPropertiesCustomization(usersDeviceDoughnutChart);
		chartPropertiesCustomization(usersMediumPieChart);
		chartPropertiesCustomization(usersCategoryPieChart);
	}
	
	function renderAllCharts() {
		for (var i = 0; i < allCharts.length; i++)
			allCharts[i].render();
	}
	
	function sidebarToggleOnClick() {
		$('#sidebar-toggle-button').on('click', function () {
			$('#sidebar').toggleClass('sidebar-toggle');
			$('#page-content-wrapper').toggleClass('page-content-toggle');
			renderAllCharts();
		});	
	}
	
	(function init() {
		customizeCharts();
		$(window).resize(customizeCharts);
		populatePageViewsCharts();
		setInterval(updatePageViewsCharts, 1000);
		setTimeout(updateChartsAtRandomIntervals, 4000);
		sidebarToggleOnClick();
	})();
	
});