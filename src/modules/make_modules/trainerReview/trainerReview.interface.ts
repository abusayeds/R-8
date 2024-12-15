import { Types } from "mongoose"

export type TTrainerReview = {
    trainerId: Types.ObjectId,
    trainerRate: number,
    diffcultTrainer: number,
    takeClass: boolean,
    freeClass: boolean,
    musicChoice: number,
    tags: Array<'Challenging Workouts' | 'Accessible for All Levels' | 'Great for Beginners' | 'Great Playlist' | 'Pushes Your Limits' | 'Hands-On Adjustments' | 'Advanced Techniques' | 'Great Cues'>;
    writeReview?: string
}
