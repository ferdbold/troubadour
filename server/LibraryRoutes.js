module.exports = class LibraryRoutes {
  constructor(server) {
    this.onAddToLibrary = this.onAddToLibrary.bind(this);

    this._server = server;

    server._express.post('/add', this.onAddToLibrary);
  }

  onAddToLibrary(req, res) {
    // TODO: Implement this

    res.end('OK');
  }
}
