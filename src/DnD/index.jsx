import * as React from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Container as Grid, Col, Row } from "reactstrap";
import Canvas from "./Canvas";
import Tool from "./Tool";

export default class Container extends React.Component {
  state = {
    tools: []
  };
  addItem = name => {
    this.setState(state => {
      state.tools = [...state.tools, name];
      return state;
    });
  };
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div style={{ background: "grey" }}>
          <Tool
            name="Text"
            addItem={this.addItem}
            customProp="hello textTool"
          />
          <Tool name="Heading" addItem={this.addItem} />
          <Tool name="Button" addItem={this.addItem} />
        </div>
        <Canvas
          customProp="hello dustbin"
          allowedDropEffect="move"
          tools={this.state.tools}
        />
      </DragDropContextProvider>
    );
  }
}
