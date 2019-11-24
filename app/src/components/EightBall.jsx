import React, { useState } from "react";
import {
	Field,
	Control,
	Input,
	Help,
	Content,
	Card,
	CardContent,
	Image,
	Media,
	MediaContent,
	MediaLeft,
	Title,
	Subtitle
} from "bloomer";
import EightBallHeader from "./EightBallHeader";
import EightBallFooter from "./EightBallFooter";
import { level, position } from "../utilities";

import "./EightBall.css";

const EightBall = ({
	question,
	users,
	answer,
	loading,
	onNewQuestion,
	onClearAnswer,
	createNotification
}) => {
	const [questionValue, setQuestionValue] = useState("");
	const [inputError, setInputError] = useState({ error: false, message: "" });

	const handleInputChange = e => {
		const input = e.target.value;
		const { error } = inputError;
		setQuestionValue(input);
		if (input !== "" && error) {
			setInputError({ error: false, message: "" });
		}
	};

	const handleQuestionSubmit = () => {
		if (!inputError.error && questionValue) {
			onNewQuestion(questionValue);
		} else {
			setInputError({ error: true, message: "question can't be empty!" });
			createNotification({
				level: level.warning,
				position: position.top.right,
				message: "input can't be empty",
				title: "error!"
			});
		}
	};

	const handleClearAnswer = () => {
		onClearAnswer();
		setQuestionValue("");
		setInputError({ error: false, message: "" });
	};

	// import this from a shared library instead of inlining
	const titleStyle = {
		contrary: { color: "#f14668" },
		affirmative: { color: "#00d1b2" },
		neutral: { color: "white" }
	};

	return (
		<Card>
			<EightBallHeader users={users} title="magic eight ball" />
			<CardContent>
				<Media>
					<MediaLeft
						className={loading ? "eightball-icon--spin" : "eightball-icon"}
					>
						<Image isSize="48x48" src="./eightball.svg" />
					</MediaLeft>
					<MediaContent>
						<Title style={titleStyle[answer.type]} isSize={4}>
							{answer.type}
						</Title>
						<Subtitle isSize={6}>{answer.text}</Subtitle>
					</MediaContent>
				</Media>
				<Content>
					<Field>
						{/* <Label>Question</Label> */}
						<Control>
							<Input
								className={"question"}
								isColor={inputError.error ? "danger" : ""}
								type="text"
								placeholder="Enter your question"
								onChange={handleInputChange}
								value={questionValue}
							/>
							<Help isColor="danger">
								{inputError.message}
							</Help>
						</Control>
					</Field>
				</Content>
			</CardContent>
			<EightBallFooter
				handleClearAnswer={handleClearAnswer}
				handleQuestionSubmit={handleQuestionSubmit}
				loading={loading}
			/>
		</Card>
		// </Wrapper>
	);
};

export default EightBall;
