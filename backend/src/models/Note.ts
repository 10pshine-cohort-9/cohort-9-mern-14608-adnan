import mongoose, { Schema, Model, HydratedDocument, Types } from "mongoose";

export interface INote {
  title: string;
  content: string;
  user: Types.ObjectId;
}

type NoteModel = Model<INote>;

export type NoteDocument = HydratedDocument<INote>;

const noteSchema = new Schema<INote, NoteModel>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote, NoteModel>("Note", noteSchema);
export default Note;
