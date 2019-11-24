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
    // console.log("[MemDB get]: " + property, this.store);
    return data || null;
  }
  updateConnections() {
    const clients = this.socket.engine.clientsCount;
    this.store.connections = clients;
    // console.log("[MemDB updateConnections]: ", this.socket);
    return clients;
  }
  addUser(userData) {
    const user = {
      ...userData,
      questions: []
    }
    this.store.users[user.uuid] = user;
    this.updateConnections();
    // console.log("[MemDB addUser]: ", this.store);
  }
  addQuestion(data) {
    const { user, question } = data;
    const questions = [...this.store.users[user].questions, question];
    this.store.users[user].questions = questions;
  }
};
