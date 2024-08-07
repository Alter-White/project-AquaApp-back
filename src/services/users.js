import {UsersCollection} from "../db/models/user.js";
import createHttpError from "http-errors";
import UserDto from '../dtos/user-dto.js';
import TokensService from "../services/tokens.js";
import jwt from 'jsonwebtoken';
import { SessionsCollection } from '../db/models/session.js';
class UsersService {
  async getUser(email) {
    return UsersCollection.findOne({ email });
  }

  async getUserById(id) {
    return UsersCollection.findById(id);
  }

  async registration(email, password) {

    const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);

    const user = await UsersCollection.create({
      name, email, password
    });

    const userDto = new UserDto(user);

    return {
      user: userDto
    };
  }

  async login(user) {
    const userDto = new UserDto(user);
    const tokens = TokensService.generateToken({...userDto});

    return await TokensService.saveToken(user._id, tokens);
  }

  async refresh(refreshToken, sessionId) {
    const session = await TokensService.findToken(refreshToken, sessionId);

    if(!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }

    const user = await UsersCollection.findOne({ _id: session.userId });

    const userDto = new UserDto(user);
    const tokens = TokensService.generateToken({...userDto});

    await SessionsCollection.deleteOne({_id: sessionId, refreshToken});

    return await TokensService.saveToken(user._id, tokens);
  }

  async logout(sessionId) {
    await TokensService.removeSessionId(sessionId);
  }

  async updateUser(id, data, options = {}) {
    const res = await UsersCollection.findOneAndUpdate(
      {
        _id: id
      },
      data,
      {
        runValidators: true,
        new: true,
        includeResultMetadata: true,
        ...options,
      }
    )

    if (!res || !res.value) return null;

    return {
      user: res.value,
      isNew: Boolean(res?.lastErrorObject?.upserted),
    };

  }

  async getUsersLength() {
    const totalUsersCount = await UsersCollection.countDocuments({});

    const randomAvatars = await UsersCollection.aggregate([
      { $sample: { size: 3 } },
      { $project: { avatar: 1, _id: 0 } }
    ]);

    const avatarUrls = randomAvatars.map(avatarObj => avatarObj.avatar);

    return {
      totalUsersCount,
      randomAvatars: avatarUrls
    };
  }

}

export default new UsersService();