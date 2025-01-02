import { TTrainer } from "./trainer-interfacer";

export const allowedTags = [
    'Challenging Workouts',
    'Accessible for All Levels',
    'Great for Beginners',
    'Great Playlist',
    'Pushes Your Limits',
    'Hands-On Adjustments',
    'Advanced Techniques',
    'Great Cues',
] as const;
export const TrainerSearchbleField : Array<keyof TTrainer>  = [ "firstName", "lastName" ,"neighborhood" , "studioName"]