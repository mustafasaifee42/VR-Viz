import * as d3 from 'd3';

export default function (data, field, type, startFromZero) {
  let domain = [];
  if (type === 'ordinal') {
    for (let i = 0; i < data.length; i++) {
      if (domain.indexOf(data[i][field]) < 0) {
        domain.push(data[i][field])
      }
    }
  } else {
    if (startFromZero) {
      domain.push(0)
      domain.push(d3.max(data, d => d[field]))
    }
    else {
      domain.push(d3.min(data, d => d[field]))
      domain.push(d3.max(data, d => d[field]))
    }
  }
  return domain;
}
