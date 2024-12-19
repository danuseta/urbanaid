const store = {
  state: {
    riwayatData: null,
    currentUser: null,
    isLoading: false,
    error: null
  },

  setRiwayatData(data) {
    this.state.riwayatData = data;
  },

  setCurrentUser(user) {
    this.state.currentUser = user;
  },

  setLoading(status) {
    this.state.isLoading = status;
  },

  setError(error) {
    this.state.error = error;
  },

  getRiwayatData() {
    return this.state.riwayatData;
  },

  getCurrentUser() {
    return this.state.currentUser;
  },

  getLoading() {
    return this.state.isLoading;
  },

  getError() {
    return this.state.error;
  },

  findReportById(id) {
    if (!this.state.riwayatData) return null;
    return this.state.riwayatData.find((report) => report.id === id);
  },

  clearState() {
    this.state = {
      riwayatData: null,
      currentUser: null,
      isLoading: false,
      error: null
    };
  }
};

export default store;