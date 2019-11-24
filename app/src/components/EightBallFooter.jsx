import React from "react";
import {
	Button,
	Field,
	Control,
    CardFooter,
	CardFooterItem
} from "bloomer";

const EightBallFooter = ({
	handleQuestionSubmit,
	handleClearAnswer,
	loading
}) => (
	<CardFooter>
		<CardFooterItem tag="div">
			<Field className="controls" isGrouped>
				<Control>
					<Button
						isOutlined
						onClick={handleQuestionSubmit}
						isLoading={loading}
						isColor="primary"
					>
						Submit
					</Button>
				</Control>
				<Control>
					<Button isOutlined isColor="danger" onClick={handleClearAnswer}>
						Clear
					</Button>
				</Control>
			</Field>
		</CardFooterItem>
	</CardFooter>
);

export default EightBallFooter;