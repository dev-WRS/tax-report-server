import mongoose from 'mongoose';

export interface I_ProjectFileDocument extends mongoose.Document {
    name : string;
    size : number;
    type : string;
    url : string;
}

const ProjectFileSchema: mongoose.Schema<I_ProjectFileDocument> = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true, unique: true },
});

export const ProjectFileModel = mongoose.model<I_ProjectFileDocument>('ProjectFile', ProjectFileSchema);

export const getProjectFiles = () => ProjectFileModel.find();

export const getProjectFileById = (id: string) => ProjectFileModel.findById(id);

export const getProjectFileByName = (name: string) => ProjectFileModel.findOne({name});

export const getProjectFileByUrl = (url: string) => ProjectFileModel.findOne({url});

export const createProjectFile = (values: Record<string, any>) => new ProjectFileModel(values).save().then((projectFile) => projectFile.toObject());

export const deleteProjectFileById = (id: string) => ProjectFileModel.findByIdAndDelete({ _id: id});

export const updateProjectFileById = (id: string, values: Record<string, any>) => ProjectFileModel.findByIdAndUpdate({ _id: id}, values);
