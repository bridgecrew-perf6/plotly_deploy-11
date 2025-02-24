function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
//Deliverable 1 - Bar Chart
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var newSample = sampleArray.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = newSample[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDS = result.otu_ids;
    var otuLabels = result.otu_labels;
    var otuSampleValues = result.sample_values

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var metadata = metadataArray[0];
    
    var wfreq = metadata.wfreq


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIDS.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: otuSampleValues.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      orientation: "h",
      y: yticks,
      type: "bar"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

  // Bubble Chart

    var bubbleData = [{
      x: otuIDS,
      y: otuSampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: otuSampleValues,
        labels: otuLabels,
        color: otuIDS,
        
      }
    }];
    
    var bubbleLayout = {
      title: "Bacteria Culture Per Sample",
      xaxis: {title:"OTU ID"},
      showlegend: true,
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  // Gauge Data Chart
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",       
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "green" }
          ],
        }
      }
    ];
    
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}


