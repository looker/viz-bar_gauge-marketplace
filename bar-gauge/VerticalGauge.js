import React, { useEffect } from 'react';
import * as d3 from 'd3';
import SSF from "ssf";

const VerticalGauge = (props) => {
	useEffect(() => {
		d3.select('.viz > *').remove();
		drawVertical(props)
	}, [props])
	return <div className='viz' />
}

function mapBetween(currentNum, minAllowed, maxAllowed, min, max) {
  	return (maxAllowed - minAllowed) * (currentNum - min) / (max - min) + minAllowed;
}

const drawVertical = (props) => {
  // SETUP
	d3.select('.viz > *').remove();
	var div = d3.select('.viz')
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

  // GAUGE BODY
	var proportion = mapBetween(props.value,0,1,props.range[0],props.range[1])
  svg.append('rect')
  .attr('class', 'vertical-gauge')
  .attr('width', 50)
  .attr('height', '100%')
  .style('fill', props.gauge_background)
  .attr('x', 0-d3.select('.vertical-gauge').node().getBBox().width/2)
  .attr('y', props.h/-2);
  svg.append('rect')
  .attr('class', 'top-arm')
  .attr('width', d3.select('.vertical-gauge').attr('width')*(props.arm/100+1))
  .attr('height', `${props.arm_weight/3}px`)
  .attr('z-index', '5')
  .style('fill', props.gauge_background)
  .attr('x', 0-d3.select('.vertical-gauge').node().getBBox().width/2)
  .attr('y', props.h/-2);
  svg.append('rect')
  .attr('class', 'bottom-arm')
  .attr('width', d3.select('.vertical-gauge').attr('width')*(props.arm/100+1))
  .attr('height', `${props.arm_weight/3}px`)
  .attr('z-index', '5')
  .style('fill', props.gauge_background)
  .attr('x', 0-d3.select('.vertical-gauge').node().getBBox().width/2)
  .attr('y', d3.select('.vertical-gauge').node().getBBox().y + d3.select('.vertical-gauge').node().getBBox().height - d3.select('.bottom-arm').node().getBBox().height);

  // RANGE LABELS
  svg.append('text')
  .attr('class', 'max-label')
  .attr('dx', '-.35em')
  .style('font-weight', "bold")
  .text(props.range_formatting === undefined || props.range_formatting === "" ? props.range[1] : SSF.format(props.range_formatting, props.range[1]))
  .style('font-family', 'Arial, Helvetica, sans-serif')
  .style('fill', props.range_color)
  .style('font-size', `${props.label_font}${props.limiting_aspect}`)
  .attr('x', 0-d3.select('.vertical-gauge').node().getBBox().width/2-d3.select('.max-label').node().getBBox().width)
  .attr('y', props.h/-2+d3.select('.top-arm').node().getBBox().height);
  svg.append('text')
  .attr('class', 'min-label')
  .attr('dx', '-.35em')
  .attr('dy', '.7em')
  .style('font-weight', "bold")
  .text(props.range_formatting === undefined || props.range_formatting === "" ? props.range[0] : SSF.format(props.range_formatting, props.range[0]))
  .style('font-family', 'Arial, Helvetica, sans-serif')
  .style('fill', props.range_color)
  .style('font-size', `${props.label_font}${props.limiting_aspect}`)
  .attr('x', 0-d3.select('.vertical-gauge').node().getBBox().width/2-d3.select('.min-label').node().getBBox().width)
  .attr('y', d3.select('.bottom-arm').node().getBBox().y);
  
  // GAUGE FILL
  svg.append('rect')
  .attr('class', 'vertical-fill')
  .attr('width', d3.select('.vertical-gauge').attr('width'))
  .attr('height', `${proportion * (d3.select('.vertical-gauge').node().getBBox().height-d3.select('.top-arm').node().getBBox().height*2)}`)
  .style('fill', props.color)
  .attr('x', 0-d3.select('.vertical-gauge').node().getBBox().width/2)
  .attr('y', d3.select('.vertical-gauge').node().getBBox().y + d3.select('.vertical-gauge').node().getBBox().height - d3.select('.vertical-fill').node().getBBox().height - d3.select('.bottom-arm').node().getBBox().height);
  
  // GAUGE SPINNER
  svg.append('rect')
  .attr('class', 'value-line')
  .attr('stroke', props.spinner_background)
  .attr('width', `${props.spinner/2}px`)
  .attr('height', `${props.spinner_weight/2}px`)
  .style('fill', props.spinner_background)
  .attr('x', 0 + (d3.select('.vertical-gauge').attr('width')/2) - (props.spinner/2))
  .attr('y', d3.select('.vertical-fill').attr('y'));

  // GAUGE VALUE LABEL
  if (props.value_label_type === 'value' || props.value_label_type === 'both' || props.value_label_type === 'dboth') {
    svg.append('text')
    .attr('class', 'value-label')
    .text(props.value_rendered)
    .attr('dy', '.7em')
    .attr('dx', `-${props.value_label_padding/100}em`)
    .style('font-family', 'Arial, Helvetica, sans-serif')
    .style('font-size', `${props.value_label_font*.75}${props.limiting_aspect}`)
    .attr('x', d3.select('.value-line').node().getBBox().x-d3.select('.value-label').node().getBBox().width)
    .attr('y', d3.select('.vertical-fill').attr('y'));
  } 
  if (props.value_label_type === 'label' || props.value_label_type === 'both') {
    svg.append('text')
    .attr('class', 'value-label-label')
    .text(props.value_label)
    .attr('dx', `-${props.value_label_padding/100}em`)
    .attr('dy', '.5em')
    .style('font-family', 'Arial, Helvetica, sans-serif')
    .style('font-size', `${props.value_label_font*0.45}${props.limiting_aspect}`)
    .attr('x', d3.select('.value-line').node().getBBox().x-d3.select('.value-label-label').node().getBBox().width)
    .attr('y', d3.select('.value-line').node().getBBox().y + (props.value_label_type === 'label' ? 0 : d3.select('.value-label').node().getBBox().height));
  }
  if (props.value_label_type === 'dim' || props.value_label_type === 'dboth') {
    svg.append('text')
    .attr('class', 'value-label-label')
    .text(props.value_dimension)
    .attr('dx', `-${props.value_label_padding/100}em`)
    .attr('dy', '.5em')
    .style('font-family', 'Arial, Helvetica, sans-serif')
    .style('font-size', `${props.value_label_font*0.45}${props.limiting_aspect}`)
    .attr('x', d3.select('.value-line').node().getBBox().x-d3.select('.value-label-label').node().getBBox().width)
    .attr('y', d3.select('.value-line').node().getBBox().y + (props.value_label_type === 'dim' ? 0 : d3.select('.value-label').node().getBBox().height));
  }

  // GAUGE TARGET

  if (props.target_source !== "off") {
    var target_proportion = mapBetween(props.target,0,1,props.range[0],props.range[1])
    svg.append('rect')
    .attr('class', 'target-fill')
    .attr('width', d3.select('.vertical-gauge').attr('width'))
    .attr('height', `${target_proportion * (d3.select('.vertical-gauge').node().getBBox().height-d3.select('.top-arm').node().getBBox().height*2)}`)
    .style('fill', 'none')
    .attr('x', 0-d3.select('.vertical-gauge').node().getBBox().width/2)
    .attr('y', d3.select('.vertical-gauge').node().getBBox().y + d3.select('.vertical-gauge').node().getBBox().height - d3.select('.target-fill').node().getBBox().height - d3.select('.bottom-arm').node().getBBox().height);
    svg.append('line')
    .attr('class', 'target-line')
    .attr('stroke-width', '4')
    .attr('fill', 'none')
    .style('stroke', props.target_background)
    .attr('stroke-dasharray', '5')
    .attr('x1', 0-d3.select('.vertical-gauge').attr('width')*0.5)
    .attr('y1', d3.select('.target-fill').attr('y'))
    .attr('x2', 0+d3.select('.vertical-gauge').attr('width')*0.7)
    .attr('y2', d3.select('.target-fill').attr('y'));

    // GAUGE TARGET LABEL
    if (props.target_label_type === 'value' || props.target_label_type === 'both' || props.target_label_type === 'dboth') {
      svg.append('text')
      .attr('class', 'target-label')
      .text(props.target_rendered)
      .attr('dy', '.7em')
      .style('font-family', 'Arial, Helvetica, sans-serif')
      .style('font-size', `${props.target_label_font}${props.limiting_aspect}`)
      .attr('x', 0+d3.select('.vertical-gauge').attr('width')*3/4)
      .attr('y', d3.select('.target-fill').attr('y'));
    }
    if (props.target_label_type === 'label' || props.target_label_type === 'both') {
      svg.append('text')
      .attr('class', 'target-label-label')
      .text(props.target_label)
      .attr('dy', '.7em')
      .style('font-family', 'Arial, Helvetica, sans-serif')
      .style('font-size', `${props.target_label_font*(3/4)}${props.limiting_aspect}`)
      .attr('x', 0+d3.select('.vertical-gauge').attr('width')*3/4)
      .attr('y', d3.select('.target-line').node().getBBox().y + (props.target_label_type === 'label' ? 0 : d3.select('.target-label').node().getBBox().height));
    }
    if (props.target_label_type === 'dim' || props.target_label_type === 'dboth') {
      svg.append('text')
      .attr('class', 'target-label-label')
      .text(props.target_dimension)
      .attr('dy', '.7em')
      .style('font-family', 'Arial, Helvetica, sans-serif')
      .style('font-size', `${props.target_label_font*(3/4)}${props.limiting_aspect}`)
      .attr('x', 0+d3.select('.vertical-gauge').attr('width')*3/4)
      .attr('y', d3.select('.target-line').node().getBBox().y + (props.target_label_type === 'dim' ? 0 : d3.select('.target-label').node().getBBox().height));
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

export default VerticalGauge
