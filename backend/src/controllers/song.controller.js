import { Song } from "../models/song.model.js";

export async function getAllSongs(req, res, next) {
  try {
    const songs = Song.find().sort({ createdAt: -1 }); // -1 ==> Descending

    res.json(songs);
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedSongs(req, res, next) {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 6 } },
      { $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
}

export async function getMadeForYouSongs(req, res, next) {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
}

export async function getTrendingSongs(req, res, next) {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
}
