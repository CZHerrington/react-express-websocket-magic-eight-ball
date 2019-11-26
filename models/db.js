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
  
  updateConnections() {
    const clients = this.socket.engine.clientsCount;
    this.store.connections = clients;
    // console.log("[MemDB updateConnections]: ", this.socket);
    return clients;
  }

  get(property) {
    const data = this.store[property];
    // console.log("[MemDB get]: " + property, this.store);
    return data || null;
  }

  getUser(id) {
    const users = this.store.users;
    const user = users[id];
    if (!!user) {
      return user;
    }
    return null;
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
    const userStore = this.store.users[user];
    const questions = userStore
      ? [...userStore.questions, question]
      : [question];
    this.store.users[user].questions = questions;
  }
};
