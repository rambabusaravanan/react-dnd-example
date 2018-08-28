import * as React from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Canvas from "./Canvas";
import Tool from "./Tool";
const update = require("immutability-helper");

class Container extends React.Component {
  state = {
    tools: []
  };
  addItem = tool => {
    this.setState(state => {
      state.tools = [...state.tools, tool];
      return state;
    });
  };
  moveTool = (dragIndex, hoverIndex) => {
    const { tools } = this.state;
    const dragCard = tools[dragIndex];

    console.log(
      dragIndex,
      hoverIndex,
      JSON.stringify(this.state.tools.map(t => t.id))
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
          <Tool
            tool={{ id: 1, text: "Text" }}
            addItem={this.addItem}
            customProp="hello textTool"
          />
          <Tool tool={{ id: 2, text: "Head" }} addItem={this.addItem} />
          <Tool tool={{ id: 3, text: "Btn" }} addItem={this.addItem} />
        </div>
        <Canvas
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
