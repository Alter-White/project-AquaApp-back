import { model, Schema } from 'mongoose';
import {
  mongooseSaveError,
  updateDailyRateWater,
} from './hooks.js';
import { userGenderList } from '../../constants/index.js';

const usersSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: userGenderList,
      default: 'man'
    },
    weight: {
      type: Number,
      default: 0,
      validate: {
        validator: function(v) {
          return !isNaN(v);
        },
        message: props => `${props.value} is not a valid number!`,
      },
      set: v => parseFloat(parseFloat(v).toFixed(2)),
    },
    sportTime: {
      type: Number,
      default: 0,
      validate: {
        validator: function(v) {
          return !isNaN(v);
        },
        message: props => `${props.value} is not a valid number!`,
      },
      set: v => parseFloat(parseFloat(v).toFixed(2)),
    },
    dailyRateWater: {
      type: Number,
      default: 1.8,
      validate: {
        validator: function(v) {
          return !isNaN(v);
        },
        message: props => `${props.value} is not a valid number!`,
      },
      set: v => parseFloat(parseFloat(v).toFixed(2)),
    },
    avatar: {
      type: String,
      default: 'https://i.pinimg.com/736x/7b/8c/d8/7b8cd8b068e4b9f80b4bcf0928d7d499.jpg',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usersSchema.post('save', mongooseSaveError);

usersSchema.post('findOneAndUpdate', mongooseSaveError);

usersSchema.pre('findOneAndUpdate', updateDailyRateWater);
export const UsersCollection = model('users', usersSchema);
