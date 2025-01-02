import mongoose, { Schema, } from 'mongoose'
import { TReport } from './report.interface';


const rerportSchema = new Schema<TReport>({
    reportUser : { type: Schema.Types.ObjectId,  ref: 'User' },
    reviewId:  {
        type :String,
        required : true
    },
    userId:  {
        type :String,
        required : true
    },
    write : {
        type : String,
        required : true
    },
  
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });


const reportModel = mongoose.model<TReport>('Report', rerportSchema);

export default reportModel;
