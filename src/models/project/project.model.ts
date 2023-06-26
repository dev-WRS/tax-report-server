import mongoose from 'mongoose';
import { ProjectFile } from './project-file.model';
import { ExitProjectFile } from './project-exit-file.model';

export interface I_ProjectDocument extends mongoose.Document {
    name : string;
    description : string;
    status : 'started' | 'data-collected' | 'processing' | 'finished' | 'error'
    inputFile: typeof  ProjectFile;
    outputFile: typeof ExitProjectFile;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}

const ProjectSchema: mongoose.Schema<I_ProjectDocument> = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['started', 'data-collected', 'processing', 'finished', 'error'], default: 'started' },
    inputFile: { type: mongoose.Types.ObjectId, ref: 'ProjectFile' },
    outputFile: { type: mongoose.Types.ObjectId, ref: 'ExitProjectFile' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'UserModel' },
});

export const ProjectModel = mongoose.model<I_ProjectDocument>('Project', ProjectSchema);

export const getProjects = () => ProjectModel.find();

export const getProjectById = (id: string) => ProjectModel.findById(id);

export const getProjectByName = (name: string) => ProjectModel.findOne({name});

export const createProject = (values: Record<string, any>) => new ProjectModel(values).save().then((project) => project.toObject());

export const deleteProjectById = (id: string) => ProjectModel.findByIdAndDelete({ _id: id});

export const updateProjectById = (id: string, values: Record<string, any>) => ProjectModel.findByIdAndUpdate({ _id: id}, values);
