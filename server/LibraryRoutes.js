const mongoose = require('mongoose');

const LibrarySchema = require('./schemas/Library');
const TrackSchema = require('./schemas/Track');

module.exports = class LibraryRoutes {
  constructor(server) {
    this.onAddToLibrary = this.onAddToLibrary.bind(this);

    this._server = server;

    server._express.post('/add', this.onAddToLibrary);
  }

  async onAddToLibrary(req, res) {
    // @TODO: Handle multiple libraries

    const Library = mongoose.model('Library', LibrarySchema);
    const Track = mongoose.model('Track', TrackSchema);

    // Check if track is already in library
    const tracks = await Library.aggregate([
      { $match: {
        'owner_id': mongoose.mongo.ObjectId(req.body.user_id),
        'tracks.type': req.body.type,
        'tracks.external_id': req.body.id
      } },
      { $unwind: '$tracks' },
      { $project: {
        'type': '$tracks.type',
        'external_id': '$tracks.external_id'
      } }
    ]);

    if (!tracks.length) {
      let library = await this.fetchUserLibrary(req.body.user_id);
      library.tracks.push(new Track({
        type: req.body.type,
        external_id: req.body.id
      }));
      await library.save();

      res.end('Track added');
    }
    else {
      res.end('Track already present in library');
    }
  }

  async fetchUserLibrary(userId) {
    const Library = mongoose.model('Library', LibrarySchema);
    let library = await Library.findOne({ owner_id: userId });

    // Create library if user doesn't have one
    if (library === null) {
      library = await new Library({
        name: 'My Library',
        owner_id: userId
      }).save();
    }

    return library;
  }
}
