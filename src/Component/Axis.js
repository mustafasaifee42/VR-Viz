import React, { Component } from 'react';
import 'aframe';
import * as d3 from 'd3';
import GetDomain from '../Utils/GetDomain.js';
import * as moment from 'moment';

class Axis extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {

    //Adding Axis
    let ticks, tickText, axis, tickValues;

    if (this.props.scaleType == 'ordinal') {
      tickValues = this.props.domain
    } else {
      tickValues = this.props.scale.ticks(this.props.tick.noOfTicks)
    }

    switch (this.props.axis) {
      case 'x':
        {
          switch (this.props.orient) {
            case 1:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size']}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size']}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />
                  });
                  break;
                }
              }
            case 2:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, 0.001, 0; end:${this.props.dimensions.width} 0.001 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, 0.001, 0; end:${this.props.scale(d)} 0.001 ${0 - this.props.tick['size']}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} 0.001 ${0 - this.props.tick['size'] - 0.05}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, 0.001, 0; end:${this.props.dimensions.width} 0.001 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, 0.001, 0; end:${this.props.scale(d)} 0.001 ${0 - this.props.tick['size']}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} 0.001 ${0 - this.props.tick['size'] - 0.05}`} />
                  });
                  break;
                }
              }
            case 3:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} ${this.props.dimensions.height} 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, ${this.props.dimensions.height}, 0; end:${this.props.scale(d)} ${this.props.dimensions.height} ${0 - this.props.tick['size']}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} ${this.props.dimensions.height} ${0 - this.props.tick['size'] - 0.05}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} ${this.props.dimensions.height} 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, ${this.props.dimensions.height}, 0; end:${this.props.scale(d)} ${this.props.dimensions.height} ${0 - this.props.tick['size']}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} ${this.props.dimensions.height} ${0 - this.props.tick['size'] - 0.05}`} />
                  });
                  break;
                }
              }
            case 4:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, 0.001, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, 0.001, ${this.props.dimensions.depth}; end:${this.props.scale(d)} 0.001 ${this.props.dimensions.depth + this.props.tick['size']}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} 0.001 ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, 0.001, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, 0.001, ${this.props.dimensions.depth}; end:${this.props.scale(d)} 0.001 ${this.props.dimensions.depth + this.props.tick['size']}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} 0.001 ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />
                  });
                  break;
                }
              }
            default:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size']} opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size'] - 0.05}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size']} opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size'] - 0.05}`} />
                  });
                  break;
                }
              }
          }
          break;
        }
      case 'y':
        {
          switch (this.props.orient) {
            case 1:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.scale(d)}, ${this.props.dimensions.depth}; end:${0 - this.props.tick['size']} ${this.props.scale(d)} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.scale(d)}, ${this.props.dimensions.depth}; end:${0 - this.props.tick['size']} ${this.props.scale(d)} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />
                  });
                  break;
                }
              }
            case 2:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:0 0.001 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.scale(d)}, 0; end:${0 - this.props.tick['size']} ${this.props.scale(d)} 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d)} 0`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:0 0.001 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.scale(d)}, 0; end:${0 - this.props.tick['size']} ${this.props.scale(d)} 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d)} 0`} />
                  });
                  break;
                }
              }
            case 3:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.scale(d)}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width + this.props.tick['size']} ${this.props.scale(d)} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='left' rotation='0 0 0' position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.scale(d)}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width + this.props.tick['size']} ${this.props.scale(d)} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='left' rotation='0 0 0' position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />
                  });
                  break;
                }
              }
            case 4:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} 0.001 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.scale(d)}, 0; end:${this.props.dimensions.width + this.props.tick['size']} ${this.props.scale(d)} 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='left' rotation='0 0 0' position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} 0.001 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.scale(d)}, 0; end:${this.props.dimensions.width + this.props.tick['size']} ${this.props.scale(d)} 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='left' rotation='0 0 0' position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />
                  });
                  break;
                }
              }
            default:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.scale(d)}, ${this.props.dimensions.depth}; end:${0 - this.props.tick['size']} ${this.props.scale(d)} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.scale(d)}, ${this.props.dimensions.depth}; end:${0 - this.props.tick['size']} ${this.props.scale(d)} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />
                  });
                  break;
                }
              }
          }
          break;
        }
      case 'z':
        {
          switch (this.props.orient) {
            case 1:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, 0.001, ${this.props.scale(d)}; end:${0 - this.props.tick['size']} 0.001 ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='-90 0 0' position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d)}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, 0.001, ${this.props.scale(d)}; end:${0 - this.props.tick['size']} 0.001 ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='right' rotation='-90 0 0' position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d)}`} />
                  });
                  break;
                }
              }
            case 2:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:0 ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.dimensions.height}, ${this.props.scale(d)}; end:${0 - this.props.tick['size']} ${this.props.dimensions.height} ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['size'] - 0.05} ${this.props.dimensions.height} ${this.props.scale(d)}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, 0.001, ${this.props.scale(d)}; end:${0 - this.props.tick['size']} 0.001 ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='right' rotation='-90 0 0' position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d)}`} />
                  });
                  break;
                }
              }
            case 3:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:${this.props.dimensions.width}, 0.001, 0; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, ${this.props.scale(d)}; end:${this.props.dimensions.width + this.props.tick['size']} ${this.props.dimensions.height} ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='left' rotation='-90 0 0' position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} 0.001 ${this.props.scale(d)}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, 0.001, ${this.props.scale(d)}; end:${0 - this.props.tick['size']} 0.001 ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='right' rotation='-90 0 0' position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d)}`} />
                  });
                  break;
                }
              }
            case 4:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, ${this.props.scale(d)}; end:${this.props.dimensions.width + this.props.tick['size']} ${this.props.dimensions.height} ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='left' rotation='0 0 0' position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.dimensions.height} ${this.props.scale(d)}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, 0.001, ${this.props.scale(d)}; end:${0 - this.props.tick['size']} 0.001 ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='right' rotation='-90 0 0' position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d)}`} />
                  });
                  break;
                }
              }
            default:
              {
                if (!this.props.tick.format) {
                  axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, 0.001, ${this.props.scale(d)}; end:${0 - this.props.tick['size']} 0.001 ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='-90 0 0' position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d)}`} />);
                  break;
                }
                else {
                  axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  ticks = tickValues.map((d, i) => <a-entity key={i} line={`start:0, 0.001, ${this.props.scale(d)}; end:${0 - this.props.tick['size']} 0.001 ${this.props.scale(d)}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />);
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['text-size']} value={`${txt}`} anchor='align' side='double' side='double' align='right' rotation='-90 0 0' position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d)}`} />
                  });
                  break;
                }
              }
          }
          break;
        }
      default:
        {
          break;
        }
    }

    return (
      <a-entity>
        {ticks}
        {axis}
        {tickText}
      </a-entity>
    )
  }
}
export default Axis