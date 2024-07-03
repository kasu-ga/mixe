import { and, eq, or, SQL } from "drizzle-orm";
import type {
  SQLiteColumn as Column,
  SQLiteTableWithColumns as TableWithColumns,
  BaseSQLiteDatabase as BaseDatabase,
} from "drizzle-orm/sqlite-core";
import { CodeData, Database, UserData } from "mixejs";

export class DrizzleSQLiteAdapter extends Database {
  constructor(
    db: BaseDatabase<any, any, any, any>,
    tables: {
      user: SQLiteUserTable;
      session: SQLiteSessionTable;
      code: SQLiteCodeTable;
    }
  ) {
    super({
      findUserByUsername: async (username) => {
        const res = await db
          .select()
          .from(tables.user)
          .where(eq(tables.user.username, username));
        return (res[0] as UserData) ?? null;
      },
      findUserByEmail: async (email) => {
        const res = await db
          .select()
          .from(tables.user)
          .where(eq(tables.user.email, email));
        return (res[0] as UserData) ?? null;
      },
      findUserByEmailOrUsername: async ({ email, username }) => {
        const where = [];
        if (email) where.push(eq(tables.user.email, email));
        if (username) where.push(eq(tables.user.username, username));
        const queryWhere = where.length > 1 ? or(...where) : where[0];
        const res = await db.select().from(tables.user).where(queryWhere);
        return (res[0] as UserData) ?? null;
      },
      createUser: async (data) => {
        await db.insert(tables.user).values(data);
        return data;
      },
      createCode: async (data) => {
        await db.insert(tables.code).values(data as any);
        return data;
      },
      findSessionCodes: async (sessionId, action) => {
        const res = await db
          .select()
          .from(tables.code)
          .where(
            and(
              eq(tables.code.sessionId, sessionId),
              eq(tables.code.action, action)
            )
          );
        return res.map((r) => r as CodeData);
      },
      deleteCode: async (id) => {
        await db.delete(tables.code).where(eq(tables.code.id, id));
      },
      deleteAllCodes: async (sessionId) => {
        await db
          .delete(tables.code)
          .where(and(eq(tables.code.sessionId, sessionId)));
      },
      createSession: async (data) => {
        const { restricted, limited } = data;
        await db.insert(tables.session).values({
          ...data,
          restricted: restricted ? 1 : 0,
          limited: limited ? 1 : 0,
        });
        return data;
      },
      updateSession: async (id, data) => {
        const { restricted, limited, ...resData } = data;
        const newData: {
          id?: string | SQL<unknown> | undefined;
          expiresAt?: number | SQL<unknown> | undefined;
          userId?: string | SQL<unknown> | undefined;
          restricted?: number | SQL<unknown> | undefined;
          limited?: number | SQL<unknown> | undefined;
        } = {
          ...resData,
        };
        if ("restricted" in data) {
          newData.restricted = restricted ? 1 : 0;
          newData.limited = limited ? 1 : 0;
        }
        await db
          .update(tables.session)
          .set(newData)
          .where(eq(tables.session.id, id));
      },
      findUserById: async (id) => {
        const res = await db
          .select()
          .from(tables.user)
          .where(eq(tables.user.id, id));
        return (res[0] as UserData) ?? null;
      },
      findSessionById: async (id) => {
        const res = await db
          .select()
          .from(tables.session)
          .where(eq(tables.session.id, id));
        return res[0]
          ? {
              ...res[0],
              restricted: res[0].restricted === 1 ? true : false,
              limited: res[0].limited === 1 ? true : false,
            }
          : null;
      },
      deleteSession: async (id) => {
        await db.delete(tables.session).where(eq(tables.session.id, id));
      },
      deleteAllSessions: async (userId) => {
        await db
          .delete(tables.session)
          .where(eq(tables.session.userId, userId));
      },
    });
  }
}

export type SQLiteSessionTable = TableWithColumns<{
  dialect: any;
  columns: {
    id: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: string;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    expiresAt: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: number;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    userId: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: string;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    restricted: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: number;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    limited: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: number;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
  };
  schema: any;
  name: any;
}>;

export type SQLiteCodeTable = TableWithColumns<{
  dialect: any;
  columns: {
    id: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: string;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    expiresAt: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: number;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    sessionId: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: string;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    action: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: string;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    value: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: string;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
  };
  schema: any;
  name: any;
}>;

export type SQLiteUserTable = TableWithColumns<{
  dialect: any;
  name: any;
  schema: any;
  columns: {
    id: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: any;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    username: Column<
      {
        name: any;
        tableName: any;
        dataType: "string";
        columnType: "SQLiteText";
        data: string;
        driverParam: any;
        notNull: boolean;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    email: Column<
      {
        name: any;
        tableName: any;
        dataType: "string";
        columnType: "SQLiteText";
        data: string;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
    password: Column<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: any;
        driverParam: any;
        notNull: true;
        hasDefault: any;
        enumValues: any;
        baseColumn: any;
      },
      object
    >;
  };
}>;
