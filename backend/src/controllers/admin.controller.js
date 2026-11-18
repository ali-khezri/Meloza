import cloudinary from "../lib/cloudinary.js";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";

async function uploadToCloudinary(file) {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });

    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);

    throw new Error("Error uploading to cloudinary");
  }
}

export async function createSong(req, res, next) {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;

    if (albumId) {
      const album = await Album.findById(albumId);

      if (!album) {
        return res.status(404).json({
          message: "Album not found",
        });
      }
    }

    const audioFile = req.files.audioFile;

    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);

    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res.status(201).json(song);
  } catch (error) {
    console.log("Error is createSong", error);

    next(error);
  }
}

export async function deleteSong(req, res, next) {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
}

export async function createAlbum(req, res, next) {
  try {
    const { title, artist, releaseYear } = req.body;

    if (!title || !artist || !releaseYear) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload file" });
    }

    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({ title, artist, imageUrl, releaseYear });

    await album.save();

    res.status(201).json(album);
  } catch (error) {
    console.log("Error is createAlbum", error);

    next(error);
  }
}

export async function deleteAlbum(req, res, next) {
  try {
    const { id } = req.params;

    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
      });
    }

    await Song.deleteMany({ albumId: id });

    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
}

export async function checkAdmin(req, res, next) {
  res.status(200).json({ admin: true });
}
