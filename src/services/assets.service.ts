import { LeanDocument } from 'mongoose';

import { Asset, ColumnsToShow, ConventionType, I_AssetDocument, getAssetById, 
        updateAssetsById } from '@models/project/assets.model';
import { I_AssetToCreate } from '@interfaces/project.interface';
import { ProjectStatus, getProjectById } from '@models/project/project.model';

export async function getAssetByIdService(assetId: string): Promise<I_AssetDocument> {
    try {
        const asset = await getAssetById(assetId);
        return asset;
    } catch (error) {
        throw error;
    }
}

export async function createAssetService(assetToCreate: I_AssetToCreate): Promise<LeanDocument<I_AssetDocument>> {
    try {
        const newAsset = await Asset.create(assetToCreate);
        return newAsset;
    } catch (error) {
        throw error;
    }
}

export async function updateAssetService(assetId: string, projectId: string = '', fullReload = false, 
                                         assetToUpdate: I_AssetDocument = null, projectName: string = '',
                                         projectDescription: string = ''): Promise<LeanDocument<I_AssetDocument>> {
    try {
        const assetExist = await getAssetById(assetId);

        if (!assetExist) {
            throw new Error('Asset not found');
        }

        assetExist.description = fullReload ? '' : assetToUpdate.description;
        assetExist.ruleTag = fullReload ? '' : assetToUpdate.ruleTag;
        assetExist.date = fullReload ? '' : assetToUpdate.date;
        assetExist.cost = fullReload ? '' : assetToUpdate.cost;
        assetExist.disposalDate = fullReload ? '' : assetToUpdate.disposalDate;
        assetExist.minCost = fullReload ? 0 : assetToUpdate.minCost;
        assetExist.convention = fullReload ? ConventionType.NONE : assetToUpdate.convention;

        if (!fullReload && projectId !== '') {
            assetExist.exitFileConfiguration = assetToUpdate.exitFileConfiguration || new ColumnsToShow();
        } else {
            assetExist.exitFileConfiguration = new ColumnsToShow();
        }

        const updatedAsset = await updateAssetsById(assetId, assetExist);

        if (!fullReload && projectId !== '' && projectName !== '' && projectDescription !== '') {
            const project = await getProjectById(projectId);
            project.status = ProjectStatus.DATA_COLLECTED;
            project.name = projectName;
            project.description = projectDescription;
            await project.save();
        }

        return updatedAsset;   
    } catch (error) {
        throw error;
    }
}