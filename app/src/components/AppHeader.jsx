import React from "react";
import {
	Hero,
	HeroBody,
	Container,
	Title,
	Subtitle,
	HeroFooter
} from "bloomer";

 /* styles */
import "./AppHeader.css";

const AppHeader = ({ children, title, subtitle, color, size }) => {
	const isSize = size ? size : "medium";
	return (
		<Hero className="app-header" id="app-header" isSize={isSize}>
			<HeroBody>
				<Container hasTextAlign="centered">
					<Title>{title}</Title>
					<Subtitle>{subtitle}</Subtitle>
				</Container>
			</HeroBody>
			<HeroFooter>{children}</HeroFooter>
		</Hero>
	);
};

export default AppHeader;
