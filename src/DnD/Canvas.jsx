import * as React from "react";
import { DropTarget } from "react-dnd";
import { ItemTypes } from "./Const";
import FormField from "./FormField";

const style = {
  minHeight: "50px",
  overflow: "auto",
  border: "2px solid lightgrey",
  backgroundColor: "lightgrey"
};

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDropped: false,
      hasDroppedOnChild: false
    };
  }

  render() {
    const {
      tool,
      canDrop,
      isOver,
      allowedDropEffect,
      connectDropTarget
    } = this.props;
    const { hasDropped, hasDroppedOnChild } = this.state;
    const isActive = canDrop && isOver;

    let borderColor = "lightgrey";
    if (isActive) {
      borderColor = "green";
    } else if (canDrop) {
      borderColor = "blue";
    }

    let label = <center>{`${tool.id}: ${tool.items.length}`}</center>;
    let dropHint = (
      <center>
        {isActive ? "Release here." : "Drag here."}
        {hasDropped && " Dropped" + (hasDroppedOnChild ? "on child" : "")}
      </center>
    );

    let fieldsList = tool.items.map((nestedTool, i) => (
      <FormField
        key={nestedTool.id}
        index={i}
        tool={nestedTool}
        moveTool={this.props.moveTool}
      />
    ));

    return connectDropTarget(
      <div style={{ ...style, borderColor }}>
        {label}
        {fieldsList}
        {dropHint}
      </div>
    );
  }
}

/* DnD */

const boxTarget = {
  drop({ tool, allowedDropEffect, greedy }, monitor, component) {
    if (!component) {
      return;
    }
    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild && !greedy) {
      return;
    }
    component.setState({
      hasDropped: true,
      hasDroppedOnChild
    });

    return {
      id: tool.id,
      name: `${allowedDropEffect} Dustbin`,
      allowedDropEffect
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({}),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop()
  };
}

export default DropTarget(ItemTypes.TOOL, boxTarget, collect)(Canvas);
