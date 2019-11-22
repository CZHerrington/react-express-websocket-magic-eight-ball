import React from "react";
import { Container } from "bloomer";
import "./Wrapper.css";

const Wrapper = props => {
	return <Container className={"wrapper"}>{props.children}</Container>;
};

export default Wrapper;
