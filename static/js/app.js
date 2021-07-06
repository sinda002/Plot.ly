function init() {
    d3.json("data/samples.json").then(function (jsonData) {
      let data = jsonData;
      //console.log(data);
  
      //Capturing the id, which we will call names for the drop-down menu
      let dataNames = data.names;
      var dropDownMenu = d3.select("#selDataset");
  
      dataNames.forEach(function (name) {
        dropDownMenu.append("option").text(name).property("value", name);
      });
  
      let selectedID = "940";
  
      datapull(selectedID);
    });
  }
  
  function datapull(selectedID) {
    d3.json("data/samples.json").then(function (jsonData) {
      console.log("1. pull data");
      let data = jsonData;
  
      let testSubject = data.samples.filter((val) => val.id == selectedID);
      //console.log(testSubject);
      var testSubjectObj = testSubject[0];
      //console.log(testSubjectObj);
  
      let otu_ids = testSubjectObj.otu_ids;
      //otu_ids = otu_ids.slice(0, 10);
      //console.log(otu_ids);
  
      let otu_idList = [];
      for (let i = 0; i < otu_ids.length; i++) {
        otu_idList.push(`OTU# ${otu_ids[i]}`);
      }
  
      let sample_values = testSubjectObj.sample_values;
      //sample_values = sample_values.slice(0, 10);
      //console.log(sample_values);
  
      let otu_labels = testSubjectObj.otu_labels;
      //otu_labels = otu_labels.slice(0, 10);
      //console.log(otu_labels);
  
      let testSubjectDemos = data.metadata.filter((val) => val.id == selectedID);
      testSubjectDemos = testSubjectDemos[0];
      console.log(testSubjectDemos);
  
      let wfreq = Object.values(testSubjectDemos)[6];
      console.log(wfreq);
  
      let results = {
        idStr: otu_idList,
        ids: otu_ids,
        values: sample_values,
        labels: otu_labels,
      };
  
      barChart(results);
      bubbleChart(results);
      gaugeChart(wfreq);
      generateTable(testSubjectDemos);
    });
  }
  
  //*******************************************//
  
  function barChart(results) {
    console.log("2 bar chart");
    // let results = datapull(selectedID);
    console.log(results);
    let otu_ids = results.idStr.slice(0, 10);
    let sample_values = results.values.slice(0, 10);
    let otu_labels = results.labels.slice(0, 10);
    let otuNumID = results.ids.slice(0, 10);
    let colors = [];
    for (let i = 0; i < sample_values.length; i++) {
      colors.push("rgb(0,0," + (1 - sample_values[i] / 180) + ")");
    }
    console.log(sample_values);
  
    let trace = {
      x: sample_values,
      y: otu_ids,
      mode: "markers",
      marker: {
        color: colors,
        line: {
          width: 1,
        },
      },
      orientation: "h",
      type: "bar",
    };
  
    let plotdata = [trace];
  
    let layout = {
      hoverinfo: otu_labels,
      title: {
        text: "Top 10 Microbial Species Found <br> in Subject's Belly Button",
        font: {
          size: 20,
          xanchor: "left",
          yanchor: "top",
        },
      },
      autosize: false,
      width: 375,
      height: 550,
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4,
      },
      yaxis: {
        autorange: "reversed",
        automargin: true,
      },
      xaxis: {
        title: {
          text: "Num. Microbial Species",
          font: {
            family: "Overpass, Open Sans, Raleway",
            size: 11,
          },
        },
      },
    };
  
    let config = {
      responsive: true,
    };
  
    Plotly.newPlot("bar", plotdata, layout, config);
  }
  
  //*******************************************//
  
  function bubbleChart(results) {
    let otu_ids = results.ids;
    let sample_values = results.values;
    let otu_labels = results.labels;
  
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
      },
    };
  
    var data = [trace1];
  
    var layout = {
      title: "OTU ID vs Sample Value",
      font: {
        family: "Overpass, Open Sans, Raleway",
      },
      showlegend: false,
      height: 600,
      width: 1200,
    };
  
    var config = {
      responsive: true,
    };
    Plotly.newPlot("bubble", data, layout, config);
  }
  
  //*******************************************//
  
  function generateTable(testSubjectDemos) {
    let body = document.getElementsByClassName("panel-body")[0];
    let tbl = document.createElement("table");
    tbl.setAttribute("id", "table");
  
    console.log(tbl);
  
    let tblBody = document.createElement("tbody");
  
    Object.entries(testSubjectDemos).forEach(function ([key, value]) {
      console.log(key, value);
  
      let row = document.createElement("tr");
  
      let key_cell = document.createElement("td");
      key_cell.style.fontWeight = "bold";
      key_cell.style.padding = "10px";
      key_cell.style.fontSize = "16";
  
      let key_text = document.createTextNode(`${key}:`);
      key_cell.appendChild(key_text);
      row.appendChild(key_cell);
  
      let value_cell = document.createElement("td");
      value_cell.style.padding = "10px";
      value_cell.style.fontSize = "16";
      let value_text = document.createTextNode(`${value}`);
      value_cell.appendChild(value_text);
      row.appendChild(value_cell);
  
      tblBody.append(row);
    });
  
    tbl.appendChild(tblBody);
    body.appendChild(tbl);
  }
  
  function gaugeChart(wfreq) {
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Weekly Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "#000082" },
          steps: [
            { range: [0, 1], color: "#fff4ed" },
            { range: [1, 2], color: "#ffddc6" },
            { range: [2, 3], color: "#ffc59f" },
            { range: [3, 4], color: "#ffae78" },
            { range: [4, 5], color: "#ff9650" },
            { range: [5, 6], color: "#ff7e29" },
            { range: [6, 7], color: "#ff6702" },
            { range: [7, 8], color: "#ed5f00" },
            { range: [8, 9], color: "#c64800" },
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 490,
          },
        },
      },
    ];
  
    var layout = { width: 300, height: 225, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", data, layout);
  }
  
  init();
  
  d3.selectAll("#selDataset").on("change", subjectChanged);
  
  function subjectChanged() {
    let selectedID = d3.select("#selDataset").node().value;
  
    d3.selectAll("#table").remove();
  
    datapull(selectedID);
  }