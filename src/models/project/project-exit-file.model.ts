import mongoose from 'mongoose';
import { ProjectFile, I_ProjectFileDocument } from './project-file.model';

export interface I_ExitProjectFileDocument extends I_ProjectFileDocument {
  columnsToShow: ColumnsToShow[];
  lastModified: Date;
}

const ColumnsToShowSchema: mongoose.Schema<ColumnsToShow> = new mongoose.Schema({
  columnName: { type: String, required: true },
  isVisible: { type: Boolean, required: true },
});

const ExitProjectFileSchema: mongoose.Schema<I_ExitProjectFileDocument> = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  columnsToShow: { type: [ColumnsToShowSchema], required: true },
  lastModified: { type: Date, required: true },
});

export interface ColumnsToShow {
  columnName: string;
  isVisible: boolean;
}

export const ExitProjectFile = ProjectFile.discriminator<I_ExitProjectFileDocument>(
  'ExitProjectFile',
  ExitProjectFileSchema
);

export const getExitProjectFiles = () => ExitProjectFile.find();

export const getExitProjectFileById = (id: string) => ExitProjectFile.findById(id);

export const getExitProjectFileByName = (name: string) => ExitProjectFile.findOne({name});

export const getExitProjectFileByUrl = (url: string) => ExitProjectFile.findOne({url});

export const createExitProjectFile = (values: Record<string, any>) => new ExitProjectFile(values).save().then((exitProjectFile) => exitProjectFile.toObject());

export const deleteExitProjectFileById = (id: string) => ExitProjectFile.findByIdAndDelete({ _id: id});

export const updateExitProjectFileById = (id: string, values: Record<string, any>) => ExitProjectFile.findByIdAndUpdate({ _id: id}, values);
