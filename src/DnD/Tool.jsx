import * as React from "react";
import { DragSource } from "react-dnd";
import { ItemTypes } from "./Const";

const style = {
  display: "inline-block",
  border: "1px solid gray",
  borderRadius: 5,
  backgroundColor: "white",
  fontSize: "10px",
  padding: "2px 8px",
  margin: "4px 2px"
};

class Tool extends React.Component {
  render() {
    const { isDragging, connectDragSource } = this.props;
    const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(<div style={{ ...style, opacity }}>{name}</div>);
  }
}

/* DnD */

const boxSource = {
  beginDrag(props) {
    return {
      name: props.name
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      let alertMessage = "";
      const isDropAllowed =
        dropResult.allowedDropEffect === "any" ||
        dropResult.allowedDropEffect === dropResult.dropEffect;

      if (isDropAllowed) {
        const isCopyAction = dropResult.dropEffect === "copy";
        const actionName = isCopyAction ? "copied" : "moved";
        alertMessage = `You "${actionName}"  "${item.name}" into "${
          dropResult.name
        }"!`;
        props.addItem && props.addItem(item.name);
      } else {
        alertMessage = `You cannot "${
          dropResult.dropEffect
        }" an item into the "${dropResult.name}"`;
      }

      console.log(alertMessage);
      console.log("dropResult", dropResult, "item", item);
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

export default DragSource(ItemTypes.TOOL, boxSource, collect)(Tool);
