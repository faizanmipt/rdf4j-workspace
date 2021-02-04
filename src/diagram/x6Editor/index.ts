import { Cell, JSONArray, Markup, Model, Node } from "@antv/x6";
import { Graph, FunctionExt, Shape, Dom, Edge, Point} from "@antv/x6";
import "./shape";
import { Dnd } from "@antv/x6/es/addon/dnd";
import { Bus, Fader, Aux, Component, Connector, EditNode } from "../bus/shapes";
import "../bus/index.less";
import { tagName } from "@antv/x6/lib/util/dom/elem";
import { nodeCenter } from "@antv/x6/lib/registry/node-anchor/main";
import { attr, mergeAttrs } from "@antv/x6/lib/util/dom/attr";
import { Options } from "@antv/x6/lib/graph/options";
import { config } from "process";
import { text } from "@antv/x6/lib/util/dom/text";
import "@antv/x6-react-shape";
import { FlowChartRect } from "./shape";
import { RedditCircleFilled } from "@ant-design/icons";
import { randomInt } from "crypto";
import { Text } from "@antv/x6/lib/shape/basic";

const data = {
  // 节点
  nodes: [
    {
      id: "node1", // String，可选，节点的唯一标识
      x: 40, // Number，必选，节点位置的 x 值
      y: 40, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "hello", // String，节点标签
    },
    {
      id: "node2", // String，节点的唯一标识
      x: 160, // Number，必选，节点位置的 x 值
      y: 180, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "world", // String，节点标签
    },
  ],
  // 边
  edges: [
    {
      source: "node1", // String，必须，起始节点 id
      target: "node2", // String，必须，目标节点 id
    },
  ],
};

export default class X6Editor {
  private static instance: X6Editor;
  private _graph: Graph;
  private container: HTMLElement;

  public get graph() {
    return this._graph;
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new X6Editor();
    }
    return this.instance;
  }

  public static graphConfiguration(current:any){
    const magnetAvailabilityHighlighter = {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#47C769',
        },
      },
    }
    var graphConfig = {
      container: current.container,
      width: document.body.offsetWidth - 10,
      height: document.body.offsetHeight - 10,
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
            },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: 'rounded',
        connectionPoint: 'boundary',
        router: {
          name: 'er',
          args: {
            direction: 'V',
          },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#a0a0a0',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 7,
                },
              },
            },
          })
        },
        validateConnection({ sourceView, targetView, targetMagnet }) {
          if (!targetMagnet) {
            return false
          }
    
          if (targetMagnet.getAttribute('port-group') !== 'in') {
            return false
          }
    
          if (targetView) {
            const node = targetView.cell
            if (node instanceof MyShape) {
              const portId = targetMagnet.getAttribute('port')
              const usedInPorts = node.getUsedInPorts(current)
              if (usedInPorts.find((port) => port && port.id === portId)) {
                return false
              }
            }
          }
    
          return true
        },
    }
  }
  return graphConfig

}

  public static setNodes(current: any){
    const node1 = current.addNode(
      //new MyShape().resize(250, 70).position(200, 50).updateInPorts(current),
      new MyShape().resize(250, 70).position(200, 100),
    )
    var x= 1400
    var y= 5
    const relatives = [
      'Company A',
      'Mr. Dmitri',
      'Mr. Henry',
      'Company B',
      'Food Store',
      'Pyatrochka',
      'Miratorg',
      'Mr. Daniel',
      'Mr. Alexey',
      'MIPT',
      'Moscow',
      'Mr. Louis',
      'Company C',
      'Dolgoprudny',
      'MIPT Dormitory',
      'Mr. Alexander',
      'Mr. Ilya',
      'Mr. Raechel',
      'Mr. Mendeleev',
      'Mr. Kornaev'
    ]

    for (let index = 0; index < relatives.length; index++) {
      const node2 = current.addNode(
        // new MyShape().resize(250, 70).position(500, 50).updateInPorts(current),
        new MyShape().resize(250, 70).position(x, y).updateText(current,relatives[index])
      )
      const num = [node1, node2]
      const randomElement1 = num[Math.floor(Math.random() * num.length)];
      var randomElement2
      if(randomElement1 ==  node1)
        randomElement2 = node2
      else
        randomElement2 = node1   
      X6Editor.link(randomElement1,randomElement2,current)
      y=y+40
      x=x-55
    }

  }

  public static link(source: Node, target: Node, current:any) {
    return current.addEdge({
      source: { cell: source },
      target: { cell: target },
      shape: 'custom-edge-label',
      attrs: {
        line: {
          stroke: '#ccc',
        },
      },
      labels: [
        {
          attrs: {
            line: {
              stroke: '#73d13d',
            },
            text: {
              text: 'related to',
            },
          },
        },
      ],
        })
  }

  constructor() {
    this.container = document.getElementById("container")!;
    var graphConfig:any = X6Editor.graphConfiguration(this)
    this._graph = new Graph(graphConfig);
    X6Editor.setNodes(this._graph)
    this.initEvent();
  }

  // constructor() {
  //   this.container = document.getElementById("container")!;
  //   var graphConfig:any = X6Editor.graphConfiguration(this)
  //   this._graph = new Graph(graphConfig);
    // this.initEvent();
    //this._graph.fromJSON(data);

    // var bus1 = Bus.create1(600, "Sub-group 1", "#333333");
    // var bus2 = Bus.create1(625, "Sub-group 2", "#333333");
    // var bus3 = Bus.create1(650, "Sub-group 3", "#333333");
    // var bus4 = Bus.create1(675, "Sub-group 4", "#333333");
    // var bus5 = Bus.create1(700, "Mix Left", "#ff5964");
    // var bus6 = Bus.create1(725, "Mix Right", "#b5d99c");
    // var bus7 = Bus.create1(750, "Post-fade Aux", "#35a7ff");
    // var bus8 = Bus.create1(775, "Pre-fade Aux", "#6b2d5c");

    // var component1 = Component.create1(850, 80, 80, 80, "Stereo Mix").addPort({
    //   group: "out",
    // });
    // var component2 = Component.create1(840, 230, 100, 30, "Pre Aux").addPort({
    //   group: "out",
    // });
    // var component3 = Component.create1(840, 180, 100, 30, "Post Aux").addPort({
    //   group: "out",
    // });
    // var component4 = Component.create1(450, 100, 90, 100, "Output Routing");
    // var component5 = Component.create1(450, 350, 90, 100, "Output Routing");
    // var component6 = Component.create1(
    //   100,
    //   130,
    //   150,
    //   40,
    //   "Input Channel"
    // ).addPort({ group: "in" });
    // var component7 = Component.create1(100, 380, 150, 40, "Sub-group 1");

    // var fader1 = Fader.create1(350, 110);
    // var fader2 = Fader.create1(350, 360);
    // var aux1 = Aux.create1(420, 220, "Post-fade Aux");
    // var aux2 = Aux.create1(350, 260, "Pre-fade Aux");
    // var aux3 = Aux.create1(420, 470, "Post-fade Aux");
    // var aux4 = Aux.create1(350, 510, "Pre-fade Aux");

    // var connector1 = Connector.create1(bus1, component7);
    // var connector2 = Connector.create1(fader2, component5);
    // var connector3 = Connector.create1(connector2, aux3);
    // var connector4 = Connector.create1(fader1, component4);
    // var connector5 = Connector.create1(connector4, aux1);
    // var connector6 = Connector.create1(component7, fader2);
    // var connector7 = Connector.create1(connector6, aux4);
    // var connector8 = Connector.create1(component6, fader1);
    // var connector9 = Connector.create1(connector8, aux2);
    // var connector10 = Connector.create1(bus5, [component1, -10]);
    // var connector11 = Connector.create1(bus6, [component1, 10]);
    // var connector12 = Connector.create1(bus7, component3);
    // var connector13 = Connector.create1(bus8, component2);
    // var connector14 = Connector.create1([component4, -40], bus1);
    // var connector15 = Connector.create1([component4, -24], bus2);
    // var connector16 = Connector.create1([component4, -8], bus3);
    // var connector17 = Connector.create1([component4, 8], bus4);
    // var connector18 = Connector.create1([component4, 24], bus5);
    // var connector19 = Connector.create1([component4, 40], bus6);
    // var connector20 = Connector.create1([component5, -20], bus5);
    // var connector21 = Connector.create1([component5, 20], bus6);
    // var connector22 = Connector.create1(aux1, bus7);
    // var connector23 = Connector.create1(aux2, bus8);
    // var connector24 = Connector.create1(aux3, bus7);
    // var connector25 = Connector.create1(aux4, bus8);

    // // Special Marker
    // connector1.attr("line", {
    //   sourceMarker: {
    //     type: "path",
    //     d: "M -2 -8 15 0 -2 8 z",
    //   },
    // });

    // // Vertices
    // connector1.setVertices([{ x: 175, y: 320 }]);
    // connector3.setVertices([{ x: 400, y: 485 }]);
    // connector5.setVertices([{ x: 400, y: 235 }]);
    // connector7.setVertices([{ x: 310, y: 525 }]);
    // connector9.setVertices([{ x: 310, y: 275 }]);

    // // Embed vertices
    // component7.embed(connector1);
    // aux3.embed(connector3 as any);
    // aux1.embed(connector5 as any);
    // aux4.embed(connector7 as any);
    // aux2.embed(connector9 as any);

    // this._graph.model.resetCells([
    //   bus1,
    //   bus2,
    //   bus3,
    //   bus4,
    //   bus5,
    //   bus6,
    //   bus7,
    //   bus8,
    //   component1,
    //   component2,
    //   component3,
    //   component4,
    //   component5,
    //   component6,
    //   component7,
    //   fader1,
    //   fader2,
    //   aux1,
    //   aux2,
    //   aux3,
    //   aux4,
    //   connector1,
    //   connector2,
    //   connector3,
    //   connector4,
    //   connector5,
    //   connector6,
    //   connector7,
    //   connector8,
    //   connector9,
    //   connector10,
    //   connector11,
    //   connector12,
    //   connector13,
    //   connector14,
    //   connector15,
    //   connector16,
    //   connector17,
    //   connector18,
    //   connector19,
    //   connector20,
    //   connector21,
    //   connector22,
    //   connector23,
    //   connector24,
    //   connector25,
    // ] as any);
  //   this.initEvent();
  // }

  // showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
  //   for (let i = 0, len = ports.length; i < len; i = i + 1) {
  //     ports[i].style.visibility = show ? "visible" : "hidden";
  //   }
  // }

  initEvent() {
    const { graph } = this;
    var latestCells = graph.getCells();
    // console.log(graph.model.getNodes())

    // this.listAllNodes(graph)

    // graph.on("node:mouseleave", () => {
    //   const ports = this.container.querySelectorAll(
    //     ".x6-port-body"
    //   ) as NodeListOf<SVGAElement>;
    //   this.showPorts(ports, false);
    // });

    // graph.on('node:unselected', () => {
    //   graph.resetCells(latestCells)
    // })

    graph.on(
      "node:dblclick",
      (args: { cell: Cell; node: Node; options: Model.SetOptions }) => {
        const node = graph.getSelectedCells();
        const nodeConnectors = graph.getConnectedEdges(node[0]);
        const allCells = graph.getCells();
        const nodeInt = JSON.parse(JSON.stringify(node[0]));

        var newNodeAttrs = {
          body: {
            strokeWidth: 2,
            stroke: "#cccccc",
          },
          fo: {
            refWidth: "100%",
            refHeight: "100%",
          },
          label: {
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: 15,
          },
          content: {
            contenteditable: "true",
            class: "x6-edit-text",
            html:
              typeof nodeInt["attrs"] != "undefined"
                ? nodeInt["attrs"]["label"]["textWrap"]["text"]
                : "",
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
        };

        const newRect = new Shape.Rect(nodeInt);
        newRect
          .setMarkup([
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
          ])
          .attr(newNodeAttrs);

        const nn = graph.addNode(newRect);
        graph.removeNode(node[0]["id"]);
        graph.addCell(nn);
        nodeConnectors.forEach((connector) => {
          console.log(connector);
          const edge = new Shape.Edge(JSON.parse(JSON.stringify(connector)));
          graph.addEdge(edge);
          graph.addCell(edge);
        });
      }
    );

    // keyboard
    graph.bindKey("ctrl+c", () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.copy(cells);
      }
      return false;
    });
    graph.bindKey("ctrl+v", () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 });
        graph.cleanSelection();
        graph.select(cells);
      }
      return false;
    });
    graph.bindKey("ctrl+x", () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.cut(cells);
      }
      return false;
    });
    graph.bindKey("backspace", () => {
      const cells = graph.getSelectedCells();
      const focusElem = document.activeElement;
      if (focusElem?.className === "x6-edit-text") {
        return true;
      }
      if (cells.length) {
        graph.removeCells(cells);
      }
      return false;
    });
  }
}





class MyShape extends Shape.Rect {
  // getInPorts() {
  //   return this.getPortsByGroup('in')
  // }

  // getOutPorts() {
  //   return this.getPortsByGroup('out')
  // }

  // getUsedInPorts(graph: Graph) {
  //   const incomingEdges = graph.getIncomingEdges(this) || []
  //   return incomingEdges.map((edge: Edge) => {
  //     const portId = edge.getTargetPortId()
  //     return this.getPort(portId!)
  //   })
  // }

  // getNewInPorts(length: number) {
  //   return Array.from(
  //     {
  //       length,
  //     },
  //     () => {
  //       return {
  //         group: 'in',
  //       }
  //     },
  //   )
  // }

  // updateInPorts(graph: Graph) {
  //   const minNumberOfPorts = 2
  //   const ports = this.getInPorts()
  //   const usedPorts = this.getUsedInPorts(graph)
  //   const newPorts = this.getNewInPorts(
  //     Math.max(minNumberOfPorts - usedPorts.length, 1),
  //   )

    

  //   if (
  //     ports.length === minNumberOfPorts &&
  //     ports.length - usedPorts.length > 0
  //   ) {
  //     // noop
  //   } else if (ports.length === usedPorts.length) {
  //     this.addPorts(newPorts)
  //   } else if (ports.length + 1 > usedPorts.length) {
  //     this.prop(
  //       ['ports', 'items'],
  //       this.getOutPorts().concat(usedPorts).concat(newPorts),
  //       {
  //         rewrite: true,
  //       },
  //     )
  //   }
      
  //   return this
  // }

  updateText(graph: Graph, name : any){
      this.updateAttrs({textbox:{text:name}})
      return this
  }
}


MyShape.config({
  attrs: {
    root: {
      magnet: false,
    },
    body: {
      fill: '#ffffff',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
    image: {
      width: 70,
      height: 70,
      strokeWidth: 0,
      //fill: '#36a832',
      // 'style': 'background-color : coral',
      'xlink:href': 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'
    },
    textbox: {
      text: 'Mr. Simpson'
    },
    border:{
      width: 5,
      x:245,
      height: 70,
      fill: 'coral',
      strokeWidth: 0,
    }
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    }, 
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'rect',
      selector: 'border',
    },
    {
      tagName: 'text',
      selector: 'textbox',
    },
  ],
  ports: {
    items: [
      {
        group: 'out',
      },
    ],
    groups: {
      in: {
        position: {
          name: 'top',
        },
        attrs: {
          portBody: {
            magnet: 'passive',
            r: 6,
            stroke: '#ffa940',
            fill: '#fff',
            strokeWidth: 2,
          },
        },
      },
      out: {
        position: {
          name: 'bottom',
        },
        attrs: {
          portBody: {
            magnet: true,
           // r: 6,
            //fill: '#fff',
            //stroke: '#3199FF',
            strokeWidth: 0,
          },
        },
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
    },
  ],
})

Graph.registerEdge(
  'custom-edge-label',
  {
    inherit: 'edge',
    defaultLabel: {
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        label: {
          fill: '#000',
          fontSize: 14,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none',
        },
        body: {
          ref: 'label',
          fill: '#c7c7c7',
          stroke: '#ccc',
          strokeWidth: 2,
          rx: 4,
          ry: 4,
          refWidth: '140%',
          refHeight: '140%',
          refX: '-20%',
          refY: '-20%',
        },
      },
      position: {
        distance: 200,
        options: {
          absoluteDistance: true,
          reverseDistance: true,
        },
      },
    },
  },
  true,
)