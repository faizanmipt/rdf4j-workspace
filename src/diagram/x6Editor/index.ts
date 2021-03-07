import { Cell, JSONArray, Markup, Model, Node } from "@antv/x6";
import { Graph, FunctionExt, Shape, Dom, Edge, Point } from "@antv/x6";
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
import { IdcardFilled, RedditCircleFilled } from "@ant-design/icons";
import { randomInt } from "crypto";
import { Text } from "@antv/x6/lib/shape/basic";
import { Config } from "@testing-library/react";
import { SideOptions } from "@antv/x6/lib/util/number/number";
import { ConfigOnClose, ConfigOptions } from "antd/lib/message";
import { CONFIG_TYPE } from "../pages/components/Sider";
import { GraphView } from "@antv/x6/lib/graph/view";
import { OptionType } from "antd/lib/select";

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

interface personList {
  "@id": string;
  "@type": string;
  name: string;
  "foaf:homepage": string;
  depiction: string;
  knows: string[];
}

interface personRepresentation {
  "@id": string;
  "@type": string;
  x: number;
  y: number;
  ref: string;
  nodeParameters: any;
  edgeParameters: any;
}

//Domain model
const newData = [
  {
    "@id": "#bob",
    "@type": "foaf:Person",
    name: "Bob Benson",
    "foaf:homepage": "http://personal.example.org",
    depiction: "http://icon.example.org/1",
    knows: ["#alice", "#mark"],
  },
  {
    "@id": "#alice",
    "@type": "foaf:Person",
    name: "Alice Cooper",
    "foaf:homepage": "http://personal.example.org",
    depiction: "http://icon.example.org/2",
    knows: ["#bob"],
  },
  {
    "@id": "#mark",
    "@type": "foaf:Person",
    name: "Mark Taylor",
    "foaf:homepage": "http://personal.example.org",
    depiction: "http://icon.example.org/3",
    knows: ["#mark"],
  },
];

//Representation model
const representation = [
  {
    "@id": "",
    "@type": "MyNode",
    x: 500,
    y: 5,
    ref: "#bob",
    nodeParameters: {
      width: 250,
      height: 70,
    },
    edgeParameters: {
      shape: "custom-edge-label",
      attrs: {
        line: {
          stroke: "#ccc",
        },
      },
      labels: [
        {
          attrs: {
            line: {
              stroke: "#73d13d",
            },
            text: {
              text: "related to",
            },
          },
        },
      ],
    },
  },
  {
    "@id": "",
    "@type": "MyNode",
    x: 800,
    y: 10,
    ref: "#alice",
    nodeParameters: {
      width: 250,
      height: 70,
    },
    edgeParameters: {
      shape: "custom-edge-label",
      attrs: {
        line: {
          stroke: "#ccc",
        },
      },
      labels: [
        {
          attrs: {
            line: {
              stroke: "#73d13d",
            },
            text: {
              text: "related to",
            },
          },
        },
      ],
    },
  },
  {
    "@id": "",
    "@type": "MyNode",
    x: 1000,
    y: 15,
    ref: "#mark",
    nodeParameters: {
      width: 250,
      height: 70,
    },
    edgeParameters: {
      shape: "custom-edge-label",
      attrs: {
        line: {
          stroke: "#ccc",
        },
      },
      labels: [
        {
          attrs: {
            line: {
              stroke: "#73d13d",
            },
            text: {
              text: "related to",
            },
          },
        },
      ],
    },
  },
];

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

  public static graphConfiguration(current: X6Editor) {
    const magnetAvailabilityHighlighter = {
      name: "stroke",
      args: {
        attrs: {
          fill: "#fff",
          stroke: "#47C769",
        },
      },
    };
    var graphConfig = {
      container: current.container,
      width: document.body.offsetWidth - 10,
      height: document.body.offsetHeight - 10,
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
        magnetAdsorbed: {
          name: "stroke",
          args: {
            attrs: {
              fill: "#fff",
              stroke: "#31d0c6",
            },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: "rounded",
        connectionPoint: "boundary",
        router: {
          name: "er",
          args: {
            direction: "V",
          },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: "#a0a0a0",
                strokeWidth: 1,
                targetMarker: {
                  name: "classic",
                  size: 7,
                },
              },
            },
          });
        },
      },
    };
    return graphConfig;
  }

  public static setNodes(
    current: Graph,
    personData: personList[],
    personRepresentation: personRepresentation[]
  ) {
    personData.forEach((person) => {
      const personRep = personRepresentation.filter(
        (rep) => rep.ref === person["@id"]
      )[0];
      const x = personRep.x;
      const y = personRep.y;
      const name = person.name;
      const ref = person["@id"];
      const params = personRep.nodeParameters;
      const node = current.addNode(
        new MyShape()
          .resize(params.width, params.height)
          .position(x, y)
          .updateText(current, name)
          .updateBoxId(current, ref)
      );
    });
  }

  public static link(current: Graph, personData: personList[]) {
    const nodes: any[] = JSON.parse(JSON.stringify(current.getNodes()));
    var targetNodeList: Node[];
    personData.forEach((person) => {
      const sourceNode: Node = nodes.filter(
        (node) => node.attrs["body"]["id"] === person["@id"]
      )[0];
      person["knows"].forEach((connection) => {
        console.log(connection);
        const targetNode = nodes.filter(
          (node) => node.attrs["body"]["id"] === connection
        )[0];
        return current.addEdge({
          source: { cell: sourceNode },
          target: { cell: targetNode },
          shape: "custom-edge-label",
          attrs: {
            line: {
              stroke: "#ccc",
            },
          },
          labels: [
            {
              attrs: {
                line: {
                  stroke: "#73d13d",
                },
                text: {
                  text: "related to",
                },
              },
            },
          ],
        });
      });
    });
  }

  constructor() {
    this.container = document.getElementById("container")!;
    var graphConfig = X6Editor.graphConfiguration(this);
    this._graph = new Graph(graphConfig);
    X6Editor.setNodes(this._graph, newData, representation);
    X6Editor.link(this._graph, newData);

    this.initEvent();
  }

  initEvent() {
    const { graph } = this;
    var latestCells = graph.getCells();

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
  updateText(graph: Graph, name: string) {
    this.updateAttrs({ textbox: { text: name } });
    return this;
  }
  updateBoxId(graph: Graph, id: string) {
    this.updateAttrs({ body: { id: id } });
    return this;
  }
}

MyShape.config({
  attrs: {
    root: {
      magnet: false,
    },
    body: {
      fill: "#ffffff",
      stroke: "#d9d9d9",
      strokeWidth: 1,
    },
    image: {
      width: 70,
      height: 70,
      strokeWidth: 0,
      "xlink:href":
        "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ",
    },
    textbox: {
      text: "Mr. Simpson",
    },
    border: {
      width: 5,
      x: 245,
      height: 70,
      fill: "coral",
      strokeWidth: 0,
    },
  },
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "image",
      selector: "image",
    },
    {
      tagName: "rect",
      selector: "border",
    },
    {
      tagName: "text",
      selector: "textbox",
    },
  ],
  ports: {
    items: [
      {
        group: "out",
      },
    ],
    groups: {
      in: {
        position: {
          name: "top",
        },
        attrs: {
          portBody: {
            magnet: "passive",
            r: 6,
            stroke: "#ffa940",
            fill: "#fff",
            strokeWidth: 2,
          },
        },
      },
      out: {
        position: {
          name: "bottom",
        },
        attrs: {
          portBody: {
            magnet: true,
            strokeWidth: 0,
          },
        },
      },
    },
  },
  portMarkup: [
    {
      tagName: "circle",
      selector: "portBody",
    },
  ],
});

Graph.registerEdge(
  "custom-edge-label",
  {
    inherit: "edge",
    defaultLabel: {
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
      attrs: {
        label: {
          fill: "#000",
          fontSize: 14,
          textAnchor: "middle",
          textVerticalAnchor: "middle",
          pointerEvents: "none",
        },
        body: {
          ref: "label",
          fill: "#c7c7c7",
          stroke: "#ccc",
          strokeWidth: 2,
          rx: 4,
          ry: 4,
          refWidth: "140%",
          refHeight: "140%",
          refX: "-20%",
          refY: "-20%",
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
  true
);
