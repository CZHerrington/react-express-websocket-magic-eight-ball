import React from "react";
import { CardHeader, CardHeaderTitle, CardHeaderIcon } from "bloomer";

const EightBallHeader = ({ users, title }) => (
	<CardHeader className="header">
		<CardHeaderTitle>{title}</CardHeaderTitle>
		<CardHeaderIcon>
			{/* <Icon className="fa fa-angle-down" /> */}
			{users === 1 ? `${users} user online!` : `${users} users online!`}
		</CardHeaderIcon>
	</CardHeader>
);

export default EightBallHeader;
