import React from "react";

const style = {
  borderRadius: "2px",
  padding: "4px 12px",
  margin: "8px",
  background: "wheat"
};

class FormField extends React.Component {
  render() {
    return <div style={style}>{this.props.tool}</div>;
  }
}

export default FormField;
