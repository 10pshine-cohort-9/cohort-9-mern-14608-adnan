import express from "express";
import { body } from "express-validator";
import protect from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getNotes)
  .post(
    [body("title").trim().notEmpty().withMessage("Title is required")],
    validate,
    createNote
  );

router
  .route("/:id")
  .get(getNote)
  .put(
    [body("title").optional().trim().notEmpty().withMessage("Title cannot be empty")],
    validate,
    updateNote
  )
  .delete(deleteNote);

export default router;
