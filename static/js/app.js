// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata= data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result= metadata.find(meta => meta.id==sample);


    // Use d3 to select the panel with id of `#sample-metadata`

    let panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      // Append a new paragraph element for each key-value pair
      panel.append("p").text(`${key}: ${value}`);
    });


  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field

    let samples= data.samples;

    // Filter the samples for the object with the desired sample number
    let results= samples.find(sampleObj=>sampleObj.id==sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = results.otu_ids;
    let otu_labels = results.otu_labels;
    let sample_values = results.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
    let bubbleLayout = {
      title: "Bacteria cultures per sample",
      height: 600,
      weight: 1200,
      xaxis: { title: "OTU IDS" },
      yaxis: { title: "Number of Bacteria" }
    };
    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks= otu_ids.slice(0,12).map(id=> `OTU ${id}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: sample_values.slice(0,12).reverse(),
      y: yticks,
      text: otu_labels.slice(0,12).reverse(),
      type: 'bar',
      orientation: 'h'
      };

    let barLayout = {
      title: "Top 12 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" }
    };
    // Render the Bar Chart
    Plotly.newPlot('bar', [barTrace], barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names= data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown= d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdown.append("option").text(sample).attr("value", sample);
    });

    // Get the first sample from the list
    let firstSample= names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Initialize the dashboard
init();
