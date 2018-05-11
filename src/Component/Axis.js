import React, { Component } from 'react';
import 'aframe';
import * as d3 from 'd3';
import GetDomain from '../Utils/GetDomain.js';

class Axis extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {

    //Adding Axis
    console.log(this.props.tick['tick-color'])
    let ticks, tickValues, axis;
    switch (this.props.axis) {
      case 'x':
        {
          switch (this.props.orient) {
            case 1:
              {
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['tick-size']}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['tick-size'] + 0.05}`} />);
                break;
              }
            case 2:
              {
                axis = <a-entity line={`start:0, 0.001, 0; end:${this.props.dimensions.width} 0.001 0; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, 0.001, 0; end:${this.props.scale(d)} 0.001 ${0 - this.props.tick['tick-size']}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} 0.001 ${0 - this.props.tick['tick-size'] - 0.05}`} />);
                break;
              }
            case 3:
              {
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} ${this.props.dimensions.height} 0; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, ${this.props.dimensions.height}, 0; end:${this.props.scale(d)} ${this.props.dimensions.height} ${0 - this.props.tick['tick-size']}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} ${this.props.dimensions.height} ${0 - this.props.tick['tick-size'] - 0.05}`} />);
                break;
              }
            case 4:
              {
                axis = <a-entity line={`start:0, 0.001, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, 0.001, ${this.props.dimensions.depth}; end:${this.props.scale(d)} 0.001 ${this.props.dimensions.depth + this.props.tick['tick-size']}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} 0.001 ${this.props.dimensions.depth + this.props.tick['tick-size'] + 0.05}`} />);
                break;
              }
            default:
              {
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.scale(d)}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['tick-size']} opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='center' rotation='-90 0 0' position={`${this.props.scale(d)} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['tick-size'] - 0.05}`} />);
                break;
              }
          }
          break;
        }
      case 'y':
        {
          switch (this.props.orient) {
            case 1:
              {
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.scale(d)}, ${this.props.dimensions.depth}; end:${0 - this.props.tick['tick-size']} ${this.props.scale(d)} ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['tick-size'] - 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />);
                break;
              }
            case 2:
              {
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:0 0.001 0; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.scale(d)}, 0; end:${0 - this.props.tick['tick-size']} ${this.props.scale(d)} 0; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['tick-size'] - 0.05} ${this.props.scale(d)} 0`} />);
                break;
              }
            case 3:
              {
                axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.scale(d)}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width + this.props.tick['tick-size']} ${this.props.scale(d)} ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='left' rotation='0 0 0' position={`${this.props.dimensions.width + this.props.tick['tick-size'] + 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />);
                break;
              }
            case 4:
              {
                axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} 0.001 0; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.scale(d)}, 0; end:${this.props.dimensions.width + this.props.tick['tick-size']} ${this.props.scale(d)} 0; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='left' rotation='0 0 0' position={`${this.props.dimensions.width + this.props.tick['tick-size'] + 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />);
                break;
              }
            default:
              {
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.scale(d)}, ${this.props.dimensions.depth}; end:${0 - this.props.tick['tick-size']} ${this.props.scale(d)} ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['tick-size'] - 0.05} ${this.props.scale(d)} ${this.props.dimensions.depth}`} />);
                break;
              }
          }
          break;
        }
      case 'z':
        {
          switch (this.props.orient) {
            case 1:
              {
                axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:0, 0.001, ${this.props.scale(d)}; end:${0 - this.props.tick['tick-size']} 0.001 ${this.props.scale(d)}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='-90 0 0' position={`${0 - this.props.tick['tick-size'] - 0.05} 0.001 ${this.props.scale(d)}`} />);
                break;
              }
            case 2:
              {
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:0 ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:0, ${this.props.dimensions.height}, ${this.props.scale(d)}; end:${0 - this.props.tick['tick-size']} ${this.props.dimensions.height} ${this.props.scale(d)}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='0 0 0' position={`${0 - this.props.tick['tick-size'] - 0.05} ${this.props.dimensions.height} ${this.props.scale(d)}`} />);
                break;
              }
            case 3:
              {
                axis = <a-entity line={`start:${this.props.dimensions.width}, 0.001, 0; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, ${this.props.scale(d)}; end:${this.props.dimensions.width + this.props.tick['tick-size']} ${this.props.dimensions.height} ${this.props.scale(d)}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='left' rotation='-90 0 0' position={`${this.props.dimensions.width + this.props.tick['tick-size'] + 0.05} 0.001 ${this.props.scale(d)}`} />);
                break;
              }
            case 4:
              {
                axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, ${this.props.scale(d)}; end:${this.props.dimensions.width + this.props.tick['tick-size']} ${this.props.dimensions.height} ${this.props.scale(d)}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='left' rotation='0 0 0' position={`${this.props.dimensions.width + this.props.tick['tick-size'] + 0.05} ${this.props.dimensions.height} ${this.props.scale(d)}`} />);
                break;
              }
            default:
              {
                axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />
                ticks = this.props.tickValues.map((d, i) => <a-entity key={i} line={`start:0, 0.001, ${this.props.scale(d)}; end:${0 - this.props.tick['tick-size']} 0.001 ${this.props.scale(d)}; opacity:${this.props.tick['tick-opacity']}; color:${this.props.tick['tick-color']}`} />);
                tickValues = this.props.tickValues.map((d, i) => <a-text key={i} opacity={this.props.tick['tick-opacity']} color={`${this.props.tick['tick-color']}`} width={this.props.tick['text-size']} value={`${d}`} anchor='align' side='double' side='double' align='right' rotation='-90 0 0' position={`${0 - this.props.tick['tick-size'] - 0.05} 0.001 ${this.props.scale(d)}`} />);
                break;
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
        {tickValues}
      </a-entity>
    )
  }
}
export default Axis