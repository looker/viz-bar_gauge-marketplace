import React, { useEffect } from 'react';
import * as d3 from 'd3';
import SSF from "ssf";

const HorizontalGauge = (props) => {
	useEffect(() => {
		d3.select('.viz > *').remove();
		drawHorizontal(props)
	}, [props])
	return <div className='viz' />
}

function mapBetween(currentNum, minAllowed, maxAllowed, min, max) {
  	return (maxAllowed - minAllowed) * (currentNum - min) / (max - min) + minAllowed;
}

const drawHorizontal = (props) => {
	// SETUP
	d3.select('.viz > *').remove();
	var div = d3.select('.viz')
    .style('background-color', '#FFF')
  	.style('overflow-x', 'hidden')
  	.style('overflow-y', 'hidden')
  	.style('position', 'fixed')
  	.attr('height', '100%');
	const svg = d3.select('.viz').append('svg');
	svg.attr('width', props.w)
	.attr('height', props.h)
	.attr('id', 'svg-viz')
	.attr('preserveAspectRatio', 'xMidYMid meet')
  	.attr('viewBox', `${props.w/-2} ${props.h/-2} ${props.w} ${props.h*.9}`);

  	//GAUGE BODY
	var proportion = mapBetween(props.value,0,1,props.range[0],props.range[1])
	svg.append('rect')
	.attr('class', 'horizontal-gauge')
	.attr('width', '100%')
	.attr('height', 50)
	.style('fill', props.gauge_background)
	.attr('y', 0-d3.select('.horizontal-gauge').node().getBBox().height)
	.attr('x', props.w/-2);
	svg.append('rect')
	.attr('class', 'left-arm')
	.attr('height', d3.select('.horizontal-gauge').attr('height')*(props.arm/100+1))
	.attr('width', `${props.arm_weight/3}px`)
	.attr('z-index', '5')
	.style('fill', props.gauge_background)
	.attr('y', d3.select('.horizontal-gauge').node().getBBox().y - (d3.select('.left-arm').node().getBBox().height-d3.select('.horizontal-gauge').node().getBBox().height))
	.attr('x', props.w/-2);
	svg.append('rect')
	.attr('class', 'right-arm')
	.attr('height', d3.select('.horizontal-gauge').attr('height')*(props.arm/100+1))
	.attr('width', `${props.arm_weight/3}px`)
	.attr('z-index', '5')
	.style('fill', props.gauge_background)
	.attr('x', props.w/2 - d3.select('.right-arm').node().getBBox().width)
	.attr('y', d3.select('.horizontal-gauge').node().getBBox().y - (d3.select('.right-arm').node().getBBox().height-d3.select('.horizontal-gauge').node().getBBox().height));

	// RANGE LABELS
    svg.append('text')
    .attr('class', 'max-label')
    .style('font-weight', "bold")
    .attr('dy', '.7em')
    .text(props.range_formatting === undefined || props.range_formatting === "" ? props.range[1] : SSF.format(props.range_formatting, props.range[1]))
    .style('font-family', 'Arial, Helvetica, sans-serif')
    .style('fill', props.range_color)
    .style('font-size', `${props.label_font}${props.limiting_aspect}`)
    .attr('x', 0+d3.select('.horizontal-gauge').node().getBBox().width/2-d3.select('.left-arm').node().getBBox().width-d3.select('.max-label').node().getBBox().width)
    .attr('y', d3.select('.right-arm').node().getBBox().y-d3.select('.max-label').node().getBBox().height);
    svg.append('text')
    .attr('class', 'min-label')
    .style('font-weight', "bold")
    .attr('dy', '.7em')
    .text(props.range_formatting === undefined || props.range_formatting === "" ? props.range[0] : SSF.format(props.range_formatting, props.range[0]))
    .style('font-family', 'Arial, Helvetica, sans-serif')
    .style('fill', props.range_color)
    .style('font-size', `${props.label_font}${props.limiting_aspect}`)
    .attr('x', 0-d3.select('.horizontal-gauge').node().getBBox().width/2+d3.select('.left-arm').node().getBBox().width)
    .attr('y', d3.select('.left-arm').node().getBBox().y-d3.select('.min-label').node().getBBox().height);

	// GAUGE FILL
	svg.append('rect')
	.attr('class', 'horizontal-fill')
	.attr('height', d3.select('.horizontal-gauge').attr('height'))
	.attr('width', `${proportion * (d3.select('.horizontal-gauge').node().getBBox().width-d3.select('.left-arm').node().getBBox().width*2)}`)
	.style('fill', props.color)
	.attr('x', props.w/-2 + d3.select('.left-arm').node().getBBox().width)
	.attr('y', d3.select('.horizontal-gauge').node().getBBox().y);

	// GAUGE SPINNER
	svg.append('rect')
	.attr('class', 'value-line')
	.attr('stroke', props.spinner_background)
	.attr('height', d3.select('.horizontal-gauge').attr('height')*(props.spinner/400+1))
	.attr('width', `${props.spinner_weight/2}px`)
	.style('fill', props.spinner_background)
	.attr('y', d3.select('.horizontal-fill').attr('y'))
	.attr('x', d3.select('.horizontal-fill').node().getBBox().x + d3.select('.horizontal-fill').node().getBBox().width - d3.select('.value-line').node().getBBox().width);
	
	// GAUGE VALUE LABEL
	if (props.value_label_type === 'value' || props.value_label_type === 'both' || props.value_label_type === 'dboth') {
		label_pointer = svg.append('text')
		.attr('class', 'value-label')
		.text(props.value_rendered)
		.attr('dy', `${props.value_label_padding/3}`)
		.style('font-family', 'Arial, Helvetica, sans-serif')
		.style('font-size', `${props.value_label_font}${props.limiting_aspect}`);
		var label_x = d3.select('.value-line').node().getBBox().x + d3.select('.value-line').node().getBBox().width - d3.select('.value-label').node().getBBox().width;
		label_x = label_x < props.w * -0.5 ? props.w * -0.5 : label_x
		label_pointer.attr('x', label_x)
		.attr('y', d3.select('.horizontal-fill').node().getBBox().y + d3.select('.value-line').node().getBBox().height + d3.select('.value-label').node().getBBox().height*3/4);
	}
	if (props.value_label_type === 'label' || props.value_label_type === 'both') {
		var label_pointer = svg.append('text')
		.attr('class', 'value-label-label')
		.text(props.value_label)
		.attr('dy', `${props.value_label_padding/2}`)
		.style('font-family', 'Arial, Helvetica, sans-serif')
		.style('font-size', `${props.value_label_font*3/4}${props.limiting_aspect}`);
		var label_x = d3.select('.value-line').node().getBBox().x + d3.select('.value-line').node().getBBox().width - d3.select('.value-label-label').node().getBBox().width;
		label_x = label_x < props.w * -0.5 ? props.w * -0.5 : label_x
		label_pointer.attr('x', label_x)
		.attr('y', d3.select('.horizontal-fill').node().getBBox().y + d3.select('.value-line').node().getBBox().height + (props.value_label_type === 'label' ? d3.select('.value-line').node().getBBox().height/3 : d3.select('.value-label').node().getBBox().height*1.3));
	}
	if (props.value_label_type === 'dim' || props.value_label_type === 'dboth') {
		var label_pointer = svg.append('text')
		.attr('class', 'value-label-label')
		.text(props.value_dimension)
		.attr('dy', `${props.value_label_padding}`)
		.style('font-family', 'Arial, Helvetica, sans-serif')
		.style('font-size', `${props.value_label_font*3/4}${props.limiting_aspect}`)
		var label_x = d3.select('.value-line').node().getBBox().x + d3.select('.value-line').node().getBBox().width - d3.select('.value-label-label').node().getBBox().width;
		label_x = label_x < props.w * -0.5 ? props.w * -0.5 : label_x
		label_pointer.attr('x', label_x)
		.attr('y', d3.select('.horizontal-fill').node().getBBox().y + d3.select('.value-line').node().getBBox().height + (props.value_label_type === 'dim' ? d3.select('.value-line').node().getBBox().height/3 : d3.select('.value-label').node().getBBox().height*1.3));
	}

	// GAUGE TARGET
	if (props.target_source !== "off") {
	var target_proportion = mapBetween(props.target,0,1,props.range[0],props.range[1])
	svg.append('rect')
	.attr('class', 'target-fill')
	.attr('height', d3.select('.horizontal-gauge').attr('height'))
	.attr('width', `${target_proportion * (d3.select('.horizontal-gauge').node().getBBox().width-d3.select('.left-arm').node().getBBox().width*2)}`)
	.style('fill', 'none')
	.attr('x', props.w/-2 + d3.select('.left-arm').node().getBBox().width)
	.attr('y', d3.select('.horizontal-gauge').node().getBBox().y);

	// TARGET LABEL
	if (props.target_label_type !== 'none') {
		svg.append('line')
		.attr('class', 'target-line')
		.attr('stroke-width', '4')
		.attr('fill', 'none')
		.style('stroke', props.target_background)
		.attr('stroke-dasharray', '5')
		.attr('x1', d3.select('.target-fill').node().getBBox().x + d3.select('.target-fill').node().getBBox().width)
		.attr('y1', d3.select('.target-fill').node().getBBox().y)
		.attr('x2', d3.select('.target-fill').node().getBBox().x + d3.select('.target-fill').node().getBBox().width)
		.attr('y2', d3.select('.target-fill').node().getBBox().y + d3.select('.target-fill').node().getBBox().height);
		if (props.target_label_type === 'value') {
			var labelPackage = `${props.target}`
		} else if (props.target_label_type === 'label') {
			var labelPackage = `${props.target_label}`
		} else if (props.target_label_type === 'both') {
			var labelPackage = `${props.target_rendered} ${props.target_label}`
		} else if (props.target_label_type === 'dim') {
			var labelPackage = `${props.target_dimension}`
		} else if (props.target_label_type === 'dboth') {
			var labelPackage = `${props.target_rendered} ${props.target_dimension}`
		}
	  	svg.append('text')
		.attr('class', 'target-label')
		.text(labelPackage)
		.style('font-size', `${props.target_label_font}${props.limiting_aspect}`)
		.style('font-family', 'Arial, Helvetica, sans-serif')
		.attr('x', d3.select('.target-fill').node().getBBox().x + d3.select('.target-fill').node().getBBox().width)
		.attr('y', d3.select('.target-fill').node().getBBox().y - d3.select('.target-label').node().getBBox().height/2)
	}
	}
	d3.select(".value-label").on("click", function(d,i) {
      LookerCharts.Utils.openDrillMenu({
         links: props.value_links,
         event: event
       });
	  })
	  d3.select(".value-label-label").on("click", function(d,i) {
	    LookerCharts.Utils.openDrillMenu({
	       links: props.value_links,
	       event: event
	     });
	  })
}

export default HorizontalGauge