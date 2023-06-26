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

export const ProjectFile = mongoose.model<I_ProjectFileDocument>('ProjectFile', ProjectFileSchema);

export const getProjectFiles = () => ProjectFile.find();

export const getProjectFileById = (id: string) => ProjectFile.findById(id);

export const getProjectFileByName = (name: string) => ProjectFile.findOne({name});

export const getProjectFileByUrl = (url: string) => ProjectFile.findOne({url});

export const createProjectFile = (values: Record<string, any>) => new ProjectFile(values).save().then((projectFile) => projectFile.toObject());

export const deleteProjectFileById = (id: string) => ProjectFile.findByIdAndDelete({ _id: id});

export const updateProjectFileById = (id: string, values: Record<string, any>) => ProjectFile.findByIdAndUpdate({ _id: id}, values);
