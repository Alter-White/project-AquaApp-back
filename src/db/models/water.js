import { model, Schema } from 'mongoose';
import { updateTime } from '../../utils/updateTime.js';
import { mongooseSaveError } from './hooks.js';

const waterSchema = new Schema(
    {
        date: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v);
                },
                message: props => `${props.value} is not a valid date format! Corect example: 2024-08-03T14:38:24`,
            },
        },
        volume: { type: Number, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true, },
    },
    { timestamps: true, versionKey: false },
);

waterSchema.post('save', mongooseSaveError);

waterSchema.post('findOneAndUpdate', mongooseSaveError);

export const WaterCollection = model('water', waterSchema);
