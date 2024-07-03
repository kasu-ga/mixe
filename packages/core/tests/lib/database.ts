import { CodeData, UserData, SessionData, Database } from "../../src";

export let codes: CodeData[] = [];
export let sessions: SessionData[] = [];
export let users: UserData[] = [];

export const db = new Database({
  createCode: async (data) => {
    codes.push(data);
    return data;
  },
  createSession: async (data) => {
    sessions.push(data);
    return data;
  },
  createUser: async (data) => {
    users.push(data);
    return data;
  },
  deleteAllCodes: async (sessionId) => {
    codes = codes.filter((code) => code.sessionId !== sessionId);
  },
  deleteAllSessions: async (userId) => {
    sessions = sessions.filter((session) => session.userId !== userId);
  },
  deleteCode: async (id) => {
    codes = codes.filter((code) => code.id !== id);
  },
  deleteSession: async (id) => {
    sessions = sessions.filter((session) => session.id !== id);
  },
  findSessionById: async (id) => {
    return sessions.find((session) => session.id === id) ?? null;
  },
  findUserByEmail: async (email) => {
    return users.find((user) => user.email === email) ?? null;
  },
  findUserByEmailOrUsername: async ({ email, username }) => {
    return (
      users.find(
        (user) => user.username === username || user.email === email
      ) ?? null
    );
  },
  findUserById: async (id) => {
    return users.find((user) => user.id === id) ?? null;
  },
  findUserByUsername: async (username) => {
    return users.find((user) => user.username === username) ?? null;
  },
  findSessionCodes: async (sessionId, action) => {
    return codes.filter(
      (code) => code.sessionId === sessionId && code.action === action
    );
  },
  updateSession: async (id, data) => {
    const sessionIndex = sessions.findIndex((session) => session.id === id);
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = {
        ...sessions[sessionIndex],
        ...data,
      };
    }
  },
});
