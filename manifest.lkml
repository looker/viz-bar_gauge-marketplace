project_name: "viz-bar_gauge-marketplace"

constant: VIS_LABEL {
  value: "Bar Gauge"
  export: override_optional
}

constant: VIS_ID {
  value: "bar_gauge-marketplace"
  export:  override_optional
}

visualization: {
  id: "@{VIS_ID}"
  file: "bargauge.js"
  label: "@{VIS_LABEL}"
}

