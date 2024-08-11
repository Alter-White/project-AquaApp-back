import jwt from 'jsonwebtoken';
import { SessionsCollection } from '../db/models/session.js';
import {FIFTEEN_MINUTES, THIRTY_DAYS} from "../constants/index.js";
import createHttpError from 'http-errors';
class TokensService {
  generateToken(payload) {
    const accessToken  = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
    const refreshToken  = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(id, tokens) {
    return await SessionsCollection.create({
      userId: id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    })
  }

  async removeUserId(userId) {
    return SessionsCollection.deleteOne({userId: userId});
  }

  validateRefreshToken(token) {
    try{
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    }catch (e) {
      throw createHttpError(401, 'Unauthenticated!');
    }
  }

  validateAccessToken(token) {
    try{
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    }catch (e) {
      return null
    }
  }

  async findToken(refreshToken, sessionId) {
    return SessionsCollection.findOne({
      _id: sessionId,
      refreshToken,
    });
  }

  async removeSessionId(sessionId) {
    return SessionsCollection.deleteOne({_id: sessionId});
  }

  generateResetToken(payload) {
    return jwt.sign(payload, process.env.JWT_MAIL_SECRET, {expiresIn: '5m'})
  }

  validateResetToken(token) {
    try{
      return jwt.verify(token, process.env.JWT_MAIL_SECRET);
    }catch (err) {
      if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
      throw err;
    }
  }

}

export default new TokensService();