// defining global values
var globalGraphData = {}; // global graph data
const moduleType = document
  .getElementsByClassName("header-container")[0]
  .innerHTML.split(" ")[1]; // type of module to be plotted eg: harvest, animal etc
const globalAttributeColors = []; // global attribute colors

// generating colors for attributes to fill globalAttributeColors
function fillGlobalAttributeColors(colorsRequired) {
  for (let color = 0; color < colorsRequired; color++) {
    let generatedColor = getRandomColor(globalAttributeColors);
    globalAttributeColors.push(generatedColor);
  }
}

// generating a random color
function getRandomColor(barColors) {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  console.log(barColors, color);
  if (barColors.indexOf(color) == -1) {
    console.log(color);
    return color;
  }
  color = getRandomColor(barColors);
  return color;
}

// creating initial graph
const createGraph = async () => {
  console.log("execution starts");
  enableDisableLoading("enable");
  const graph = `
  <div class="time-stamp-container">
  <div class="time-stamp-sub-container">
  <div class="button-container">
    <p style="position: absolute" onClick="showTimeStamp()">Filter</p>
  </div>
  </div>
  </div>
  <div class="graph-container">
  <canvas id="Pie Chart" class="graph"></canvas>
  <div id="graph-type">Pie Chart</div>
  </div>
<div class="change-graph-container">
  <select onchange="changeGraph()" id="graph-select">
   <option value="Pie Chart">Select Graph</option>
   <option value="Pie Chart">Pie Chart</option>
   <option value="Bar Chart">Bar Chart</option>
  </select>
</div>`;
  if (moduleType === "Cattle") {
    let animalData ={}
    try {
      animalData = await fetch("http://localhost/api/asset/animal");
    }catch(error) {
      console.error(error);
    }
    animalData = await animalData.json();
    globalGraphData = processGraphData(animalData);
    console.log(globalGraphData);
  }
  if (moduleType === "Harvest") {
    let plantData = {}
    try {
      plantData = await fetch(
      "http://localhost/api/log/harvest?include=quantity"
    );
    } catch (error) {
      console.error(error);
    }
    plantData = await plantData.json();
    const plantHarvest = processGraphData(plantData);
    globalGraphData = plantHarvest;
  }
  document.getElementsByClassName("container")[0].innerHTML = "";
  document.getElementsByClassName("container")[0].style.flexDirection = "row";
  document.getElementsByClassName("container")[0].innerHTML = graph;
  document.getElementsByClassName("graph-container")[0].setAttribute("style", "width: 60%");
  fillGlobalAttributeColors(Object.keys(globalGraphData).length);
  createPieChart(globalGraphData);
};

// processing data to be used in creating graph
function processGraphData(processingData) {
  if (moduleType === "Harvest") {
    const plantHarvest = {};
    for (let i = 0; i < processingData.data.length; i++) {
      if (
        plantHarvest[
          processingData.data[i].attributes.name.substring(
            8,
            processingData.data[i].attributes.name.length
          )
        ] == undefined
      ) {
        plantHarvest[
          processingData.data[i].attributes.name.substring(
            8,
            processingData.data[i].attributes.name.length
          )
        ] = 0;
      }
      plantHarvest[
        processingData.data[i].attributes.name.substring(
          8,
          processingData.data[i].attributes.name.length
        )
      ] += parseFloat(processingData.included[i].attributes.value.decimal);
    }
    return plantHarvest;
  }
  if (moduleType == "Cattle") {
    const animalData = {};
    for (let i = 0; i < processingData.data.length; i++) {
      if (animalData[processingData.data[i].attributes.name] == undefined) {
        animalData[processingData.data[i].attributes.name] = 1;
      } else {
        animalData[processingData.data[i].attributes.name] += 1;
      }
    }
    return animalData;
  }
}

// showing date timestamp component
function showTimeStamp() {
  document.getElementsByClassName(
    "time-stamp-sub-container"
  )[0].style.justifyContent = "space-around";
  document.getElementsByClassName(
    "time-stamp-sub-container"
  )[0].innerHTML = `<div>
  From
  </div>
  <input type="date"></input>
  <div>
  To
  </div>
  <input type="date"></input>
  <button class="filter-button button-container"
  onClick="filterData()">Filter</button>
  `;
  console.log("hello");
}

// creating error message element
function createErrorElement(errorMessage) {
  const error = document.createElement("p");
  error.id = "error";
  error.setAttribute("style", "color: red; font-size: 12px");
  error.innerHTML = errorMessage;
  return error;
}

// filtering data based on timestamps, Note: to be implemented
async function filterData() {
  if (document.getElementById("error")!=undefined) {
    document.getElementById("error").remove();
  }
  const startValue = document.getElementsByTagName("input")[0].value;
  const endValue = document.getElementsByTagName("input")[1].value;
  let errorMessage = "";
   if (startValue == "" || endValue == "") {
     errorMessage = "Please select both start and end date";
   }
  let startDate = new Date(startValue);
  startDate = parseInt(startDate.getTime()) / 1000;
  let endDate = new Date(endValue);
  endDate = parseInt(endDate.getTime()) / 1000;
  if (startDate > endDate) {
    errorMessage = "Start date cannot be greater than end date";
  }
  if (errorMessage != "") {
    const error = createErrorElement(errorMessage);
    const timeStampContainer = document.getElementsByClassName(
      "time-stamp-sub-container"
    )[0];
    document
      .getElementsByClassName("time-stamp-sub-container")[0]
      .setAttribute("style", "justify-content: space-evenly;height: 50%");
    timeStampContainer.appendChild(error);
    return;
  }
  console.log(startValue, endValue);
  console.log(startDate, endDate);
  let filteredData = {};
  enableDisableLoading("enable");
  if (moduleType === "Harvest") {
    try {
       filteredData = await fetch(
      `http://localhost/api/log/harvest?filter[start][condition][path]=timestamp&filter[start][condition][operator]=>=&filter[start][condition][value]=${startDate}&filter[end][condition][path]=timestamp&filter[end][condition][operator]=<=&filter[end][condition][value]=${endDate}&include=quantity`
    );
    } catch (error) {
      console.error(e);
    }
  }
  if (moduleType === "Cattle") {
    try {
       filteredData = await fetch(
      `http://localhost/api/asset/animal?filter[start][condition][path]=created&filter[start][condition][operator]=>=&filter[start][condition][value]=${startDate}&filter[end][condition][path]=created&filter[end][condition][operator]=<=&filter[end][condition][value]=${endDate}`
    );
    }catch (error) {
      console.error(error);
    }
  }
  enableDisableLoading("disable");
  filteredData = await filteredData.json();
  console.log(filteredData);
  globalGraphData = processGraphData(filteredData);
  fillGlobalAttributeColors(Object.keys(globalGraphData).length);
  changeGraph();
}

// creating a pie chart
function createPieChart(values) {
  var barColors = globalAttributeColors;
  const pieXValues = [];
  const pieYValues = [];
  if (values != null) {
    const keys = Object.keys(values);
    for (let key = 0; key < Object.keys(values).length; key++) {
      pieXValues.push(keys[key]);
      pieYValues.push(values[keys[key]]);
    }
  }
  new Chart("Pie Chart", {
    type: "pie",
    data: {
      labels: pieXValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: pieYValues,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: `${moduleType} analysis`,
      },
    },
  });
}

// creating a bar chart
function createBarChart(values) {
  var barColors = globalAttributeColors;
  const barXValues = [];
  const barYValues = [];
  if (values != null) {
    const keys = Object.keys(values);
    for (let key = 0; key < Object.keys(values).length; key++) {
      barXValues.push(keys[key]);
      barYValues.push(values[keys[key]]);
    }
  }
  console.log(values);
  console.log("hello");
  new Chart("Bar Chart", {
    type: "bar",
    data: {
      labels: barXValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: barYValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: `${moduleType} analysis`,
      },
    },
  });
}

// adding loading to the screen
function enableDisableLoading(type) {
  if (type === "enable") {
      const graphContainer =
      document.getElementsByClassName("graph-container")[0];
      graphContainer.innerHTML = "";
      const loading = document.createElement("h3");
      loading.innerHTML = "Loading...";
      graphContainer.appendChild(loading);
  } else {
    document.getElementsByClassName("graph-container")[0].innerHTML = "";
  }
}

// changing graph type eg: going from pie chat to bar chart
function changeGraph() {
  const graphContainer = document.getElementsByClassName("graph-container")[0];
  graphContainer.innerHTML = "";
  console.log(globalGraphData);
  if (Object.keys(globalGraphData).length == 0) {
    const nullBanner = document.createElement("h4");
    nullBanner.innerHTML = "No data to display";
    graphContainer.appendChild(nullBanner);
    return;
  }
  const graph = document.createElement("canvas");
  const graphType = document.getElementById("graph-select").value;
  graph.id = graphType;
  graph.className = "graph";
  graphContainer.appendChild(graph);
  if (graphType === "Pie Chart") {
    createPieChart(globalGraphData);
  } else if (graphType === "Bar Chart") {
    console.log("bar chart");
    createBarChart(globalGraphData);
  }
  const graphHeading = document.createElement("p");
  graphHeading.id = "graph-type";
  graphHeading.innerHTML = graphType;
  graphContainer.appendChild(graphHeading);
}

// function createScatterChart() {
//   fetch('http://127.0.0.1:5000/revenue', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   }
//   ).then(function (response) {
//     response.json().then(function (data) {
//       const xyData = [];
//       Object.keys(data).map((index) => {
//         xyData.push({x: index, y: data[index]});
//       });
//       console.log(xyData);
//       new Chart("scatterChart", {
//         type: "scatter",
//         data: {
//           datasets: [{
//             pointRadius: 4,
//             pointBackgroundColor: "rgb(0,0,255)",
//             data: xyData
//           }]
//         },
//         options: {
//           legend: {display: false},
//           scales: {
//             xAxes: [{ticks: {min: 40, max:8000}}],
//             yAxes: [{ticks: {min: 6, max:28779056}}],
//           }
//         }
//       });
//     });
//   }).catch(function (err) {
//     console.warn('Something went wrong.', err);
//   });
// }

// function createLineChart() {
//   var xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
//   var yValues = [7,8,8,9,9,9,10,11,14,14,15];

//   new Chart("lineChart", {
//     type: "line",
//     data: {
//       labels: xValues,
//       datasets: [{
//         fill: false,
//         lineTension: 0,
//         backgroundColor: "rgba(0,0,255,1.0)",
//         borderColor: "rgba(0,0,255,0.1)",
//         data: yValues
//     }]
//   },
//     options: {
//       legend: {display: false},
//       scales: {
//         yAxes: [{ticks: {min: 6, max:16}}],
//       }
//     }
//   });
// }

// function readFile(file) {
//   // console.log(file);
//   const reader = new FileReader();
//   reader.onload = function (e) {
//     // console.log(e.target.result);
//     const data = JSON.parse(csvJSON(e.target.result));
//     // console.log(data['label']);
//     const graphData = toGraphData(data['label']);
//     globalGraphData = graphData;
//     console.log(graphData);
//     createPieChart(graphData);
//     // return graphData;
//     // console.log(data);
//     // console.log("hello");
//   }
//   reader.readAsText(file);
//   console.log("hello");
// }
// function toGraphData(a) {
//   var newArr = {};
//   for (var i = 0; i < a.length; i++) {
//       if (!newArr[a[i]]) {
//           newArr[a[i]]=1;
//       } else {
//           newArr[a[i]]++;
//       }
//   }
//   return newArr;
// }

// function csvJSON(csv){
//   var lines=csv.split("\n");
//   var result = {};
//   var headers=lines[0].split(",");
//   for (var i = 0; i < headers.length; i++){
//     if (isNaN(parseInt(headers[i]))) {
//       headers[i] = headers[i].replace(/[^a-zA-Z ]/g, "");
//     }
//     result[headers[i]] = [];
//       for (var j = 1; j < lines.length; j++){
//         var currentline = lines[j].split(",");
//         if (typeof currentline[i] === "string") {
//           if (isNaN(parseInt(currentline[i]))) {
//             currentline[i] = currentline[i].replace(/[^a-zA-Z ]/g, '');
//           }
//         }
//         result[headers[i]].push(currentline[i]);
//       }
//   }
//   return JSON.stringify(result); //JSON
// }
