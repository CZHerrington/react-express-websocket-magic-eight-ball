const defaultUser = {
  name: "example",
  uuid: "0000-0000-0000-0000-0000",
  ua: "webkit"
};

module.exports = class MemDB {
  constructor(socket) {
    this.store = { users: {}, connections: null };
    this.socket = socket;
    this.updateConnections();
  }

  get(property) {
    const data = this.store[property];
    console.log("[MemDB get]: " + property, this.store);
    return data || null;
  }
  updateConnections() {
    const clients = this.socket.conn.server.clientsCount;
    this.store.connections = clients;
    console.log("[MemDB updateConnections]: ", this.store);
    return clients;
  }
  addUser(user) {
    this.store.users[user.uuid] = { ...defaultUser, ...user };
    this.updateConnections();
    console.log("[MemDB addUser]: ", this.store);
  }
};
