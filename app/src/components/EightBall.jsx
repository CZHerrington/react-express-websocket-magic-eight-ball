import React, { useState } from "react";
import {
	Button,
	Icon,
	Field,
	Control,
	Input,
	Help,
	Content,
	Card,
	CardHeader,
	CardFooter,
	CardFooterItem,
	CardContent,
	Image,
	CardHeaderTitle,
	CardHeaderIcon,
	Media,
	MediaContent,
	MediaLeft,
	Title,
	Subtitle
} from "bloomer";
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

	const clearAnswer = () => {
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
			<CardHeader className="header">
				<CardHeaderTitle>magic eight ball</CardHeaderTitle>
				<CardHeaderIcon>
					<Icon className="fa fa-angle-down" />
					{users === 1 ? `${users} user online!` : `${users} users online!`}
				</CardHeaderIcon>
			</CardHeader>
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
								{inputError.error ? inputError.message : ""}
							</Help>
						</Control>
					</Field>
				</Content>
			</CardContent>
			<CardFooter>
				<CardFooterItem tag="div">
					<Field className="controls" isGrouped>
						<Control>
							<Button
								// isOutlined
								onClick={handleQuestionSubmit}
								isLoading={loading}
								isColor="primary"
							>
								Submit
							</Button>
						</Control>
						<Control>
							<Button
								// isOutlined
								isColor="danger"
								onClick={clearAnswer}
							>
								Clear
							</Button>
						</Control>
					</Field>
				</CardFooterItem>
			</CardFooter>
		</Card>
		// </Wrapper>
	);
};

export default EightBall;
