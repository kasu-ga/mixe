import {
  Database,
  type UserData,
  type SessionData,
  type CodeData,
} from "mixejs";
import { Collection, Filter, OptionalUnlessRequiredId } from "mongodb";

export class MongoDbAdapter extends Database {
  constructor(models: {
    user: Collection<UserData>;
    session: Collection<SessionData>;
    code: Collection<CodeData>;
  }) {
    super({
      findUserByUsername: async (username) => {
        try {
          const res = await models.user.findOne({
            username,
          } as Filter<UserData>);
          return (res as UserData) ?? null;
        } catch (error) {
          return null;
        }
      },
      findUserByEmail: async (email) => {
        try {
          const res = await models.user.findOne({
            email,
          } as Filter<UserData>);
          return (res as UserData) ?? null;
        } catch (error) {
          return null;
        }
      },
      findUserByEmailOrUsername: async ({ email, username }) => {
        try {
          const res = await models.user.findOne({
            $or: [{ email }, { username }],
          } as Filter<UserData>);
          return (res as UserData) ?? null;
        } catch (error) {
          return null;
        }
      },
      createUser: async ({ id, ...data }) => {
        const res = await models.user.insertOne(
          data as OptionalUnlessRequiredId<UserData>
        );
        return {
          ...data,
          id: res.insertedId.toString(),
        } as UserData;
      },
      createCode: async (data) => {
        const res = await models.code.insertOne(
          data as OptionalUnlessRequiredId<CodeData>
        );
        return {
          ...data,
          id: res.insertedId.toString(),
        };
      },
      findSessionCodes: async (sessionId, action) => {
        const res = await models.code.find({ sessionId, action }).toArray();
        return res.map((r) => r as CodeData);
      },
      deleteCode: async (id) => {
        await models.code.findOneAndDelete({ id });
      },
      deleteAllCodes: async (sessionId) => {
        await models.code.deleteMany({ sessionId });
      },
      createSession: async (data) => {
        const res = await models.session.insertOne(
          data as OptionalUnlessRequiredId<SessionData>
        );
        return {
          ...data,
          id: res.insertedId.toString(),
        };
      },
      updateSession: async (id, data) => {
        await models.session.findOneAndUpdate({ id }, data);
      },
      findUserById: async (id) => {
        return (await models.user.findOne({
          id,
        } as Filter<UserData>)) as UserData | null;
      },
      findSessionById: async (id) => {
        return (await models.session.findOne({
          id,
        } as Filter<SessionData>)) as SessionData | null;
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
