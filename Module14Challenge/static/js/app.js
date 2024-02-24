// URL variable 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Retrieve JSON data and console log 
d3.json(url).then(function(data) {
        console.log(data);
});

//Initialize dashboard 
function init() {

    let dropDownMenu = d3.select("#selDataset");

    d3.json(url).then((data) => {

        let names = data.names;
        names.forEach((id) => {
            
            console.log.apply(id);

            dropDownMenu.append("option").text(id).property("value", id);

        });

        let sampleOne = names[0];

        console.log(sampleOne);

    });
};


//Function to retrieve sample metadata info 
function sampleMetaData(sample) {
    
    d3.json(url).then((data) => {
        
        let metadata = data.metadata;

        let value = metadata.filter(result => result.id == sample );

        console.log(value)

        let valueData = value[0];

        d3.select("#sample-metadata").html("");
        Object.entries(valueData).forEach(([key, value]) => {
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

//Function to create chart
function createChart(sample) {

    d3.json(url).then((data) => {
        let sampleData = data.samples;

        let value = sampleData.filter(result => result.id == sample);

        let valueData = value[0];

        let otu_IDs = valueData.otu_ids;
        let otu_Labels = valueData.otu_labels
        let sampleValues = valueData.sample_values;

        console.log(otu_IDs, otu_Labels,sampleValues);

        let xticks = sampleValues.slice(0, 10). reverse();
        let yticks = otu_IDs.slice(0, 10).map(id => 'OTU ${id}').reverse(); 
        let labels = otu_Labels.slice(0, 10).reverse();

        let trace1 = {
            x: xticks,
            y: yticks,
            type: "bar",
            orientation: "h",
            text: labels
        };

        let layout = {
            title: "Top 10 OTUs Found",
            xaxis: { title: "Sample Values" },
            yaxis: {title: "OTU ID"}
        };


        Plotly.newPlot("bar",[trace1], layout)

    });
};
    

function createBubbleChart(sample) {
    
    d3.json(url).then((data) => {

        let sampleData = data.samples;

        let value = sampleData.filter(result => result.id == sample);

        let valueData = value[0];
    
        let otuIDs = valueData.otu_ids;
        let sampleValues = valueData.sample_values;
        let otuLabels = valueData.otu_labels;

        let trace1 = {
            x: otuIDs,
            y: sampleValues,
            mode: "markers",
            text: otuLabels,
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: "Rainbow"
            }
        };


        let bubbleLayout = {
            title: "OTU ID vs. Sample Values",
            xaxis: { title: "OTU ID" },
            hovermode: "closest",
        };

        Plotly.newPlot("bubble", [trace1], bubbleLayout)
    });
};

//Function to update dropdown selection
function optionChanged(value) {

    console.log(value);

    sampleMetaData(value);
    createChart(value);
    createBubbleChart(value);
};

//Initialize dashboard 
init();
