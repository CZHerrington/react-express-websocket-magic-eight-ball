import React, { Component } from "react";
import axios from "axios";
import styled from 'styled-components';

import EightBall from "./components/EightBall";
import AppHeader from "./components/AppHeader";
import Wrapper from "./components/Wrapper";
import NotificationSystem from "react-notification-system";
import {
	createNotification,
	level,
	position,
	Socket,
	uuidv4
} from "./utilities";

/* styles */
import "bulma/css/bulma.css";
import "./App.css";

const api = async question =>
	await axios.get(
		encodeURI(`https://8ball.delegator.com/magic/JSON/${question}`)
	);

class App extends Component {
	constructor(props) {
		super(props);
		this.notificationSystem = React.createRef();
		this.createNotification = createNotification(this.notificationSystem);
		this.state = {
			loading: false,
			question: "",
			answer: {
				text: "",
				type: null
			},
			users: 0
		};

		/* socket.io configuration */
		this.socket = new Socket(uuidv4());

		/* register socket.io event handlers */
		this.socket.on("user-connected", data => {
			const { users } = data;
			this.setState({ users });
			console.log("[socket.io: event user-connected]", data);
			if (data.uuid !== this.socket.uuid) {
				this.createNotification({
					position: position.top.right,
					level: level.info,
					title: "new user online!",
					message: (<>
							user <strong>{data.uuid}</strong> connected!
          </>)
				});
			}
		});

		this.socket.on("user-update", data => {
			const { users } = data;
			console.log("user-update", users);
			this.setState({ users });
		});

		this.socket.connect();
	}

	componentDidMount() {
		this.registerSocket();
	}

	registerSocket = () => {};

	handleAskQuestion = async question => {
		this.setState({
			loading: true,
			question
		});
		try {
			const res = await api(question);
			const [text, type] = [
				res.data.magic.answer.toLowerCase(),
				res.data.magic.type.toLowerCase()
			];

			this.setState({
				loading: false,
				answer: { text, type }
			});
			this.createNotification({
				level: level.success,
				position: position.top.right,
				message: res.data.magic.answer,
				title: "question answered!"
			});
		} catch (e) {
			this.setState({ loading: false });
			console.error("error!", e);
			this.createNotification({
				level: level.error,
				position: position.top.right,
				title: e.message,
				message: `${e.config.method} request failed!`
			});
		}
	};

	handleClearAnswer = () => {
		this.setState({
			question: "",
			answer: {
				text: "",
				type: null
			}
		});
	};

	render() {
		const { loading, question, answer, users } = this.state;

		const TitleComponent = (
			<Title>
				Welcome to the <strong>Magic Eight Ball</strong>!
			</Title>
		);
		const SubtitleComponent = (
			<Title>
				an app by <a href="https://www.github.com/CZHerrington">CZHerrington</a>
			</Title>
		);
		return (
			<div className="App">
				<NotificationSystem ref={this.notificationSystem} />
				<AppHeader
					title={TitleComponent}
					subtitle={SubtitleComponent}
					color={"blue"}
					size={"medium"}
				/>
				<Wrapper className={"eightball"}>
					<EightBall
						users={users}
						answer={answer}
						question={question}
						loading={loading}
						onNewQuestion={this.handleAskQuestion}
						onClearAnswer={this.handleClearAnswer}
						createNotification={this.createNotification}
					/>
				</Wrapper>
			</div>
		);
	}
}

const Title = styled.span`
	color: white;
`;


export default App;
