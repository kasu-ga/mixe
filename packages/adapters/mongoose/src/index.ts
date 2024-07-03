import {
  Database,
  type UserData,
  type SessionData,
  type CodeData,
} from "mixejs";
import { Model } from "mongoose";

export class MongooseAdapter extends Database {
  constructor(models: {
    user: Model<UserData>;
    session: Model<SessionData>;
    code: Model<CodeData>;
  }) {
    super({
      findUserByUsername: async (username) => {
        try {
          const res = await models.user.findOne({
            username,
          });
          return (res as UserData) ?? null;
        } catch (error) {
          return null;
        }
      },
      findUserByEmail: async (email) => {
        try {
          const res = await models.user.findOne({
            email,
          });
          return (res as UserData) ?? null;
        } catch (error) {
          return null;
        }
      },
      findUserByEmailOrUsername: async ({ email, username }) => {
        try {
          const res = await models.user.findOne({
            $or: [{ email }, { username }],
          });
          return (res as UserData) ?? null;
        } catch (error) {
          return null;
        }
      },
      createUser: async ({ id, ...data }) => {
        const res = await models.user.create(data);
        return res;
      },
      createCode: async (data) => {
        const res = await models.code.create(data);
        return res;
      },
      findSessionCodes: async (sessionId, action) => {
        const res = await models.code.find({ sessionId, action });
        return res.map((r) => r as CodeData);
      },
      deleteCode: async (id) => {
        await models.code.findOneAndDelete({ id });
      },
      deleteAllCodes: async (sessionId) => {
        await models.code.deleteMany({ sessionId });
      },
      createSession: async (data) => {
        const res = await models.session.create(data);
        return res;
      },
      updateSession: async (id, data) => {
        await models.session.findOneAndUpdate({ id }, data);
      },
      findUserById: async (id) => {
        return (await models.user.findOne({
          id,
        })) as UserData | null;
      },
      findSessionById: async (id) => {
        return (await models.session.findOne({
          id,
        })) as SessionData | null;
      },
      deleteSession: async (id) => {
        await models.code.findOneAndDelete({ id });
      },
      deleteAllSessions: async (sessionId) => {
        await models.code.deleteMany({ sessionId });
      },
    });
  }
}
