import * as React from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Canvas from "./Canvas";
import Tool from "./Tool";
const update = require("immutability-helper");

const randomText = (length = 5) => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

class Container extends React.Component {
  state = {
    tool: {
      id: "canvas-root",
      text: "Layout",
      items: []
    }
  };
  addItemRecursive = (tool, newTool, id) => {
    if (tool.text === "Layout")
      if (tool.id === id) {
        tool = update(tool, { items: { $push: [newTool] } });
      } else {
        for (let i = 0; i < tool.items.length; i++) {
          let nestedTool = tool.items[i];
          if (nestedTool.text === "Layout") {
            let newNestedTool = this.addItemRecursive(nestedTool, newTool, id);
            if (newNestedTool.items !== nestedTool.items)
              tool = update(tool, {
                items: { $splice: [[i, 1, newNestedTool]] }
              });
          }
        }
      }
    return tool;
  };
  addItem = (newTool, id) => {
    newTool.id = randomText();
    this.setState(state => {
      state.tool = this.addItemRecursive(state.tool, newTool, id);
      return state;
    });
  };
  reorder = (tool, dragIndex, hoverIndex, dragParent) => {
    if (dragParent === tool.id) {
      // current layout source
      const dragTool = tool.items[dragIndex];
      tool = update(tool, {
        items: { $splice: [[dragIndex, 1], [hoverIndex, 0, dragTool]] }
      });
    } else {
      // nested layout source
      for (let i = 0; i < tool.items.length; i++) {
        let nestedTool = tool.items[i];
        if (nestedTool.text === "Layout") {
          let newNestedTool = this.reorder(nestedTool, dragIndex, hoverIndex, dragParent);
          if (newNestedTool.items !== nestedTool.items)
            tool = update(tool, {
              items: { $splice: [[i, 1, newNestedTool]] }
            });
        }
      }
    }
    return tool;
  };
  moveTool = (dragIndex, hoverIndex, dragParent, hoverParent) => {
    let { tool } = this.state;
    if (dragParent === hoverParent) {
      tool = this.reorder(tool, dragIndex, hoverIndex, dragParent);
    }
    this.setState({ tool });
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
          customProp="hello canvas"
          allowedDropEffect="move"
          moveTool={this.moveTool}
          tool={this.state.tool}
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container);
