/* @flow */
import React, { Component } from "react";
import type { Node } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { purple } from "../style/color";

// -- types ----------------------------------------------------------------- //
type Props = {
  color?: string,
  children: Node
};

// -- styling --------------------------------------------------------------- //
const SView = styled(View)`
  height: 100%;
  background-color: ${props => props.color};
`;

class Background extends Component<Props> {
  // -- default props ------------------------------------------------------- //
  static defaultProps = {
    color: purple
  };

  // -- render -------------------------------------------------------------- //
  render() {
    const { children, color } = this.props;
    return <SView color={color}>{children}</SView>;
  }
}

export default Background;
