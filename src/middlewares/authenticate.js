import createHttpError from "http-errors";
import TokensService from "../services/tokens.js"
import {SessionsCollection} from "../db/models/session.js";
import {UsersCollection} from "../db/models/user.js";

export const authenticate = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return next(createHttpError(401, 'Please provide Authorization header'));
    }

    const bearer  = authorizationHeader.split(' ')[0];
    const token = authorizationHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
        return next(createHttpError(401, 'Auth header should be of type Bearer'));
    }

    TokensService.validateAccessToken(token);

    const session = await SessionsCollection.findOne({ accessToken: token });

    if (!session) {
        return next(createHttpError(401, 'Session not found'));
    }

    const isAccessTokenExpired =  new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {

        next(createHttpError(401, 'Access token expired'));
    }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
        return next(createHttpError(401));
    }

    req.user = user;
    next();
}
