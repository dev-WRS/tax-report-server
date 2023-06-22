import mongoose from 'mongoose';
import { ProjectFileModel, I_ProjectFileDocument } from './project-file.model';

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

export const ExitProjectFileModel = ProjectFileModel.discriminator<I_ExitProjectFileDocument>(
  'ExitProjectFile',
  ExitProjectFileSchema
);

export const getExitProjectFiles = () => ExitProjectFileModel.find();

export const getExitProjectFileById = (id: string) => ExitProjectFileModel.findById(id);

export const getExitProjectFileByName = (name: string) => ExitProjectFileModel.findOne({name});

export const getExitProjectFileByUrl = (url: string) => ExitProjectFileModel.findOne({url});

export const createExitProjectFile = (values: Record<string, any>) => new ExitProjectFileModel(values).save().then((exitProjectFile) => exitProjectFile.toObject());

export const deleteExitProjectFileById = (id: string) => ExitProjectFileModel.findByIdAndDelete({ _id: id});

export const updateExitProjectFileById = (id: string, values: Record<string, any>) => ExitProjectFileModel.findByIdAndUpdate({ _id: id}, values);
