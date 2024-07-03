import {
  Database,
  type UserData,
  type SessionData,
  type CodeData,
} from "mixejs";

type PrismaWhere<Schema extends {}> = {
  [K in keyof Schema]?:
    | Schema[K]
    | {
        lte?: Schema[K];
      };
} & {
  OR?: PrismaWhere<Schema>[];
};

interface PrismaModel<Schema extends {}> {
  name: string;
  findUnique: <_Included = {}>(options: {
    where: PrismaWhere<Schema>;
    include?: Record<string, boolean>;
  }) => Promise<null | (Schema & _Included)>;
  findMany: (options?: { where: PrismaWhere<Schema> }) => Promise<Schema[]>;
  create: (options: { data: Schema }) => Promise<Schema>;
  delete: (options: { where: PrismaWhere<Schema> }) => Promise<void>;
  deleteMany: (options?: { where: PrismaWhere<Schema> }) => Promise<void>;
  update: (options: {
    data: Partial<Schema>;
    where: PrismaWhere<Schema>;
  }) => Promise<Schema>;
}

export class PrismaAdapter extends Database {
  constructor(models: {
    user: PrismaModel<UserData>;
    session: PrismaModel<SessionData>;
    code: PrismaModel<CodeData>;
  }) {
    super({
      findUserByUsername: async (username) => {
        try {
          const res = await models.user.findUnique({
            where: {
              username,
            } as PrismaWhere<UserData>,
          });
          return (res as UserData) ?? null;
        } catch (error) {
          return null;
        }
      },
      findUserByEmail: async (email) => {
        try {
          const res = await models.user.findUnique({
            where: {
              email,
            } as PrismaWhere<UserData>,
          });
          return (res as UserData) ?? null;
        } catch (error) {
          return null;
        }
      },
      findUserByEmailOrUsername: async ({ email, username }) => {
        try {
          const res = await models.user.findUnique({
            where: {
              OR: [{ email }, { username }],
            } as PrismaWhere<UserData>,
          });
          return (res as UserData) ?? null;
        } catch (error) {
          return null;
        }
      },
      createUser: async (data) => {
        const res = await models.user.create({ data });
        return res;
      },
      createCode: async (data) => {
        const res = await models.code.create({ data });
        return res;
      },
      findSessionCodes: async (sessionId, action) => {
        const res = await models.code.findMany({
          where: {
            sessionId,
            action,
          },
        });
        return res.map((r) => r as CodeData);
      },
      deleteCode: async (id) => {
        await models.code.delete({ where: { id } });
      },
      deleteAllCodes: async (sessionId) => {
        await models.code.deleteMany({ where: { sessionId } });
      },
      createSession: async (data) => {
        const res = await models.session.create({ data });
        return res;
      },
      updateSession: async (id, data) => {
        await models.session.update({ where: { id }, data });
      },
      findUserById: async (id) => {
        return await models.user.findUnique({
          where: { id } as PrismaWhere<UserData>,
        });
      },
      findSessionById: async (id) => {
        return (await models.session.findUnique({
          where: { id },
        })) as SessionData | null;
      },
      deleteSession: async (id) => {
        await models.code.delete({ where: { id } });
      },
      deleteAllSessions: async (sessionId) => {
        await models.code.deleteMany({ where: { sessionId } });
      },
    });
  }
}
