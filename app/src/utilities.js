import io from "socket.io-client";
import React from "react";

const URL = {
	PROD: "/",
	DEV: "localhost:8000"
};

const DEV = (window.location.hostname === "localhost");
const socket_url = (DEV) ? URL.DEV : URL.PROD;

// notification system utilities
export const level = {
	info: "info",
	success: "success",
	warning: "warning",
	error: "error"
};

export const position = {
	top: {
		right: "tr",
		center: "tc",
		left: "tl"
	},
	bottom: {
		right: "br",
		center: "bc",
		left: "bl"
	}
};

const warning = {
	string:
		"it seems like you're calling createNotification(notification) without setting any non-default values!",
	html: (
		<>
			<br />
			it seems like you're calling <strong>createNotification(</strong>
			<i>notification</i>
			<strong>)</strong> without setting any non-default values!
		</>
	)
};

export const defaultConfig = {
	message: warning.html,
	title: warning.string,
	level: level.info,
	position: position.top.right,
	autoDismiss: 0
};

export function createNotification(system) {
	return notification => {
		system.current.addNotification({ ...defaultConfig, ...notification });
	};
}

// socket.io utilities
export const events = {
	question: "question",
	connected: "user:connected",
	updated: "user:update"
};

export const uuidv4 = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		var r = (Math.random() * 16) | 0,
			v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export class Socket {
	constructor(uuid) {
		console.log("socket.io: initializing...");
		if (DEV) console.info("YOU ARE USING THE DEV socket_url VALUE!");
		this.socket = io.connect(socket_url);
		this.uuid = uuid || uuidv4();
		this.eventRegistry = [];
		console.log("socket.io: initialized!");
	}

	connect() {
		const { uuid, socket } = this;
		const useragent = navigator.userAgent;
		socket.emit(events.connected, { uuid, useragent });
		this._registerHandlers();
	}

	emit(event, data) {
		const { socket } = this;
		socket.emit(event, { ...data });
	}

	on(identifier, handler) {
		this.eventRegistry.push({ identifier, handler });
		console.log("[socket.io: registered event handler]", identifier);
	}

	_registerHandlers() {
		const { eventRegistry, socket } = this;
		for (let event in eventRegistry) {
			socket.on(eventRegistry[event].identifier, data => {
				eventRegistry[event].handler(data);
			});
		}
	}
}
