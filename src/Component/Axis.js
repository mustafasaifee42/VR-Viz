import React, { Component } from 'react';
import 'aframe';
import * as moment from 'moment';

class Axis extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {

    //Adding Axis
    let ticks, tickText, axis, tickValues, rotation, align, title, titlePosition, titleRotation, titleAlign, titlePadding, grid;
    if (this.props.scaleType === 'ordinal') {
      tickValues = this.props.domain
    } else {
      tickValues = this.props.scale.ticks(this.props.tick.noOfTicks)
    }

    let padding = 0;
    if (this.props.padding)
      padding = this.props.padding / 2


    if (this.props.title)
      if (this.props.title.padding)
        titlePadding = this.props.title['padding']
      else
        titlePadding = 0
    switch (this.props.axis) {
      case 'x':
        {
          if (!this.props.tick.rotation)
            rotation = '-90 0 0'
          else
            rotation = this.props.tick.rotation

          if (this.props.title) {
            if (!this.props.title.align)
              titleAlign = 'center'
            else
              titleAlign = this.props.title.align

            if (!this.props.title.rotation)
              titleRotation = '-90 0 0'
            else
              titleRotation = this.props.title.rotation
          }

          if (!this.props.tick.align)
            align = 'center'
          else
            align = this.props.tick.align

          switch (this.props.orient) {
            case 'front-top':
              {
                if (this.props.title) {
                  if (!this.props.title.position)
                    titlePosition = `${this.props.dimensions.width / 2} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size'] + titlePadding}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding} />;

                }
                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":this.props.scale(d) + padding , "y":this.props.dimensions.height ,"z":this.props.dimensions.depth })
                    gridObj.push({"x":this.props.scale(d) + padding , "y":this.props.dimensions.height ,"z":0})
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":this.props.scale(d) + padding , "y":this.props.dimensions.height ,"z":this.props.dimensions.depth })
                  gridObj.push({"x":this.props.scale(d) + padding , "y":this.props.dimensions.height ,"z":this.props.dimensions.depth + this.props.tick['size']})
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} ${this.props.dimensions.height} ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />
                  });
                  break;
                }
              }
            case 'back-bottom':
              {
                if (this.props.title) {
                  if (!this.props.title.position)
                    titlePosition = `${this.props.dimensions.width / 2} 0.001 ${0 - this.props.tick['size'] - titlePadding}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":this.props.dimensions.depth })
                    gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":0})
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                axis = <a-entity line={`start:0, 0.001, 0; end:${this.props.dimensions.width} 0.001 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                  
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":0 })
                  gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":0 - this.props.tick['size']})
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} 0.001 ${0 - this.props.tick['size'] - 0.05}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} 0.001 ${0 - this.props.tick['size'] - 0.05}`} />
                  });
                  break;
                }
              }
            case 'back-top':
              {
                if (this.props.title) {
                  if (!this.props.title.position)
                    titlePosition = `${this.props.dimensions.width / 2} ${this.props.dimensions.height} ${0 - this.props.tick['size'] - titlePadding}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":this.props.scale(d) + padding , "y":this.props.dimensions.height ,"z":this.props.dimensions.depth })
                    gridObj.push({"x":this.props.scale(d) + padding , "y":this.props.dimensions.height ,"z":0})
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} ${this.props.dimensions.height} 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":this.props.scale(d) + padding , "y":this.props.dimensions.height ,"z":0 })
                  gridObj.push({"x":this.props.scale(d) + padding , "y":this.props.dimensions.height ,"z":0 - this.props.tick['size']})
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} ${this.props.dimensions.height} ${0 - this.props.tick['size'] - 0.05}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} ${this.props.dimensions.height} ${0 - this.props.tick['size'] - 0.05}`} />
                  });
                  break;
                }
              }
            case 'front-bottom':
              {
                if (this.props.title) {
                  if (!this.props.title.position)
                    titlePosition = `${this.props.dimensions.width / 2} 0.001 ${this.props.dimensions.depth + this.props.tick['size'] + titlePadding}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;
                }
                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":this.props.dimensions.depth })
                    gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":0})
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                axis = <a-entity line={`start:0, 0.001, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":this.props.dimensions.depth })
                  gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":this.props.dimensions.depth + this.props.tick['size']})
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} 0.001 ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} 0.001 ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />
                  });
                  break;
                }
              }
            default:
              {
                if (this.props.title) {
                  if (!this.props.title.position)
                    titlePosition = `${this.props.dimensions.width / 2} 0.001 ${this.props.dimensions.depth + this.props.tick['size'] + titlePadding}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;
                }
                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":this.props.dimensions.depth })
                    gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":0})
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                
                axis = <a-entity line={`start:0, 0.001, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":this.props.dimensions.depth })
                  gridObj.push({"x":this.props.scale(d) + padding , "y":0.001 ,"z":this.props.dimensions.depth + this.props.tick['size']})
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} 0.001 ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${this.props.scale(d) + padding} 0.001 ${this.props.dimensions.depth + this.props.tick['size'] + 0.05}`} />
                  });
                  break;
                }
              }
          }
          break;
        }
      case 'y':
        {
          if (!this.props.tick.rotation)
            rotation = '0 0 0'
          else
            rotation = this.props.tick.rotation

          if (this.props.title) {
            if (!this.props.title.align)
              titleAlign = 'right'
            else
              titleAlign = this.props.title.align
            if (!this.props.title.rotation)
              titleRotation = '0 0 0'
            else
              titleRotation = this.props.title.rotation
          }
          if (!this.props.tick.align)
            align = 'right'
          else
            align = this.props.tick.align

          switch (this.props.orient) {
            case 'front-left':
              {

                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":0 , "y":this.props.scale(d) + padding ,"z":0})
                    gridObj.push({"x":0 , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'right'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${0 - this.props.tick['size'] - titlePadding} ${this.props.dimensions.height / 2} ${this.props.dimensions.depth}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":0 , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                  gridObj.push({"x":0 - this.props.tick['size'] , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d) + padding} ${this.props.dimensions.depth}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d) + padding} ${this.props.dimensions.depth}`} />
                  });
                  break;
                }
              }
            case 'back-left':
              {

                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":0 , "y":this.props.scale(d) + padding ,"z":0})
                    gridObj.push({"x":0 , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'right'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${0 - this.props.tick['size'] - titlePadding} ${this.props.dimensions.height / 2} 0`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:0 0.001 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":0 , "y":this.props.scale(d) + padding ,"z":0 })
                  gridObj.push({"x":0 - this.props.tick['size'] , "y":this.props.scale(d) + padding ,"z":0 })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d) + padding} 0`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d) + padding} 0`} />
                  });
                  break;
                }
              }
            case 'front-right':
              {

                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":this.props.dimensions.width , "y":this.props.scale(d) + padding ,"z":0})
                    gridObj.push({"x":this.props.dimensions.width , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'left'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.dimensions.height / 2} ${this.props.dimensions.depth}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":this.props.dimensions.width , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                  gridObj.push({"x":this.props.dimensions.width + this.props.tick['size'] , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align='left' rotation={rotation} position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.scale(d) + padding} ${this.props.dimensions.depth}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align='left' rotation={rotation} position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.scale(d) + padding} ${this.props.dimensions.depth}`} />
                  });
                  break;
                }
              }
            case 'back-right':
              {
                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":this.props.dimensions.width , "y":this.props.scale(d) + padding ,"z":0})
                    gridObj.push({"x":this.props.dimensions.width , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'left'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${this.props.dimensions.width + this.props.tick['size'] + titlePadding} ${this.props.dimensions.height / 2} 0`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:${this.props.dimensions.width}, ${this.props.dimensions.height}, 0; end:${this.props.dimensions.width} 0.001 0; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":this.props.dimensions.width , "y":this.props.scale(d) + padding ,"z":0 })
                  gridObj.push({"x":this.props.dimensions.width + this.props.tick['size'] , "y":this.props.scale(d) + padding ,"z":0 })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align='left' rotation={rotation} position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.scale(d) + padding} 0`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align='left' rotation={rotation} position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.scale(d) + padding} 0`} />
                  });
                  break;
                }
              }
            default:
              {
                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":0 , "y":this.props.scale(d) + padding ,"z":0})
                    gridObj.push({"x":0 , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'right'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${0 - this.props.tick['size'] - titlePadding} ${this.props.dimensions.height / 2} ${this.props.dimensions.depth}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, ${this.props.dimensions.depth}; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":0 , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                  gridObj.push({"x":0 - this.props.tick['size'] , "y":this.props.scale(d) + padding ,"z":this.props.dimensions.depth })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d) + padding} ${this.props.dimensions.depth}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} ${this.props.scale(d) + padding} ${this.props.dimensions.depth}`} />
                  });
                  break;
                }
              }
          }
          break;
        }
      case 'z':
        {
          if (!this.props.tick.rotation)
            rotation = '-90 0 0'
          else
            rotation = this.props.tick.rotation

          if (!this.props.tick.align)
            align = 'right'
          else
            align = this.props.tick.align

          if (this.props.title) {
            if (!this.props.title.rotation)
              titleRotation = '-90 0 0'
            else
              titleRotation = this.props.title.rotation
          }



          switch (this.props.orient) {
            case 'bottom-left':
              {

                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":0 , "y":0.001 ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":this.props.dimensions.width , "y":0.001,"z":this.props.scale(d) + padding })
                    gridObj.push({"x":0.001 , "y":0 ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":0.001 , "y":this.props.dimensions.height,"z":this.props.scale(d) + padding })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'right'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${0 - this.props.tick['size'] - titlePadding} 0.001 ${this.props.dimensions.depth / 2}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":0 , "y":0.001 ,"z":this.props.scale(d) + padding })
                  gridObj.push({"x":0 - this.props.tick['size'] , "y":0.001 ,"z":this.props.scale(d) + padding })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d) + padding}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d) + padding}`} />
                  });
                  break;
                }
              }
            case 'top-left':
              {

                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":0 , "y":this.props.dimensions.height ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":this.props.dimensions.width , "y":this.props.dimensions.height,"z":this.props.scale(d) + padding })
                    gridObj.push({"x":0.001 , "y":0 ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":0.001 , "y":this.props.dimensions.height,"z":this.props.scale(d) + padding })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'right'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${0 - this.props.tick['size'] - titlePadding} ${this.props.dimensions.height} ${this.props.dimensions.depth / 2}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:0, ${this.props.dimensions.height}, 0; end:0 ${this.props.dimensions.height} ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":0 , "y":this.props.dimensions.height ,"z":this.props.scale(d) + padding })
                  gridObj.push({"x":0 - this.props.tick['size'] , "y":this.props.dimensions.height ,"z":this.props.scale(d) + padding })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} ${this.props.dimensions.height} ${this.props.scale(d) + padding}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d) + padding}`} />
                  });
                  break;
                }
              }
            case 'top-right':
              {

                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":0 , "y":0.001 ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":this.props.dimensions.width , "y":0.001,"z":this.props.scale(d) + padding })
                    gridObj.push({"x":this.props.dimensions.width , "y":0 ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":this.props.dimensions.width , "y":this.props.dimensions.height,"z":this.props.scale(d) + padding })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }
                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'left'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${this.props.dimensions.width + this.props.tick['size'] + titlePadding} ${this.props.dimensions.height} ${this.props.dimensions.depth / 2}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:${this.props.dimensions.width}, 0.001, 0; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":this.props.dimensions.width , "y":this.props.dimensions.height ,"z":this.props.scale(d) + padding })
                  gridObj.push({"x":this.props.dimensions.width + this.props.tick['size'] , "y":this.props.dimensions.height ,"z":this.props.scale(d) + padding })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align='left' rotation={rotation} position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} ${this.props.dimensions.height} ${this.props.scale(d) + padding}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} ${this.props.dimensions.height} ${this.props.scale(d) + padding}`} />
                  });
                  break;
                }
              }
            case 'bottom-right':
              {

                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":0 , "y":0.001 ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":this.props.dimensions.width , "y":0.001,"z":this.props.scale(d) + padding })
                    gridObj.push({"x":this.props.dimensions.width , "y":0 ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":this.props.dimensions.width , "y":this.props.dimensions.height,"z":this.props.scale(d) + padding })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }

                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'left'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${this.props.dimensions.width + this.props.tick['size'] + titlePadding} 0.001 ${this.props.dimensions.depth / 2}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:${this.props.dimensions.width}, 0.001, 0; end:${this.props.dimensions.width} 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":this.props.dimensions.width , "y":0.001 ,"z":this.props.scale(d) + padding })
                  gridObj.push({"x":this.props.dimensions.width + this.props.tick['size'] , "y":0.001 ,"z":this.props.scale(d) + padding })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align='left' rotation={rotation} position={`${this.props.dimensions.width + this.props.tick['size'] + 0.05} 0.001 ${this.props.scale(d) + padding}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d) + padding}`} />
                  });
                  break;
                }
              }
            default:
              {

                if (this.props.grid) {
                  let gridObj = []
                  tickValues.forEach((d, i) =>{
                    gridObj.push({"x":0 , "y":0.001 ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":this.props.dimensions.width , "y":0.001,"z":this.props.scale(d) + padding })
                    gridObj.push({"x":0.001 , "y":0 ,"z":this.props.scale(d) + padding})
                    gridObj.push({"x":0.001 , "y":this.props.dimensions.height,"z":this.props.scale(d) + padding })
                  })
                  grid = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                }

                if (this.props.title) {
                  if (!this.props.title.align)
                    titleAlign = 'right'
                  else
                    titleAlign = this.props.title.align
                  if (!this.props.title.position)
                    titlePosition = `${0 - this.props.tick['size'] - titlePadding} 0.001 ${this.props.dimensions.depth / 2}`
                  else
                    titlePosition = this.props.title.position
                  title = <a-text opacity={this.props.title['opacity']} color={`${this.props.title['color']}`} width={this.props.title['fontSize']} value={`${this.props.title.text}`} anchor='align' side='double' align={titleAlign} rotation={titleRotation} position={titlePosition} billboard={this.props.title.billboarding}/>;

                }
                axis = <a-entity line={`start:0, 0.001, 0; end:0 0.001 ${this.props.dimensions.depth}; opacity:${this.props.tick['opacity']}; color:${this.props.tick['color']}`} />
                
                let gridObj = []
                tickValues.forEach((d, i) =>{
                  gridObj.push({"x":0 , "y":0.001 ,"z":this.props.scale(d) + padding })
                  gridObj.push({"x":0 - this.props.tick['size'] , "y":0.001 ,"z":this.props.scale(d) + padding })
                })
                ticks = <a-frame-curve-line points={JSON.stringify(gridObj)} type={'lineSegment'} color={this.props.grid['color']} opacity={this.props.grid['opacity']} />
                if (!this.props.tick.format) {
                  tickText = tickValues.map((d, i) => <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${d}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d) + padding}`} />);
                  break;
                }
                else {
                  tickText = tickValues.map((d, i) => {
                    let txt = moment(d).format(this.props.tick.format)
                    return <a-text key={i} billboard={this.props.tick.billboarding} opacity={this.props.tick['opacity']} color={`${this.props.tick['color']}`} width={this.props.tick['fontSize']} value={`${txt}`} anchor='align' side='double' align={align} rotation={rotation} position={`${0 - this.props.tick['size'] - 0.05} 0.001 ${this.props.scale(d) + padding}`} />
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
        {grid}
        {tickText}
        {title}
      </a-entity>
    )
  }
}
export default Axis