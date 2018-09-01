import React from "react";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";
import { ItemTypes } from "./Const";
import Canvas from "./Canvas";
const style = {
  borderRadius: "2px",
  padding: "4px 12px",
  margin: "8px",
  background: "wheat"
};

class FormField extends React.Component {
  render() {
    const {
      tool,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props;
    const opacity = isDragging ? 0.5 : 1;

    console.log("FormField's tool:", JSON.stringify(this.props.tool));

    let view = (
      <div style={{ ...style, opacity }}>
        {tool.text}
        {tool.text === "Layout" && (
          <Canvas
            allowedDropEffect="move"
            moveTool={this.props.moveTool}
            tool={tool}
          />
        )}
      </div>
    );

    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(connectDropTarget(view))
    );
  }
}

/* DnD */

const cardSource = {
  beginDrag(props) {
    return {
      id: props.tool.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    // const hoverBoundingRect = (findDOMNode(component) as Element).getBoundingClientRect()
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveTool(dragIndex, hoverIndex, props.parent);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

function collectTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const createTarget = DropTarget(ItemTypes.FIELD, cardTarget, collectTarget);
const createSource = DragSource(ItemTypes.FIELD, cardSource, collectSource);

export default createSource(createTarget(FormField));
