import VerticalGauge from './VerticalGauge'
import HorizontalGauge from './HorizontalGauge'
import React from 'react'
import ReactDOM from 'react-dom'
import SSF from "ssf"

function processData(data, queryResponse, config, viz) {
	let dims, meas;
	dims = queryResponse['fields']['dimension_like'];
	meas = queryResponse['fields']['measure_like'];

	if (dims.length > 0) {
		var dimID = dims[0]['name'];
		var dimData = data[0][dimID];
	}
	if (config.bar_value_label_type === "dim" || config.bar_value_label_type === "dboth") {
		if (dims.length === 0) {
			viz.addError({title: 'Invalid Input.', message: 'Add a dimension or modify label type.'});
		}
	}
	if (config.bar_target_label_type === "dim" || config.bar_target_label_type === "dboth") {
		if (dims.length === 0) {
			viz.addError({title: 'Invalid Input.', message: 'Add a dimension or modify label type.'});
		}
	}
    var mesID = meas[0]['name'];
    var mesData = data[0][mesID];
    var mesLabel = meas[0]['label_short'] === undefined ? meas[0]['label'] : meas[0]['label_short'];
	var mesRendered = mesData.rendered === undefined ? mesData.value : mesData.rendered;

	if (config.bar_target_source === "second") {
		if (meas.length < 2) {
			viz.addError({title: 'Invalid Input.', message: 'Add a second measure or modify label type.'});
		}
		var tarID = meas[1]['name'];
	    var tarData = data[0][tarID];
	    var tarValue = tarData.value
	    var tarLabel = meas[1]['label_short'] === undefined ? meas[1]['label'] : meas[1]['label_short'];
		var tarBase = tarData.rendered === undefined ? tarData.value : tarData.rendered;
		var tarRendered = config.bar_target_value_format === undefined || config.bar_target_value_format === "" ? tarBase : SSF.format(config.bar_target_value_format, tarValue);
		if (dims.length > 0) {
			var tarDim = config.bar_target_label_override === undefined || config.bar_target_label_override === "" ? data[0][dimID].value : config.bar_target_label_override
		}
	} else if (config.bar_target_source === "first") {
		if (data.length < 2) {
			viz.addError({title: 'Invalid Input.', message: 'No value to target. Add a second row or modify label type.'});
		}
		var tarData = data[1][mesID];
	    var tarValue = tarData.value;
	    var tarBase = tarData.rendered === undefined || tarData.rendered === "" ? tarValue : tarData.rendered;
	    var tarLabel = mesLabel;
	    var tarRendered = config.bar_target_value_format === undefined || config.bar_target_value_format === "" ? tarBase : SSF.format(config.bar_target_value_format, tarValue);
	    if (dims.length > 0) {
	    	var tarDim = config.bar_target_label_override === undefined || config.bar_target_label_override === "" ? data[1][dimID].value : config.bar_target_label_override;
		}
	} else if (config.bar_target_source === "override") {
		if (config.bar_target_value_override === undefined || config.bar_target_value_override === "") {
			viz.addError({title: 'Invalid Input.', message: 'No target override. Add an override value or modify label type.'});
		}
	    var tarValue = parseFloat(config.bar_target_value_override);
	    var tarBase = tarValue;
	    var tarLabel = config.bar_target_label_override;
	    var tarRendered = config.bar_target_value_format === undefined || config.bar_target_value_format === "" ? tarBase : SSF.format(config.bar_target_value_format, tarValue);
	    if (dims.length > 0) {
	    	var tarDim = config.bar_target_label_override === undefined || config.bar_target_label_override === "" ? data[0][dimID].value : config.bar_target_label_override;
		}
	}

    let chunk = {
    	value: mesData.value,
    	value_links: mesData.links,
    	value_label: config.bar_value_label_override === undefined || config.bar_value_label_override === "" ? mesLabel : config.bar_value_label_override,
    	value_rendered: config.bar_value_formatting === undefined || config.bar_value_formatting === "" ? mesRendered : SSF.format(config.bar_value_formatting, mesData.value),
    	value_dimension: dims.length > 0 ? config.bar_value_label_override === undefined || config.bar_value_label_override === "" ? data[0][dimID].value : config.bar_value_label_override : null,
    	target: tarValue,
    	target_rendered: tarRendered,
    	target_label: config.bar_target_label_override === undefined || config.bar_target_label_override === "" ? tarLabel : config.bar_target_label_override,
    	target_dimension: tarDim
    }
    return chunk;

}
// const formattedValue = dataPoints[0].valueFormat === "" ? dataPoints[0].formattedValue : SSF.format(dataPoints[0].valueFormat, dataPoints[0].value)
looker.plugins.visualizations.add({
  	id: 'gauge',
  	label: 'Gauge Visualization',
  	options: {
  		// PLOT ADVANCED
	    bar_arm_length: {
	      	type: "number",
	      	label: "Arm Length",
	      	default: 9,
	      	section: "Plot",
	      	display: "range",
	      	min: 0,
	      	max: 50,
	      	step: 0.5,
	      	order: 200,
	      	display_size: 'half'
	    },
	    bar_arm_weight: {
	      	type: "number",
	      	label: "Thickness",
	      	default: 48,
	      	section: "Plot",
	      	display: "range",
	      	min: 0,
	      	max: 100,
	      	order: 300,
	      	display_size: 'half'
	    },
	    bar_spinner_length: {
	      	type: "number",
	      	label: "Pointer Length",
	      	default: 121,
	      	section: "Plot",
	      	display: "range",
	      	min: 0,
	      	max: 200,
	      	order: 400,
	      	display_size: 'half'
	    },
	    bar_spinner_weight: {
	      	type: "number",
	      	label: "Thickness",
	      	default: 25,
	      	section: "Plot",
	      	display: "range",
	      	min: 0,
	      	max: 100,
	      	default: 25,
	      	order: 500,
	      	display_size: 'half'
	    },

	    // PLOT
	    bar_style: {
	      type: "string",
	      label: "Gauge Type",
	      display: "select",
	      section: "Plot",
	      values: [
	      	 {"Vertical": "vertical"},
	      	 {"Horizontal": "horizontal"}
	      ],
	      default: "vertical",
	      order: 0
	    },
	    bar_range_min: {
	      type: "number",
	      label: "Range Min Override",
	      section: "Plot",
	      order: 30,
	      default: 0,
	      display_size: 'half'
	    },
	    bar_range_max: {
	      type: "number",
	      label: "Range Max Override",
	      section: "Plot",
	      order: 31,
	      default: 100.701,
	      display_size: 'half'
	    },
	    bar_value_label_type: {
	      type: "string",
	      label: "Value Label Type",
	      display: "select",
	      section: "Value",
	      values: [
	      	 {"Value and Measure Label": "both"},
	      	 {"Value and Dimension": "dboth"},
	      	 {"Only Value": "value"},
	      	 {"Only Label": "label"},
	      	 {"Only Dimension": "dim"},
	      	 {"None": "none"}
	      ],
	      default: "both",
	      order: 40
	    },
	    bar_value_label_font: {
	      type: "number",
	      label: "Value Label Font Size",
	      section: "Value",
	      default: 8,
	      order: 50
	    },
	    bar_value_formatting: {
	     	type: "string",
	      	label: "Value Formatting Override",
	      	section: "Value",
	      	order: 51
	    },
	    bar_value_label_override: {
	     	type: "string",
	      	label: "Value Label Override",
	      	section: "Value",
	      	order: 60
	    },
	    bar_value_label_padding: {
	      	type: "number",
	      	label: "Value Label Padding",
	      	default: 45,
	      	section: "Value",
	      	display: "range",
	      	min: 0,
	      	max: 120,
	      	order: 70
	    },
	    bar_target_source: {
	      type: "string",
	      label: "Target Source",
	      display: "select",
	      section: "Target",
	      values: [
	      	 {"First Measure": "first"},
	      	 {"Second Measure": "second"},
	      	 {"Override": "override"},
	      	 {"No Target": "off"}
	      ],
	      default: "off",
	      order: 80
	    },
	    bar_target_label_type: {
	      type: "string",
	      label: "Target Label Type",
	      display: "select",
	      section: "Target",
	      values: [
	      	 {"Value and Label": "both"},
	      	 {"Only Value": "value"},
	      	 {"Only Label": "label"},
	      	 {"Value and Dimension": "dboth"},
	      	 {"Only Dimension": "dim"},
	      	 {"No Label": "nolabel"}
	      ],
	      default: "none",
	      order: 90
	    },
	    bar_target_label_font: {
	      type: "number",
	      label: "Target Label Font Size",
	      section: "Target",
	      default: 3,
	      order: 100
	    },
	    bar_target_label_override: {
	     	type: "string",
	      	label: "Target Label Override",
	      	section: "Target",
	      	order: 120
	    },
	    bar_target_value_override: {
	     	type: "string",
	      	label: "Target Value Override",
	      	section: "Target",
	      	order: 110
	    },
	    bar_target_value_format: {
	     	type: "string",
	      	label: "Target Value Formatting",
	      	section: "Target",
	      	order: 120
	    },
	    bar_label_font_size: {
	      type: "number",
	      label: "Range Label Font Size",
	      section: "Plot",
	      default: 3,
	      order: 140
	    },
	    bar_range_formatting: {
	      type: "string",
	      label: "Range Label Value Formatting",
	      section: "Plot",
	      order: 150
	    },

	    // STYLE
	    bar_fill_color: {
	      	type: "string",
	      	label: "Gauge Fill Color",
	      	section: "Style",
	      	display: "color",
	      	default: '#0092E5',
	      	order: 10
	    },
	    bar_background_color: {
	      	type: "string",
	      	label: "Background Color",
	      	default: "#CECECE",
	      	section: "Style",
	      	display: "color",
	      	order: 20
	    },
	    bar_spinner_color: {
	      	type: "string",
	      	label: "Pointer Color",
	      	default: "#282828",
	      	section: "Style",
	      	display: "color",
	      	order: 30
	    },
	    bar_range_color: {
	      	type: "string",
	      	label: "Range Label Color",
	      	default: "#282828",
	      	section: "Style",
	      	display: "color",
	      	order: 40
	    },



  	},
  	// Set up the initial state of the visualization
  	create: function(element, config) {
    	this.container = element.appendChild(document.createElement('svg'));
    	this.container.className = 'gauge-vis';
    	// this.chart = ReactDOM.render(
     //    	<RadialGauge />,
     //    	this.container
    	// );
  	},
  	// Render in response to the data or settings changing
  	updateAsync: function(data, element, config, queryResponse, details, done) {
      	var margin = {top: 20, right: 20, bottom: 20, left: 20},
          	width = element.clientWidth,
          	height = element.clientHeight;

	    // Clear any errors from previous updates
	    this.clearErrors();

      	// Throw some errors and exit if the shape of the data isn't what this chart needs
      	if (queryResponse.fields.dimension_like.length > 1 || queryResponse.fields.measure_like.length > 2) {
          	this.addError({title: 'Invalid Input.', message: 'This chart accepts up to 1 dimension and 2 measures.'});
          	return;
      	}

      	// Extract value, value_label, target, target_label as a chunk
      	let chunk;
      	chunk = processData(data, queryResponse, config, this);

      	if (!config.bar_range_max) {
      		let num = Math.max(Math.ceil(chunk.value), chunk.target ? Math.ceil(chunk.target) : 0);
      		var len = (num+'').length;
	        var fac = Math.pow(10,len-1);
      		let default_max = Math.ceil(num/fac)*fac;
			config.bar_range_max = default_max
      	}

      	this.barDefaults = {
          	w: width,			// GAUGE SETTINGS
          	h: height,
          	limiting_aspect: width < height ? "vw" : "vh",
         	margin: margin,
          	style: config.bar_style,
         	angle: config.bar_angle, 
          	cutout: config.bar_cutout, 
          	color: config.bar_fill_color,
          	gauge_background: config.bar_background_color,
          	range: [config.bar_range_min, config.bar_range_max],
          	value: chunk.value > config.bar_range_max ? config.bar_range_max : chunk.value,
          	value_rendered: chunk.value_rendered,
          	target: chunk.target > config.bar_range_max ? config.bar_range_max : chunk.target,
          	value_label: chunk.value_label,
          	target_label: chunk.target_label,
          	value_dimension: chunk.value_dimension,
          	target_dimension: chunk.target_dimension,
          	target_rendered: chunk.target_rendered,
          	value_links: chunk.value_links,
          	label_font: config.bar_label_font_size,
          	range_formatting: config.bar_range_formatting,
          	range_x: config.bar_range_x,
          	range_y: config.bar_range_y,
          	gauge_fill_type: config.bar_gauge_fill_type,
          	fill_colors: config.bar_fill_colors,
          	range_color: config.bar_range_color,

          	spinner: config.bar_spinner_length,		// SPINNER SETTINGS
          	spinner_weight: config.bar_spinner_weight,
          	spinner_background: config.bar_spinner_color,

          	arm: config.bar_arm_length,		// ARM SETTINGS
          	arm_weight: config.bar_arm_weight,

          	target_length: config.bar_target_length,	// TARGET SETTINGS
          	target_gap: config.bar_target_gap,
          	target_weight: config.bar_target_weight,  
          	target_background: '#282828',
          	target_source: config.bar_target_source,

          	value_label_type: config.bar_value_label_type, // LABEL SETTINGS
			value_label_font: config.bar_value_label_font,
			value_label_padding: config.bar_value_label_padding,
          	target_label_type: config.bar_target_label_type,
			target_label_font: config.bar_target_label_font,
			target_label_padding: config.bar_target_label_padding,
			wrap_width: 100,
      	};

      	// Finally update the state with our new data
		if (config.bar_style === 'vertical') {
      		this.chart = ReactDOM.render(
	          	<VerticalGauge {...this.barDefaults} />,
	          	this.container
      		);
      	} else if (config.bar_style === 'horizontal') {
      		this.chart = ReactDOM.render(
	          	<HorizontalGauge {...this.barDefaults} />,
	          	this.container
      		);
      	}
      	// console.log(config)
      	// We are done rendering! Let Looker know.
      	done()
  	}
});
