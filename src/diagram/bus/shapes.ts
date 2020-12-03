import { Node, Shape, Graph, Dom } from "@antv/x6";

export class Bus extends Shape.Edge {
  static create1(x: number, label: string, color: string) {
    return new Bus({
      source: { x: x, y: 700 },
      target: { x: x, y: 50 },
      attrs: {
        wrap: {},
        line: {
          class: "bus",
          stroke: color,
        },
      },
      labels: [
        {
          attrs: {
            labelText: {
              text: label,
              fontFamily: "monospace",
            },
          },
        },
      ],
    });
  }
}

Bus.config({
  zIndex: -1,
  attrs: {
    line: {
      strokeWidth: 5,
      sourceMarker: null,
      targetMarker: null,
    },
  },
  defaultLabel: {
    markup: [
      {
        tagName: "text",
        selector: "labelText",
      },
    ],
    position: {
      distance: 10,
      offset: -20,
      options: {
        keepGradient: true,
        ensureLegibility: true,
      },
    },
  },
});

export class Connector extends Shape.Edge {
  static create1(source: any | [any, number], target: any | [any, number]) {
    const connector = new Connector();
    if (Array.isArray(source)) {
      connector.setSource(source[0] as any, {
        anchor: {
          name: "center",
          args: {
            dy: source[1],
          },
        },
      });
    } else {
      connector.setSource(source as any, {
        selector: source.isEdge() ? "root" : "body",
      });
    }

    if (Array.isArray(target)) {
      connector.setTarget(target[0] as any, {
        priority: true,
        anchor: {
          name: "center",
          args: {
            dy: target[1],
          },
        },
      });
    } else {
      connector.setTarget(target as any, {
        selector: target.isEdge() ? "root" : "body",
      });
    }
    return connector;
  }
}

Connector.config({
  zIndex: 0,
  attrs: {
    line: {
      class: "line",
      sourceMarker: {
        type: "circle",
        r: 4,
        stroke: "#333333",
      },
      targetMarker: {
        type: "circle",
        r: 4,
        stroke: "#333333",
      },
    },
  },
});

export class Component extends Shape.Rect {
  static create1(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string
  ) {
    return new Component({
      position: { x, y },
      size: { width, height },
      attrs: {
        label: {
          textWrap: {
            text: label,
          },
        },
      },
    });
  }
}

Component.config({
  zIndex: 1,
  attrs: {
    label: {
      fontFamily: "monospace",
      fontWeight: "bold",
      fontSize: 15,
      textWrap: {
        width: -20,
      },
    },
    body: {
      strokeWidth: 2,
      stroke: "#cccccc",
    },
  },
  portMarkup: [
    {
      tagName: "rect",
      selector: "portBody",
      attrs: {
        fill: "#ffffff",
        stroke: "#333333",
        "stroke-width": 2,
        x: -10,
        y: -5,
        width: 20,
        height: 10,
      },
    },
  ],
  ports: {
    groups: {
      in: {
        zIndex: -1,
        position: "left",
      },
      out: {
        zIndex: -1,
        position: "right",
      },
    },
  },
});

export class Fader extends Node {
  static create1(x: number, y: number) {
    return new Fader({ position: { x, y } });
  }
}

Fader.config({
  zIndex: 2,
  size: {
    width: 15,
    height: 80,
  },
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "path",
      selector: "arrow",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ],
  attrs: {
    body: {
      strokeWidth: 2,
      refWidth: "100%",
      refHeight: "100%",
      fill: "#ffffff",
      stroke: "#cccccc",
    },
    arrow: {
      d: "M -10 70 L 20 10",
      stroke: "#333333",
      strokeWidth: 3,
      targetMarker: {
        type: "path",
        d: "M 13 -8 0 0 13 8 z",
      },
    },
    label: {
      fontFamily: "monospace",
      fontSize: 12,
      text: "Fader",
      textVerticalAnchor: "bottom",
      textAnchor: "middle",
      refX: "50%",
      stroke: "#333333",
    },
  },
});

export class Aux extends Node {
  static create1(x: number, y: number, label: string) {
    return new Aux({
      position: { x, y },
      attrs: {
        label: {
          text: label,
        },
      },
    });
  }
}

Aux.config({
  zIndex: 2,
  size: {
    width: 30,
    height: 30,
  },
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "circle",
      selector: "auxCircle",
    },
    {
      tagName: "path",
      selector: "auxLine",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ],
  attrs: {
    body: {
      strokeWidth: 2,
      refWidth: "100%",
      refHeight: "100%",
      fill: "#ffffff",
      stroke: "#cccccc",
    },
    auxCircle: {
      r: 10,
      refCx: "50%",
      refCy: "50%",
      stroke: "#333333",
      fill: "none",
      strokeWidth: 2,
    },
    auxLine: {
      d: "M 15 15 L 21 6",
      stroke: "#333333",
      strokeWidth: 3,
    },
    label: {
      fontFamily: "monospace",
      fontSize: 12,
      textVerticalAnchor: "top",
      textAnchor: "start",
      refDx: 5,
      stroke: "#333333",
    },
  },
});

export class EditNode extends Node {
  // 省略实现细节
  static create1(x: number, y: number) {
    return new EditNode({
      position: { x, y },
    });
  }
}
EditNode.config({
  zIndex: 1,
  inherit: "flow-chart-rect",
  width: 120,
  height: 60,
  attrs: {
    //   label: {
    //     fontFamily: "monospace",
    //     fontWeight: "bold",
    //     fontSize: 15,
    //     textWrap: {
    //       width: -20,
    //     },
    //   },
    body: {
      stroke: "#ea6b66",
      strokeWidth: 2,
      fill: "#ffcc99",
      refPoints: "60,20 80,60 60,100 40,60",
    },
    //   fo: {
    //     refWidth: "100%",
    //     refHeight: "100%",
    //   },
    content: {
      contenteditable: "true",
      class: "x6-edit-text",
      style: {
        width: "100%",
        textAlign: "center",
        color: "#000000",
        fontFamily: "monospace",
        fontWeight: "bold",
        fontSize: 15,
        textWrap: {
          width: -20,
        },
      },
    },
  },
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "foreignObject",
      selector: "fo",
      children: [
        {
          ns: Dom.ns.xhtml,
          tagName: "body",
          selector: "foBody",
          attrs: {
            xmlns: Dom.ns.xhtml,
          },
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          children: [
            {
              tagName: "div",
              selector: "content",
            },
          ],
        },
      ],
    },
  ],
  // portMarkup: [
  //   {
  //     tagName: "rect",
  //     selector: "portBody",
  //     attrs: {
  //       fill: "#ffffff",
  //       stroke: "#333333",
  //       "stroke-width": 2,
  //       x: -10,
  //       y: -5,
  //       width: 20,
  //       height: 10,
  //     },
  //   },
  // ],
  // ports: {
  //   groups: {
  //     in: {
  //       position: "left",
  //     },
  //     out: {
  //       position: "right",
  //     },
  //   },
  // },
  shape: "flow-chart-rect",
});
