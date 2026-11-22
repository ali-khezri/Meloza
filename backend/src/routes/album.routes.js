import express from "express";
import {
  getAlbumById,
  getAllAlblums,
} from "../controllers/album.controller.js";

const router = express.Router();

router.get("/", getAllAlblums);

router.get("/:albumId", getAlbumById);

export default router;
