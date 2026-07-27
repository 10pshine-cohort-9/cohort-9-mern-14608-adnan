import { Request, Response, NextFunction } from "express";
import Note from "../models/Note.js";

interface NoteBody {
  title: string;
  content?: string;
}

export const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notes = await Note.find({ user: req.user!.id }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    next(err);
  }
};

export const getNote = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user!.id });
    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

export const createNote = async (
  req: Request<unknown, unknown, NoteBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, user: req.user!.id });
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (
  req: Request<{ id: string }, unknown, Partial<NoteBody>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user!.id });
    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
