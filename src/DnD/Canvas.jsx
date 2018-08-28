import * as React from "react";
import { DropTarget } from "react-dnd";
import { ItemTypes } from "./Const";
import FormField from "./FormField";

const style = {
  height: "200px",
  overflow: "auto",
  border: "2px solid lightgrey",
  backgroundColor: "lightgrey"
};

class Canvas extends React.Component {
  render() {
    const {
      canDrop,
      isOver,
      allowedDropEffect,
      connectDropTarget
    } = this.props;
    const isActive = canDrop && isOver;

    let borderColor = "lightgrey";
    if (isActive) {
      borderColor = "green";
    } else if (canDrop) {
      borderColor = "blue";
    }

    let dropHint = <center>{isActive ? "Release here" : "Drag here"}</center>;

    let listView;
    if (this.props.tools.length)
      listView = this.props.tools.map((tool, i) => (
        <FormField
          key={tool.id}
          index={i}
          tool={tool}
          moveTool={this.props.moveTool}
        />
      ));

    return connectDropTarget(
      <div style={{ ...style, borderColor }}>
        {listView}
        {dropHint}
      </div>
    );
  }
}

/* DnD */

const boxTarget = {
  drop({ allowedDropEffect }) {
    return {
      name: `${allowedDropEffect} Dustbin`,
      allowedDropEffect
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

export default DropTarget(ItemTypes.TOOL, boxTarget, collect)(Canvas);
