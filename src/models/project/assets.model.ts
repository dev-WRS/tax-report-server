import mongoose from 'mongoose';

export interface I_AssetDocument extends mongoose.Document {
    description : string;
    ruleTag : string;
    date: string;
    cost: string;
    disposalDate: string;
    minCost: number;
    convention: ConventionType;
    exitFileConfiguration: ColumnsToShow;
}

export enum ConventionType {
    NONE= 'NONE',
    GDS = 'GDS',
    ADS = 'ADS',
}

export class ColumnsToShow {
    exitDate: boolean;
    exitAssets: boolean;
    exitBasis: boolean;
    exitMethod: boolean;
    exitPeriod: boolean;
    exitPriorDep: boolean;
    exitCurrentDep: boolean;
    exitDisposalDate: boolean;
    exitDisposalDep: boolean;
    exitBookValue: boolean;

    constructor(init?: any) {
        Object.assign(this, init);
        this.exitDate = this.exitDate || false;
        this.exitAssets = this.exitAssets || false;
        this.exitBasis = this.exitBasis || false;
        this.exitMethod = this.exitMethod || false;
        this.exitPeriod = this.exitPeriod || false;
        this.exitPriorDep = this.exitPriorDep || false;
        this.exitCurrentDep = this.exitCurrentDep || false;
        this.exitDisposalDate = this.exitDisposalDate || false;
        this.exitDisposalDep = this.exitDisposalDep || false;
        this.exitBookValue = this.exitBookValue || false;
    }
}

const ColumnsToShowSchema = new mongoose.Schema({
    exitDate: { type: Boolean, default: false },
    exitAssets: { type: Boolean, default: false },
    exitBasis: { type: Boolean, default: false },
    exitMethod: { type: Boolean, default: false },
    exitPeriod: { type: Boolean, default: false },
    exitPriorDep: { type: Boolean, default: false },
    exitCurrentDep: { type: Boolean, default: false },
    exitDisposalDate: { type: Boolean, default: false },
    exitDisposalDep: { type: Boolean, default: false },
    exitBookValue: { type: Boolean, default: false },
  });

const AssetSchema: mongoose.Schema<I_AssetDocument> = new mongoose.Schema({
    description: { type: String},
    ruleTag: { type: String},
    date: { type: String },
    cost: { type: String },
    disposalDate: { type: String },
    minCost: { type: Number },
    convention: { type: String, enum: ConventionType, default: 'NONE' },
    exitFileConfiguration: { type: ColumnsToShowSchema, default: new ColumnsToShow() }
});

export const Asset = mongoose.model<I_AssetDocument>('Asset', AssetSchema);

export const getAssets = () => Asset.find();

export const getAssetById = (id: string) => Asset.findById(id);

export const createAsset = (values: Record<string, any>) => new Asset(values).save().then((asset) => asset.toObject());

export const deleteAssetsById = (id: string) => Asset.findByIdAndDelete({ _id: id});

export const updateAssetsById = (id: string, values: Record<string, any>) => Asset.findByIdAndUpdate({ _id: id}, values);