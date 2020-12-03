import React, { useEffect, useState } from "react";
import x6Editor from "../../../x6Editor";
import { Dnd } from "@antv/x6/es/addon/dnd";
import { FlowChartRect, FlowChartPloygon } from "../../../x6Editor/shape";
import styles from "./flowchart.module.less";
import { Component } from "./../../../bus/shapes";
import { Graph, Shape, Dom } from "@antv/x6";
import { SettingOutlined } from "@ant-design/icons";
import { useGlobalCells } from "../../../models/global";

enum FLOW_CHART_TYPE {
  RECT = "rect",
  ELLIPSE = "ellipse",
  DIAMOND = "diamond",
  PARALLELOGRAM = "Parallelogram",
  EDGE = "edge",
}

function removeNode(graph: Graph, nodeId: string) {
  // const nodes = graph.getCells()
  // const filteredNodes = nodes.filter(function(node){
  //   if(node['id'] != nodeId){
  //     return node
  //   }
  // })
  graph.removeCell(nodeId);
  graph.removeNode(nodeId);
  graph.resetCells(graph.getCells());
}

export default function () {
  const [nodeList, setNodeList] = useState<any>(undefined);
  const [node, setNode] = useState<any>(undefined);
  var outerId = "";
  var position: any;
  var size: any;
  var shape: any;
  const { globalCells, setCells } = useGlobalCells();
  useEffect(() => {
    const { graph } = x6Editor.getInstance();

    graph.on("node:selected", () => {
      if (node) {
        const oldNodeList: any = nodeList;
        const newNodeList = graph.getCells();
        var focusNode;
        focusNode = newNodeList.filter(
          (nodeEntry: any) => !oldNodeList.includes(nodeEntry)
        );
        focusNode = JSON.parse(JSON.stringify(focusNode));
        const selectedCell = JSON.parse(
          JSON.stringify(graph.getSelectedCells())
        );
        const len = focusNode.length;
        const id = focusNode[len - 1]["id"];
        position = focusNode[len - 1]["position"];
        size = focusNode[len - 1]["size"];
        shape = focusNode[len - 1]["shape"];

        if (id == selectedCell[0]["id"]) {
          // console.log('right node')

          outerId = id;
          setNode(undefined);
        } else {
          console.log("wrong node");
        }
      }
    });

    graph.on("node:unselected", () => {
      if (outerId) {
        if (document.querySelector(".x6-edit-text")?.innerHTML) {
          const newName: any = document.querySelector(".x6-edit-text")
            ?.innerHTML;
          removeNode(graph, outerId);
          const x = position["x"];
          const y = position["y"];
          const width = size["width"];
          const height = size["height"];
          const component = Component.create1(x, y, width, height, newName);
          graph.addNode(component);
          graph.addCell(component);
        }
      }
    });
  });

  const dnd: Dnd = new Dnd({
    target: x6Editor.getInstance().graph as any,
  });

  const startDrag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: FLOW_CHART_TYPE
  ) => {
    let innerNode;
    switch (type) {
      case FLOW_CHART_TYPE.RECT:
        innerNode = new FlowChartRect();

        break;
      case FLOW_CHART_TYPE.ELLIPSE:
        innerNode = new FlowChartRect({
          width: 100,
          height: 50,
          attrs: {
            body: {
              rx: 20,
              ry: 20,
            },
          },
        });
        break;
      case FLOW_CHART_TYPE.DIAMOND:
        innerNode = new FlowChartPloygon({
          ports: {
            items: [
              {
                group: "in",
              },
              {
                group: "out",
              },
              {
                group: "left",
              },
              {
                group: "right",
              },
            ],
          },
        });
        break;
      case FLOW_CHART_TYPE.PARALLELOGRAM:
        innerNode = new FlowChartPloygon({
          width: 130,
          height: 60,
          attrs: {
            body: {
              refPoints: "60,20 160,20 130,60 30,60",
            },
          },
        });
        break;
      default:
        break;
    }
    if (node == undefined) {
      // console.log(name)
      dnd.start(innerNode as any, e.nativeEvent as any);
      setNode(innerNode);
      const { graph } = x6Editor.getInstance();
      setNodeList(graph.getCells());
      // const newName:any = document.querySelector('.x6-edit-text')?.innerHTML
      // setName(newName)
    }
  };

  return (
    <div className={styles.chart}>
      <div
        className={styles.ellipse}
        onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.ELLIPSE)}
      />
      <div onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.RECT)} />
      <div
        className={styles.diamond}
        onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.DIAMOND)}
      />
      <div
        className={styles.parallelogram}
        onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.PARALLELOGRAM)}
      />
    </div>
  );
}
