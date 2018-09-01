import * as React from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Canvas from "./Canvas";
import Tool from "./Tool";
const update = require("immutability-helper");

const randomText = (length = 5) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

class Container extends React.Component {
  state = {
    tools: []
  };
  addItemRecursive = (tool, newTool, id) => {
    console.log("o", tool.id, JSON.stringify(tool));
    if (tool.text === "Layout")
      if (tool.id === id) {
        tool.items = [...tool.items, newTool];
      } else {
        for (let nestedTool of tool.items) {
          if (nestedTool.text === "Layout")
            nestedTool.items = this.addItemRecursive(
              nestedTool,
              newTool,
              id
            ).items;
        }
      }
    console.log("n", tool.id, JSON.stringify(tool));
    return tool;
  };
  addItem = (tool, id) => {
    this.setState(state => {
      tool.id = state.tools.length + randomText();
      let rootTool = { text: "Layout", items: state.tools, id: "canvas-root" };
      state.tools = this.addItemRecursive(rootTool, tool, id).items;
      return JSON.parse(JSON.stringify(state));
    });
  };
  moveTool = (dragIndex, hoverIndex, parent) => {
    const { tools } = this.state;
    const dragCard = tools[dragIndex];

    console.log(
      dragIndex,
      hoverIndex,
      JSON.stringify(this.state.tools.map(t => t.id)),
      parent
    );
    let newState = update(this.state, {
      tools: { $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]] }
    });
    this.setState(newState);
  };
  render() {
    return (
      <div>
        <div style={{ background: "grey" }}>
          <Tool tool={{ text: "Text" }} addItem={this.addItem} />
          <Tool tool={{ text: "Head" }} addItem={this.addItem} />
          <Tool tool={{ text: "Btn" }} addItem={this.addItem} />
          <Tool tool={{ text: "Layout", items: [] }} addItem={this.addItem} />
        </div>
        <Canvas
          id="canvas-root"
          customProp="hello canvas"
          allowedDropEffect="move"
          moveTool={this.moveTool}
          tools={this.state.tools}
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container);
