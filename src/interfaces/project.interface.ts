import { ProjectStatus } from "@models/project/project.model";
import { ColumnsToShow, ConventionType } from "@models/project/assets.model";

export interface I_ProjectToCreate {
    name : string;
    description : string;
    status : ProjectStatus;
    inputFile: string;
    outputFile: string;
    createdBy: string;
    projectAssets: string;
    exitFileConfiguration: ColumnsToShow;
}

export interface I_ProjectFileCreate {
    name: string;
    size: number;
    type: string;
    url: string;
}

export interface I_ExitProjectFileCreate extends I_ProjectFileCreate {
    lastModified: Date;
}

export class I_AssetToCreate {
    description : string;
    ruleTag : string;
    date: string;
    cost: string;
    disposalDate: string;
    minCost: number;
    convention: ConventionType
    exitFileConfiguration: ColumnsToShow;

    constructor(init?: Partial<I_AssetToCreate>) {
        Object.assign(this, init);
        this.description = this.description || '';
        this.ruleTag = this.ruleTag || '';
        this.date = this.date || '';
        this.cost = this.cost || '';
        this.disposalDate = this.disposalDate || '';
        this.minCost = this.minCost || 0;
        this.convention = this.convention || ConventionType.NONE;
        this.exitFileConfiguration = this.exitFileConfiguration || new ColumnsToShow();
    }
}

export function validateProjectToCreate(projectToCreate: I_ProjectToCreate): boolean {
    return projectToCreate.name !== undefined && projectToCreate.name !== '' &&
           projectToCreate.status !== undefined &&
           projectToCreate.inputFile !== undefined && projectToCreate.inputFile !== '' &&
           projectToCreate.projectAssets !== undefined && projectToCreate.projectAssets !== '' &&
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
           exitFileToCreate.url !== undefined && exitFileToCreate.url !== '';
}