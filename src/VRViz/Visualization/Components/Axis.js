import React from "react";
import "aframe";
import * as moment from "moment";

const XAxis = (props) => {
  const padding = props.padding ? props.padding / 2 : 0;

  const titlePadding = props.title?.padding ? props.title?.padding : 0;

  const rotation = props.tick?.rotation ? props.tick?.rotation : "-90 0 0";

  const align = props.tick?.align ? props.tick?.align : "center";

  const titleRotation = props.title?.rotation
    ? props.title?.rotation
    : "-90 0 0";

  const titleAlign = props.titleRotation?.align ? props.title?.align : "center";

  const titlePosition = props.title?.position
    ? props.title?.position
    : props.orient === "front-top"
      ? `${props.dimensions.width / 2} ${props.dimensions.height} ${props.dimensions.depth + props.tick.size + titlePadding
      }`
      : props.orient === "back-bottom"
        ? `${props.dimensions.width / 2} 0.001 ${0 - props.tick.size - titlePadding
        }`
        : props.orient === "back-top"
          ? `${props.dimensions.width / 2} ${props.dimensions.height} ${0 - props.tick.size - titlePadding
          }`
          : `${props.dimensions.width / 2} 0.001 ${props.dimensions.depth + props.tick.size + titlePadding
          }`;

  const title = props.title ? (
    <a-text
      opacity={props.title.opacity ? props.title.opacity : 1}
      color={props.title.color ? props.title.color : "#000000"}
      width={props.title.fontSize ? props.title.fontSize : 12}
      value={props.title.text ? props.title.text : "x-axis"}
      anchor="align"
      side="double"
      align={titleAlign}
      rotation={titleRotation}
      position={titlePosition}
      billboard={props.title.billboarding === false ? false : true}
    />
  ) : null;

  const grid = !props.grid
    ? null
    : props.orient === "front-top" || props.orient === "back-top"
      ? props.domain.map((d, i) => (
        <a-entity
          key={i}
          line={`start:${props.scale(d) + padding} ${props.dimensions.height} ${props.dimensions.depth
            }; end:${props.scale(d) + padding} ${props.dimensions.height
            } 0; color:${props.grid.color ? props.grid.color : "#000000"
            }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
        />
      ))
      : props.domain.map((d, i) => (
        <a-entity
          key={i}
          line={`start:${props.scale(d) + padding} 0 ${props.dimensions.depth
            }; end:${props.scale(d) + padding} 0 0; color:${props.grid.color ? props.grid.color : "#000000"
            }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
        />
      ));

  const ticks = props.tick
    ? props.orient === "front-top"
      ? props.domain.map((d, i) => (
        <a-entity
          key={i}
          line={`start:${props.scale(d) + padding} ${props.dimensions.height
            } ${props.dimensions.depth}; end:${props.scale(d) + padding} ${props.dimensions.height
            } ${props.dimensions.depth + props.tick.size}; color:${props.tick.color ? props.tick.color : "#000000"
            }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
        />
      ))
      : props.orient === "back-bottom"
        ? props.domain.map((d, i) => (
          <a-entity
            key={i}
            line={`start:${props.scale(d) + padding} 0.001 ${props.dimensions.depth
              }; end:${props.scale(d) + padding} 0.001 ${0 - props.tick.size
              }; color:${props.tick.color ? props.tick.color : "#000000"
              }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
          />
        ))
        : props.orient === "back-top"
          ? props.domain.map((d, i) => (
            <a-entity
              key={i}
              line={`start:${props.scale(d) + padding} ${props.dimensions.height
                } ${props.dimensions.depth}; end:${props.scale(d) + padding} ${props.dimensions.height
                } ${0 - props.tick.size}; color:${props.tick.color ? props.tick.color : "#000000"
                }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
            />
          ))
          : props.domain.map((d, i) => (
            <a-entity
              key={i}
              line={`start:${props.scale(d) + padding} 0.001 ${props.dimensions.depth
                }; end:${props.scale(d) + padding} 0.001 ${props.dimensions.depth + props.tick.size
                }; color:${props.tick.color ? props.tick.color : "#000000"
                }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
            />
          ))
    : null;

  const axis =
    props.orient === "front-top" ? (
      <a-entity
        line={`start:0 ${props.dimensions.height} ${props.dimensions.depth
          }; end:${props.dimensions.width} ${props.dimensions.height} ${props.dimensions.depth
          }; opacity:${props.tick?.opacity ? props.tick.opacity : 1}; color:${props.tick?.color ? props.tick.color : "#000000"
          }`}
      />
    ) : props.orient === "back-bottom" ? (
      <a-entity
        line={`start:0 0.001 0; end:${props.dimensions.width
          } 0.001 0; opacity:${props.tick?.opacity ? props.tick.opacity : 1
          }; color:${props.tick?.color ? props.tick.color : "#000000"}`}
      />
    ) : props.orient === "back-top" ? (
      <a-entity
        line={`start:0 ${props.dimensions.height} 0; end:${props.dimensions.width
          } ${props.dimensions.height} 0; opacity:${props.tick?.opacity ? props.tick.opacity : 1
          }; color:${props.tick?.color ? props.tick.color : "#000000"}`}
      />
    ) : (
      <a-entity
        line={`start:0 0.001 ${props.dimensions.depth}; end:${props.dimensions.width
          } 0.001 ${props.dimensions.depth}; opacity:${props.tick?.opacity ? props.tick.opacity : 1
          }; color:${props.tick?.color ? props.tick.color : "#000000"}`}
      />
    );

  const tickText = props.tick
    ? props.orient === "front-top"
      ? props.domain.map((d, i) => (
        <a-text
          key={i}
          billboard={props.tick.billboarding === false ? false : true}
          opacity={props.tick.opacity ? props.tick.opacity : 1}
          color={props.tick.color}
          width={props.tick.fontSize}
          value={
            props.tick.format
              ? `${moment(d).format(props.tick.format)}`
              : `${d}`
          }
          anchor="align"
          side="double"
          align={align}
          rotation={rotation}
          position={`${props.scale(d) + padding} ${props.dimensions.height} ${props.dimensions.depth + props.tick.size + 0.05
            }`}
        />
      ))
      : props.orient === "back-bottom"
        ? props.domain.map((d, i) => (
          <a-text
            key={i}
            billboard={props.tick.billboarding === false ? false : true}
            opacity={props.tick.opacity ? props.tick.opacity : 1}
            color={props.tick.color}
            width={props.tick.fontSize}
            value={
              props.tick.format
                ? `${moment(d).format(props.tick.format)}`
                : `${d}`
            }
            anchor="align"
            side="double"
            align={align}
            rotation={rotation}
            position={`${props.scale(d) + padding} 0.001 ${0 - props.tick.size - 0.05
              }`}
          />
        ))
        : props.orient === "back-top"
          ? props.domain.map((d, i) => (
            <a-text
              key={i}
              billboard={props.tick.billboarding === false ? false : true}
              opacity={props.tick.opacity ? props.tick.opacity : 1}
              color={props.tick.color}
              width={props.tick.fontSize}
              value={
                props.tick.format
                  ? `${moment(d).format(props.tick.format)}`
                  : `${d}`
              }
              anchor="align"
              side="double"
              align={align}
              rotation={rotation}
              position={`${props.scale(d) + padding} ${props.dimensions.height} ${0 - props.tick.size - 0.05
                }`}
            />
          ))
          : props.domain.map((d, i) => (
            <a-text
              key={i}
              billboard={props.tick.billboarding === false ? false : true}
              opacity={props.tick.opacity ? props.tick.opacity : 1}
              color={props.tick.color}
              width={props.tick.fontSize}
              value={
                props.tick.format
                  ? `${moment(d).format(props.tick.format)}`
                  : `${d}`
              }
              anchor="align"
              side="double"
              align={align}
              rotation={rotation}
              position={`${props.scale(d) + padding} 0.001 ${props.dimensions.depth + props.tick.size + 0.05
                }`}
            />
          ))
    : null;

  return (
    <>
      {ticks}
      {grid}
      {axis}
      {tickText}
      {title}
    </>
  );
};

const YAxis = (props) => {
  const padding = props.padding ? props.padding / 2 : 0;

  const titlePadding = props.title?.padding ? props.title?.padding : 0;

  const rotation = props.tick?.rotation ? props.tick?.rotation : "0 0 0";

  const align = props.tick?.align ? props.tick?.align : "right";

  const titleRotation = props.title?.rotation ? props.title?.rotation : "0 0 0";

  const titleAlign = props.titleRotation?.align ? props.title?.align : "right";

  const titlePosition = props.title?.position
    ? props.title?.position
    : props.orient === "back-left"
      ? `${0 - props.tick.size - titlePadding} ${props.dimensions.height / 2} 0`
      : props.orient === "front-right"
        ? `${props.dimensions.width + props.tick.size + 0.05} ${props.dimensions.height / 2
        } ${props.dimensions.depth}`
        : props.orient === "back-right"
          ? `${props.dimensions.width + props.tick.size + titlePadding} ${props.dimensions.height / 2
          } 0`
          : `${0 - props.tick.size - titlePadding} ${props.dimensions.height / 2} ${props.dimensions.depth
          }`;

  const title = props.title ? (
    <a-text
      opacity={props.title.opacity ? props.title.opacity : 1}
      color={props.title.color ? props.title.color : "#000000"}
      width={props.title.fontSize ? props.title.fontSize : 12}
      value={props.title.text ? props.title.text : "y-axis"}
      anchor="align"
      side="double"
      align={titleAlign}
      rotation={titleRotation}
      position={titlePosition}
      billboard={props.title.billboarding === false ? false : true}
    />
  ) : null;

  const grid = !props.grid
    ? null
    : props.orient === "front-right" || props.orient === "back-right"
      ? props.domain.map((d, i) => (
        <a-entity
          key={i}
          line={`start:${props.dimensions.width} ${props.scale(d) + padding
            } 0; end:${props.dimensions.width} ${props.scale(d) + padding} ${props.dimensions.depth
            }; color:${props.grid.color ? props.grid.color : "#000000"
            }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
        />
      ))
      : props.domain.map((d, i) => (
        <a-entity
          key={i}
          line={`start:0 ${props.scale(d) + padding} 0; end:0 ${props.scale(d) + padding
            } ${props.dimensions.depth}; color:${props.grid.color ? props.grid.color : "#000000"
            }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
        />
      ));

  const axis =
    props.orient === "back-left" ? (
      <a-entity
        line={`start:0, ${props.dimensions.height}, 0; end:0 0.001 0; opacity:${props.tick?.opacity ? props.tick.opacity : 1
          }; color:${props.tick?.color ? props.tick.color : "#000000"}`}
      />
    ) : props.orient === "front-right" ? (
      <a-entity
        line={`start:${props.dimensions.width}, ${props.dimensions.height}, ${props.dimensions.depth
          }; end:${props.dimensions.width} 0.001 ${props.dimensions.depth
          }; opacity:${props.tick?.opacity ? props.tick.opacity : 1}; color:${props.tick?.color ? props.tick.color : "#000000"
          }`}
      />
    ) : props.orient === "back-right" ? (
      <a-entity
        line={`start:${props.dimensions.width}, ${props.dimensions.height
          }, 0; end:${props.dimensions.width} 0.001 0; opacity:${props.tick?.opacity ? props.tick.opacity : 1
          }; color:${props.tick?.color ? props.tick.color : "#000000"}`}
      />
    ) : (
      <a-entity
        line={`start:0, ${props.dimensions.height}, ${props.dimensions.depth
          }; end:0 0.001 ${props.dimensions.depth}; opacity:${props.tick?.opacity ? props.tick.opacity : 1
          }; color:${props.tick?.color ? props.tick.color : "#000000"}`}
      />
    );

  const ticks = props.tick
    ? props.orient === "back-left"
      ? props.domain.map((d, i) => (
        <a-entity
          key={i}
          line={`start:0 ${props.scale(d) + padding} 0; end:${0 - props.tick.size
            } ${props.scale(d) + padding} 0; color:${props.tick.color ? props.tick.color : "#000000"
            }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
        />
      ))
      : props.orient === "front-right"
        ? props.domain.map((d, i) => (
          <a-entity
            key={i}
            line={`start:${props.dimensions.width} ${props.scale(d) + padding
              } ${props.dimensions.depth}; end:${props.dimensions.width + props.tick.size
              } ${props.scale(d) + padding} ${props.dimensions.depth}; color:${props.tick.color ? props.tick.color : "#000000"
              }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
          />
        ))
        : props.orient === "back-right"
          ? props.domain.map((d, i) => (
            <a-entity
              key={i}
              line={`start:${props.dimensions.width} ${props.scale(d) + padding
                } 0; end:${props.dimensions.width + props.tick.size} ${props.scale(d) + padding
                } 0; color:${props.tick.color ? props.tick.color : "#000000"
                }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
            />
          ))
          : props.domain.map((d, i) => (
            <a-entity
              key={i}
              line={`start:0 ${props.scale(d) + padding} ${props.dimensions.depth
                }; end:${0 - props.tick.size} ${props.scale(d) + padding} ${props.dimensions.depth
                }; color:${props.tick.color ? props.tick.color : "#000000"
                }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
            />
          ))
    : null;

  const tickText = props.tick
    ? props.orient === "back-left"
      ? props.domain.map((d, i) => (
        <a-text
          key={i}
          billboard={props.tick.billboarding === false ? false : true}
          opacity={props.tick.opacity}
          color={props.tick.color}
          width={props.tick.fontSize}
          value={
            props.tick.format
              ? `${moment(d).format(props.tick.format)}`
              : `${d}`
          }
          anchor="align"
          side="double"
          align={align}
          rotation={rotation}
          position={`${0 - props.tick.size - 0.05} ${props.scale(d) + padding
            } 0`}
        />
      ))
      : props.orient === "front-right"
        ? props.domain.map((d, i) => (
          <a-text
            key={i}
            billboard={props.tick.billboarding === false ? false : true}
            opacity={props.tick.opacity}
            color={props.tick.color}
            width={props.tick.fontSize}
            value={
              props.tick.format
                ? `${moment(d).format(props.tick.format)}`
                : `${d}`
            }
            anchor="align"
            side="double"
            align={align}
            rotation={rotation}
            position={`${props.dimensions.width + props.tick.size + 0.05} ${props.scale(d) + padding
              } ${props.dimensions.depth}`}
          />
        ))
        : props.orient === "back-right"
          ? props.domain.map((d, i) => (
            <a-text
              key={i}
              billboard={props.tick.billboarding === false ? false : true}
              opacity={props.tick.opacity}
              color={props.tick.color}
              width={props.tick.fontSize}
              value={
                props.tick.format
                  ? `${moment(d).format(props.tick.format)}`
                  : `${d}`
              }
              anchor="align"
              side="double"
              align={align}
              rotation={rotation}
              position={`${props.dimensions.width + props.tick.size + 0.05} ${props.scale(d) + padding
                } 0`}
            />
          ))
          : props.domain.map((d, i) => (
            <a-text
              key={i}
              billboard={props.tick.billboarding === false ? false : true}
              opacity={props.tick.opacity}
              color={props.tick.color}
              width={props.tick.fontSize}
              value={
                props.tick.format
                  ? `${moment(d).format(props.tick.format)}`
                  : `${d}`
              }
              anchor="align"
              side="double"
              align={align}
              rotation={rotation}
              position={`${0 - props.tick.size - 0.05} ${props.scale(d) + padding
                } ${props.dimensions.depth}`}
            />
          ))
    : null;

  return (
    <>
      {grid}
      {axis}
      {ticks}
      {tickText}
      {title}
    </>
  );
};

const ZAxis = (props) => {
  const padding = props.padding ? props.padding / 2 : 0;

  const titlePadding = props.title?.padding ? props.title?.padding : 0;

  const rotation = props.tick?.rotation ? props.tick?.rotation : "-90 0 0";

  const align = props.tick?.align ? props.tick?.align : "right";

  const titleRotation = props.title?.rotation
    ? props.title?.rotation
    : "-90 0 0";

  const titleAlign = props.titleRotation?.align ? props.title?.align : "right";

  const titlePosition = props.title?.position
    ? props.title?.position
    : props.orient === "top-left"
      ? `${0 - props.tick.size - titlePadding} ${props.dimensions.height} ${props.dimensions.depth / 2
      }`
      : props.orient === "top-right"
        ? `${props.dimensions.width + props.tick.size + titlePadding} ${props.dimensions.height
        } ${props.dimensions.depth / 2}`
        : props.orient === "bottom-right"
          ? `${props.dimensions.width + props.tick.size + titlePadding} 0.001 ${props.dimensions.depth / 2
          }`
          : `${0 - props.tick.size - titlePadding} 0.001 ${props.dimensions.depth / 2
          }`;

  const title = props.title ? (
    <a-text
      opacity={props.title.opacity ? props.title.opacity : 1}
      color={props.title.color ? props.title.color : "#000000"}
      width={props.title.fontSize ? props.title.fontSize : 12}
      value={props.title.text ? props.title.text : "z-axis"}
      anchor="align"
      side="double"
      align={titleAlign}
      rotation={titleRotation}
      position={titlePosition}
      billboard={props.title.billboarding === false ? false : true}
    />
  ) : null;

  const axis =
    props.orient === "top-left" ? (
      <a-entity
        line={`start:0 ${props.dimensions.height} 0; end:0 ${props.dimensions.height
          } ${props.dimensions.depth}; opacity:${props.tick?.opacity ? props.tick.opacity : 1
          }; color:${props.tick?.color ? props.tick.color : "#000000"}`}
      />
    ) : props.orient === "top-right" ? (
      <a-entity
        line={`start:${props.dimensions.width} ${props.dimensions.height
          } 0; end:${props.dimensions.width} ${props.dimensions.height} ${props.dimensions.depth
          }; opacity:${props.tick?.opacity ? props.tick.opacity : 1}; color:${props.tick?.color ? props.tick.color : "#000000"
          }`}
      />
    ) : props.orient === "bottom-right" ? (
      <a-entity
        line={`start:${props.dimensions.width} 0.001 0; end:${props.dimensions.width
          } 0.001 ${props.dimensions.depth}; opacity:${props.tick?.opacity ? props.tick.opacity : 1
          }; color:${props.tick?.color ? props.tick.color : "#000000"}`}
      />
    ) : (
      <a-entity
        line={`start:0 0.001 0; end:0 0.001 ${props.dimensions.depth
          }; opacity:${props.tick?.opacity ? props.tick.opacity : 1}; color:${props.tick?.color ? props.tick.color : "#000000"
          }`}
      />
    );

  const grid = !props.grid
    ? null
    : props.orient === "top-left"
      ? props.domain.map((d, i) => (
        <a-entity
          key={i}
          line={`start:0 ${props.dimensions.height} ${props.scale(d) + padding
            }; end:${props.dimensions.width} ${props.dimensions.height} ${props.scale(d) + padding
            }; color:${props.grid.color ? props.grid.color : "#000000"
            }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
          line__2={`start:0.001 0 ${props.scale(d) + padding}; end:0.001 ${props.dimensions.height
            } ${props.scale(d) + padding}; color:${props.grid.color ? props.grid.color : "#000000"
            }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
        />
      ))
      : props.orient === "top-right"
        ? props.domain.map((d, i) => (
          <a-entity
            key={i}
            line={`start:0 ${props.dimensions.height} ${props.scale(d) + padding
              }; end:${props.dimensions.width} ${props.dimensions.height} ${props.scale(d) + padding
              }; color:${props.grid.color ? props.grid.color : "#000000"
              }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
            line__2={`start:${props.dimensions.width} 0 ${props.scale(d) + padding
              }; end:${props.dimensions.width} ${props.dimensions.height} ${props.scale(d) + padding
              }; color:${props.grid.color ? props.grid.color : "#000000"
              }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
          />
        ))
        : props.orient === "bottom-right"
          ? props.domain.map((d, i) => (
            <a-entity
              key={i}
              line={`start:0 0.001 ${props.scale(d) + padding}; end:${props.dimensions.width
                } 0.001 ${props.scale(d) + padding}; color:${props.grid.color ? props.grid.color : "#000000"
                }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
              line__2={`start:${props.dimensions.width} 0 ${props.scale(d) + padding
                }; end:${props.dimensions.width} ${props.dimensions.height} ${props.scale(d) + padding
                }; color:${props.grid.color ? props.grid.color : "#000000"
                }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
            />
          ))
          : props.domain.map((d, i) => (
            <a-entity
              key={i}
              line={`start:0 0.001 ${props.scale(d) + padding}; end:${props.dimensions.width
                } 0.001 ${props.scale(d) + padding}; color:${props.grid.color ? props.grid.color : "#000000"
                }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
              line__2={`start:0.001 0 ${props.scale(d) + padding}; end:0.001 ${props.dimensions.height
                } ${props.scale(d) + padding}; color:${props.grid.color ? props.grid.color : "#000000"
                }; opacity:${props.grid.opacity ? props.grid.opacity : 1}`}
            />
          ));

  const ticks = props.tick
    ? props.orient === "top-left"
      ? props.domain.map((d, i) => (
        <a-entity
          key={i}
          line={`start:0 ${props.dimensions.height} ${props.scale(d) + padding
            }; end:${0 - props.tick.size} ${props.dimensions.height} ${props.scale(d) + padding
            }; color:${props.tick.color ? props.tick.color : "#000000"
            }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
        />
      ))
      : props.orient === "top-right"
        ? props.domain.map((d, i) => (
          <a-entity
            key={i}
            line={`start:${props.dimensions.width} ${props.dimensions.height} ${props.scale(d) + padding
              }; end:${props.dimensions.width + props.tick.size} ${props.dimensions.height
              } ${props.scale(d) + padding}; color:${props.tick.color ? props.tick.color : "#000000"
              }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
          />
        ))
        : props.orient === "bottom-right"
          ? props.domain.map((d, i) => (
            <a-entity
              key={i}
              line={`start:${props.dimensions.width} 0.001 ${props.scale(d) + padding
                }; end:${props.dimensions.width + props.tick.size} 0.001 ${props.scale(d) + padding
                }; color:${props.tick.color ? props.tick.color : "#000000"
                }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
            />
          ))
          : props.domain.map((d, i) => (
            <a-entity
              key={i}
              line={`start:0 0.001 ${props.scale(d) + padding}; end:${0 - props.tick.size
                } 0.001 ${props.scale(d) + padding}; color:${props.tick.color ? props.tick.color : "#000000"
                }; opacity:${props.tick.opacity ? props.tick.opacity : 1}`}
            />
          ))
    : null;

  const tickText = props.tick
    ? props.orient === "top-left"
      ? props.domain.map((d, i) => (
        <a-text
          key={i}
          billboard={props.tick.billboarding === false ? false : true}
          opacity={props.tick.opacity}
          color={props.tick.color}
          width={props.tick.fontSize}
          value={
            props.tick.format
              ? `${moment(d).format(props.tick.format)}`
              : `${d}`
          }
          anchor="align"
          side="double"
          align={align}
          rotation={rotation}
          position={`${0 - props.tick.size - 0.05} ${props.dimensions.height
            } ${props.scale(d) + padding}`}
        />
      ))
      : props.orient === "top-right"
        ? props.domain.map((d, i) => (
          <a-text
            key={i}
            billboard={props.tick.billboarding === false ? false : true}
            opacity={props.tick.opacity}
            color={props.tick.color}
            width={props.tick.fontSize}
            value={
              props.tick.format
                ? `${moment(d).format(props.tick.format)}`
                : `${d}`
            }
            anchor="align"
            side="double"
            align={align}
            rotation={rotation}
            position={`${props.dimensions.width + props.tick.size + 0.05} ${props.dimensions.height
              } ${props.scale(d) + padding}`}
          />
        ))
        : props.orient === "bottom-right"
          ? props.domain.map((d, i) => (
            <a-text
              key={i}
              billboard={props.tick.billboarding === false ? false : true}
              opacity={props.tick.opacity}
              color={props.tick.color}
              width={props.tick.fontSize}
              value={
                props.tick.format
                  ? `${moment(d).format(props.tick.format)}`
                  : `${d}`
              }
              anchor="align"
              side="double"
              align={align}
              rotation={rotation}
              position={`${props.dimensions.width + props.tick.size + 0.05
                } 0.001 ${props.scale(d) + padding}`}
            />
          ))
          : props.domain.map((d, i) => (
            <a-text
              key={i}
              billboard={props.tick.billboarding === false ? false : true}
              opacity={props.tick.opacity}
              color={props.tick.color}
              width={props.tick.fontSize}
              value={
                props.tick.format
                  ? `${moment(d).format(props.tick.format)}`
                  : `${d}`
              }
              anchor="align"
              side="double"
              align={align}
              rotation={rotation}
              position={`${0 - props.tick.size - 0.05} 0.001 ${props.scale(d) + padding
                }`}
            />
          ))
    : null;

  return (
    <>
      {grid}
      {axis}
      {ticks}
      {tickText}
      {title}
    </>
  );
};

const AxisBox = (props) => (
  <a-entity
    line={`start: 0 0 0; end: ${props.width} 0 0; color: ${props.color}`}
    line__2={`start: 0 0 0; end: 0 ${props.height} 0; color: ${props.color}`}
    line__3={`start: 0 0 0; end: 0 0 ${props.depth}; color: ${props.color}`}
    line__4={`start: ${props.width} ${props.height} ${props.depth}; end: 0 ${props.height} ${props.depth}; color: ${props.color}`}
    line__5={`start: ${props.width} ${props.height} ${props.depth}; end: ${props.width} 0 ${props.depth}; color: ${props.color}`}
    line__6={`start: ${props.width} ${props.height} ${props.depth}; end: ${props.width} ${props.height} 0; color: ${props.color}`}
    line__7={`start: ${props.width} 0 ${props.depth}; end: 0 0 ${props.depth}; color: ${props.color}`}
    line__8={`start: ${props.width} 0 ${props.depth}; end: ${props.width} 0 0; color: ${props.color}`}
    line__9={`start: 0 ${props.height} 0; end: 0 ${props.height} ${props.depth}; color: ${props.color}`}
    line__10={`start: 0 ${props.height} 0; end: ${props.width} ${props.height} 0; color: ${props.color}`}
    line__11={`start: 0 0 ${props.depth}; end: 0 ${props.height} ${props.depth}; color: ${props.color}`}
    line__12={`start: ${props.width} 0 0; end: ${props.width} ${props.height} 0; color: ${props.color}`}
  />
);

export { XAxis, YAxis, ZAxis, AxisBox };
