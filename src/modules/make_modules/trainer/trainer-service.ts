/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status"
import queryBuilder from "../../../builder/queryBuilder"
import AppError from "../../../errors/AppError"
import studioModel from "../studio/studio-model"
import { TTrainer } from "./trainer-interfacer"
import { trainerModel } from "./trainer-model"
import { TrainerSearchbleField } from "./traner-constant"


const createTrainerDB = async (payload: TTrainer,) => {
    const studio = await studioModel.findById(payload.studioId)
    if (!studio) {
        throw new AppError(httpStatus.NOT_FOUND, 'Studio Not found ')
    }
    const result = await trainerModel.create({
        ...payload,
        studioName: studio?.studioName
    })
    return result
}

const getTrainerDB = async (id: string) => {
    const result = await trainerModel.findById(id);

    return result
};
const getTrainersDB = async (query: Record<string, unknown>) => {
    const trainerQuery = new queryBuilder(trainerModel.find({isApprove:true}), query)
        .search(TrainerSearchbleField)
    const result = await trainerQuery.modelQuery
    return result;
};


export const trainerService = {
    createTrainerDB,
    getTrainerDB,
    getTrainersDB
}