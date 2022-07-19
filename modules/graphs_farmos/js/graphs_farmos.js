function csvJSON(csv){
  var lines=csv.split("\n");
  var result = {};
  var headers=lines[0].split(",");
  for (var i = 0; i < headers.length; i++){
    if (isNaN(parseInt(headers[i]))) {
      headers[i] = headers[i].replace(/[^a-zA-Z ]/g, "");
    }
    result[headers[i]] = [];
      for (var j = 1; j < lines.length; j++){
        var currentline = lines[j].split(",");
        if (typeof currentline[i] === "string") {
          if (isNaN(parseInt(currentline[i]))) { 
            currentline[i] = currentline[i].replace(/[^a-zA-Z ]/g, '');
          }
        }
        result[headers[i]].push(currentline[i]);
      }
  }
  return JSON.stringify(result); //JSON
}

createLineChart();
createPieChart();
createScatterChart();
console.log("graphs_farmos.js");

function readFile(file) {
  console.log(file);
  const reader = new FileReader();
  reader.onload = function (e) { 
    // console.log(e.target.result);
    const data=csvJSON(e.target.result);
    console.log(data);
    console.log("hello")
  }
  reader.readAsText(file);
  console.log("hello")
}

const createGraph = () => {
  // console.log(this.value);
  console.log("create graph");
  let selectedFile = document.getElementById("file").files[0];
  document.getElementsByClassName("container")[0].innerHTML = "";
  readFile(selectedFile);
  const graph = `
  <div class="change-files-container">
  <input type="file" id="files"></input>
 </div>
  <div class="graph-container">
  <canvas id="pieChart" class="graph"></canvas>
  <div id="graph-type">Pie Chart</div>
  </div>
<div class="change-graph-container">
  <select onchange="changeGraph()" id="graph-select">
   <option value="pieChart">Select Graph</option>
   <option value="pieChart">Pie Chart</option>
   <option value="barChart">bar Chart</option>
  </select>
</div>`;
  document.getElementsByClassName("container")[0].innerHTML = graph;
}
function createLineChart() {
  var xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
  var yValues = [7,8,8,9,9,9,10,11,14,14,15];
  
  new Chart("lineChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: yValues
    }]
  },
    options: {
      legend: {display: false},
      scales: {
        yAxes: [{ticks: {min: 6, max:16}}],
      }
    }
  });
}

function createPieChart() {
  var barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145",
   "#ffffcc",
    "#cc33ff",
    "#00ff99",
    "#cc9900",
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145",
   "#ffffcc",
    "#cc33ff",
    "#00ff99",
    "#cc9900",
    "#ffffcc",
    "#cc33ff",
    "#00ff99",
    "#cc9900"
  ];
  fetch('http://127.0.0.1:5000/crops', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  ).then((response) => {
    response.json().then((data) => {
      const pieXValues = [];
      const pieYValues = [];
      Object.keys(data).map((index) => { 
        pieXValues.push(index);
        pieYValues.push(data[index]);
      });
      new Chart("pieChart", {
        type: "pie",
        data: {
          labels: pieXValues,
          datasets: [{
            backgroundColor: barColors,
            data: pieYValues
          }]
        },
        options: {
          title: {
            display: true,
            text: "Farm cattle analysis"
          }
        }
      });  
      console.log(pieXValues);
      console.log(pieYValues);
    })
  }).catch((err) => { 
    console.warn('Something went wrong.', err);
  });
}

function createScatterChart() {
  fetch('http://127.0.0.1:5000/revenue', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  ).then(function (response) {
    response.json().then(function (data) { 
      const xyData = [];
      Object.keys(data).map((index) => {
        xyData.push({x: index, y: data[index]});  
      });
      console.log(xyData);
      new Chart("scatterChart", {
        type: "scatter",
        data: {
          datasets: [{
            pointRadius: 4,
            pointBackgroundColor: "rgb(0,0,255)",
            data: xyData
          }]
        },
        options: {
          legend: {display: false},
          scales: {
            xAxes: [{ticks: {min: 40, max:8000}}],
            yAxes: [{ticks: {min: 6, max:28779056}}],
          }
        }
      });
    });
  }).catch(function (err) {
    console.warn('Something went wrong.', err);
  });
}

function createBarChart() {
  console.log("hello")
  var barColors = ["red", "green", "blue", "orange", "brown", "red", "green", "blue", "orange", "brown", "red", "green", "blue", "orange",
    "brown","red", "green", "blue", "orange", "brown","orange", "brown"];
  fetch('http://127.0.0.1:5000/crops', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  ).then(function (response) {
    console.log(response);
    response.json().then(function (data) { 
      const xData = [];
      const yData = [];
      Object.keys(data).map((index) => {
        xData.push(index);
        yData.push(data[index]);
      });
      console.log(data);
  new Chart("barChart", {
    type: "bar",
    data: {
    labels: xData,
    datasets: [{
      backgroundColor: barColors,
      data: yData
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "World Wine Production 2018"
    }
  }
  });
    });
   }).catch(function (err) { 
    console.warn('Something went wrong.', err);
  });
  // new Chart("barChart", {
  //   type: "bar",
  //   data: {
  //   labels: xValues,
  //   datasets: [{
  //     backgroundColor: barColors,
  //     data: yValues
  //   }]
  // },
  // options: {
  //   legend: {display: false},
  //   title: {
  //     display: true,
  //     text: "World Wine Production 2018"
  //   }
  // }
  // });
}

function changeGraph() {
  const graphContainer = document.getElementsByClassName("graph-container")[0];
  graphContainer.innerHTML = "";
  const graph = document.createElement("canvas");
  const graphType = document.getElementById("graph-select").value;
  graph.id = graphType;
  graph.className = "graph";
  graphContainer.appendChild(graph);
  if (graphType === "lineChart") {
    createLineChart();
  } else if (graphType === "pieChart") { 
    createPieChart();
  } else if (graphType === "barChart") {
    console.log("bar chart")
    createBarChart();
  } else {
    createScatterChart();
  }
  const graphHeading = document.createElement("p");
  graphHeading.id = "graph-type";
  graphHeading.innerHTML = graphType;
  graphContainer.appendChild(graphHeading);
}
