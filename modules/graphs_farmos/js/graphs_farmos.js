console.log("yash");
console.log("hello 3");
console.log("hello 4");
console.log("hello 4");
console.log("hello 5");
console.log("hello 6");
console.log("hello 7");
// const corsOptions = {
//   origin: 'http://localhost:5000',
//   credentials: true
// }

createLineChart();
createPieChart();
createScatterChart();

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
