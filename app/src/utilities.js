import io from "socket.io-client";

const socket_url = "/";
const test = window.location;
console.log('window.location: ' + test)

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

export const defaultConfig = {
	message: "default notification",
	level: level.error,
	position: position.top.left
};

export function createNotification(system) {
	return notification => {
		if (defaultConfig === { ...defaultConfig, ...notification }) {
			notification.message +=
				"<br>[ it seems like you're calling <strong>createNotification(<i>notification</i>)</strong> without setting any non-default values! ]";
			console.warning(
				"it seems like you're calling createNotification(notification) without setting any non-default values!"
			);
		}
		system.current.addNotification({ ...defaultConfig, ...notification });
	};
}

// socket.io utilities
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
		this.socket = io.connect(socket_url);
		this.uuid = uuid || uuidv4();
		this.eventRegistry = [];
		console.log("socket.io: initialized!");
	}

	connect() {
		const { uuid, socket } = this;
		const ua = navigator.userAgent;
		socket.emit("user-connected", { uuid, ua });
		this._registerHandlers();
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
