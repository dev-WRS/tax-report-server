import { ColumnsToShow } from "../models/project/project-exit-file.model";

export interface I_ProjectToCreate {
    name : string;
    description : string;
    status : ProjectStatus;
    inputFile: string;
    outputFile: string;
    createdBy: string;
}

export interface I_ProjectFileCreate {
    name: string;
    size: number;
    type: string;
    url: string;
}

export interface I_ExitProjectFileCreate extends I_ProjectFileCreate {
    columnsToShow: ColumnsToShow[];
    lastModified: Date;
}

export function validateProjectToCreate(projectToCreate: I_ProjectToCreate): boolean {
    return projectToCreate.name !== undefined && projectToCreate.name !== '' &&
           projectToCreate.status !== undefined &&
           projectToCreate.inputFile !== undefined && projectToCreate.inputFile !== '' &&
           projectToCreate.createdBy !== undefined && projectToCreate.createdBy !== '';
}

export function validateProjectFileToCreate(fileToCreate: I_ProjectFileCreate): boolean {
    return fileToCreate.name !== undefined && fileToCreate.name !== '' &&
           fileToCreate.size !== undefined &&
           fileToCreate.type !== undefined && fileToCreate.type !== '' &&
           fileToCreate.url !== undefined && fileToCreate.url !== '';
}

export function validateExistProjectFileToCreate(exitFileToCreate: I_ExitProjectFileCreate): boolean {
    return exitFileToCreate.name !== undefined && exitFileToCreate.name !== '' &&
           exitFileToCreate.size !== undefined &&
           exitFileToCreate.type !== undefined && exitFileToCreate.type !== '' &&
           exitFileToCreate.url !== undefined && exitFileToCreate.url !== '' &&
           exitFileToCreate.columnsToShow !== undefined && exitFileToCreate.columnsToShow.length > 0;
}

export enum ProjectStatus {
    STARTED = 'started',
    DATA_COLLECTED = 'data-collected',
    PROCESSING = 'processing',
    FINISHED = 'finished',
    ERROR = 'error',
}