const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylistSong(playlistIdOwner) {
    const query = {
      text: `SELECT ps."playlistId", p.name, s.id, s.title, s.performer
      FROM playlists p 
      INNER JOIN playlist_songs ps ON ps."playlistId" = p.id
      INNER JOIN songs s ON s.id = ps."songId"
      WHERE ps."playlistId" = $1`,
      values: [playlistIdOwner],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) return [];

    const { playlistId, name } = result.rows[0];
    const songs = result.rows.map(({ id, title, performer }) => ({ id, title, performer }));

    return {
      playlist: {
        id: playlistId,
        name,
        songs,
      },
    };
  }
}

module.exports = PlaylistsService;
