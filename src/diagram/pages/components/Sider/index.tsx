import React, { useEffect, useState, useRef } from "react";
import {
  Collapse,
  Typography,
  Button,
  Divider,
  Menu,
  Dropdown,
  Row,
  Col,
  Select,
} from "antd";
import FlowChart from "../FlowChart";
import styles from "./sider.module.less";
import { DownOutlined } from "@ant-design/icons";
import X6Editor from "../../../x6Editor";
import { Cell, Edge, Graph, JSONArray, JSONObject, Shape, Dom } from "@antv/x6";
import { useGridAttr } from "../../../models/global";
import { useGlobalCells } from "../../../models/global";
import { Connector } from "../../../bus/shapes";

const { Panel } = Collapse;
const { Title, Paragraph, Text, Link } = Typography;
const { Option } = Select;
export enum CONFIG_TYPE {
  GRID,
  NODE,
  EDGE,
}
var sourceNodeId: any = undefined;
var targetNodeId: any = undefined;

function listAllNodes(graph: Graph) {
  var nodes = graph.getNodes();
  var outputNodes = [{ name: "name", id: "id" }];
  nodes.forEach((node) => {
    var attrs = JSON.parse(JSON.stringify(node["store"]["data"]["attrs"]));
    if (attrs["label"]) {
      if ("textWrap" in attrs["label"]) {
        outputNodes.push({
          name: attrs["label"]["textWrap"]["text"],
          id: node["id"],
        });
      } else if ("text" in attrs["label"])
        outputNodes.push({
          name: attrs["label"]["text"],
          id: JSON.parse(JSON.stringify(node["id"])),
        });
    }
  });
  if (outputNodes.length == 1) return outputNodes;
  else {
    outputNodes.splice(0, 1);
    return outputNodes;
  }
}

function listAllEdges(graph: Graph) {
  var nodes = graph.getEdges();

  var outputEdges: string[] = [];
  nodes.forEach((node) => {
    var attrs = JSON.parse(JSON.stringify(node["store"]["data"]["attrs"]));
    if ("textWrap" in attrs["label"]) {
      outputEdges.push(attrs["label"]["textWrap"]["text"]);
    } else if ("text" in attrs["label"])
      outputEdges.push(attrs["label"]["text"]);
  });
  return outputEdges;
}

function handleSourceNodeChange(value: any) {
  sourceNodeId = undefined;
  sourceNodeId = value;
}

function handleTargetNodeChange(value: any) {
  targetNodeId = undefined;
  targetNodeId = value;
}

function addConnector() {
  const { graph } = X6Editor.getInstance();
  if (sourceNodeId && targetNodeId) {
    console.log("connected");
    const sourceNode = graph.getCell(sourceNodeId);
    const targetNode = graph.getCell(targetNodeId);
    const connector = Connector.create1(sourceNode, targetNode);
    graph.addEdge(connector);
    graph.addCell(connector);
  } else {
    console.log("Select both nodes first");
  }
}

export default function () {
  const [nodes, setNodes] = useState([{ name: "name", id: "id" }]);
  const [edges, setEdges] = useState<string[]>([]);

  useEffect(() => {
    const { graph } = X6Editor.getInstance();
    const retnodes: any = listAllNodes(graph);
    setNodes(retnodes);
    //const retedges:string[] = listAllEdges(graph)
    //console.log(retnodes)
    //setNodes(retnodes)
    //setEdges(retedges)
    graph.on("blank:mousedown", () => {
      const { graph } = X6Editor.getInstance();
      const retnodes: any = listAllNodes(graph);
      setNodes(retnodes);
    });
    graph.on("node:unselected", () => {
      const { graph } = X6Editor.getInstance();
      const retnodes: any = listAllNodes(graph);
      setNodes(retnodes);
      // console.log(nodes)
      //  console.log("worked")
    });

    graph.on("node:selected", () => {
      //   graph.resetCells(graph.getCells())
      //   const retnodes:any = listAllNodes(graph)
      //  setNodes(retnodes)
      //console.log("working...")
    });
  }, []);

  // const nodeMenu = (
  //   <Menu>
  //     {
  //       nodes.map(node=>{
  //         return( <Menu.Item>
  //         <a target="_blank" rel="noopener noreferrer">{node}</a>
  //        </Menu.Item>)
  //       })
  //     }
  //   </Menu>
  //   );

  //   const edgeMenu = (
  //     <Menu>
  //     {
  //       edges.map(edge=>{
  //         return( <Menu.Item>
  //         <a target="_blank" rel="noopener noreferrer">{edge}</a>
  //        </Menu.Item>)
  //       })
  //     }
  //   </Menu>
  //   );

  return (
    <div>
      <Collapse
        accordion={true}
        bordered={false}
        expandIconPosition="right"
        className={styles.collapse}
      >
        <Panel header="Блок-схема" key="1">
          <Divider orientation="left" plain>
            Nodes
          </Divider>
          <FlowChart />
          <Divider orientation="left" plain>
            Edges
          </Divider>
          <Row justify="space-around" align="middle">
            <Col span={20}>
              <Divider orientation="left" plain>
                Add New Edge
              </Divider>
              <Row justify="space-around" align="middle">
                <Col span={12}>
                  <Row justify="space-around" align="middle">
                    <Col span={24}>
                      <Select
                        defaultValue="Select Source Node"
                        style={{ width: "100%" }}
                        onSelect={handleSourceNodeChange}
                      >
                        {nodes.map((node) => {
                          // console.log(node)
                          return (
                            <Select.Option value={node.id}>
                              {node.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col span={24}>
                      <Select
                        defaultValue="Select Target Node"
                        style={{ width: "100%" }}
                        onSelect={handleTargetNodeChange}
                      >
                        {nodes.map((node) => {
                          return (
                            <Select.Option value={node.id}>
                              {node.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Button type="primary" onClick={addConnector}>
                    Add
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* <Row justify="space-around" align="middle">
          <Col span={20}>
            <Divider orientation="left" plain>Change Nodes</Divider>
            <Row justify="space-around" align="middle">
              <Col span={24}>
              <Select defaultValue="Select Edge" style={{width:"100%"}} onSelect={handleTargetNodeChange}>
                      {
                        nodes.map(node=>{
                          return(<Select.Option value={node.id}>{node.name}</Select.Option>)
                        })
                      }
                    </Select>
              </Col>
            </Row><br></br>
            <Row justify="space-around" align="middle">
              <Col span={24}>
                <Row justify="space-around" align="middle">
                  <Col span={12}>
                  <Select defaultValue="Select Source Node" style={{width:"100%"}} onSelect={handleSourceNodeChange}>
                      {
                        nodes.map(node=>{
                         // console.log(node)
                          return(<Select.Option value={node.id}>{node.name}</Select.Option>)
                          
                        })
                      }
                    </Select>
                  </Col>
                  <Col span={12}>
                    <Button type="primary">Change</Button>
                  </Col>
                </Row><br></br>
                <Row>
                  <Col span={12}>
                  <Select defaultValue="Select Target Node" style={{width:"100%"}} onSelect={handleTargetNodeChange}>
                      {
                        nodes.map(node=>{
                          return(<Select.Option value={node.id}>{node.name}</Select.Option>)
                        })
                      }
                    </Select>
                  </Col>
                  <Col span={12}>
                    <Button type="primary">Change</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row> */}
        </Panel>
        <Panel header="Диаграмма классов" key="4" />
        <Panel header="Временная диаграмма" key="5" />
      </Collapse>
    </div>
  );
}
