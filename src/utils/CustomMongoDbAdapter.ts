import { Db, ObjectId } from "mongodb";
import { Account as AccountEntity, Session as SessionEntity } from "next-auth";
import {
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import { UserEntity, UserProfileEntity } from "../types";

const collections = {
  User: "users",
  Account: "accounts",
  Session: "sessions",
  UserProfile: "userProfiles",
  VerificationToken: "verificationTokens",
};

interface Entity {
  [key: string]: any;
}

const format = {
  // Takes a mongoDB object and returns a plain old JavaScript object
  from(object: Entity) {
    const newObject: Entity = {};
    for (const key in object) {
      const value = object[key];
      if (key === "_id") {
        newObject.id = value.toHexString();
      } else if (key === "userId") {
        newObject[key] = value.toHexString();
      } else {
        newObject[key] = value;
      }
    }
    return newObject;
  },

  // Takes a plain old JavaScript object and turns it into a mongoDB object */
  to(object: Entity) {
    const newObject: Entity = {
      _id: _id(object.id),
    };
    for (const key in object) {
      const value = object[key];
      if (key === "userId") {
        newObject[key] = _id(value);
      } else {
        newObject[key] = value;
      }
    }
    return newObject;
  },
};

// Converts from string to ObjectId
const _id = (hex: string) => {
  if ((hex === null || hex === void 0 ? void 0 : hex.length) !== 24)
    return new ObjectId();
  return new ObjectId(hex);
};

interface Options {
  db: Db;
}

const CustomMongoDbAdapter = (options: Options) => {
  const { db: m } = options;
  const { from, to } = format;
  const { User, Account, Session, VerificationToken, UserProfile } = {
    User: m.collection(collections.User),
    UserProfile: m.collection(collections.UserProfile),
    Account: m.collection(collections.Account),
    Session: m.collection(collections.Session),
    VerificationToken: m.collection(collections.VerificationToken),
  };

  return {
    // Create user & user profile
    async createUser(data: Omit<AdapterUser, "id">) {
      const { email, emailVerified, ...profileProps } = data;

      // Create user
      const user = to({
        email,
        emailVerified,
        isMember: false,
        isAdmin: false,
      });
      await User.insertOne(user);

      // Create user profile & associate to user
      const profile = to(profileProps);
      await UserProfile.insertOne({ userId: user.id, ...profile });

      return from(user) as AdapterUser;
    },
    // Get user
    async getUser(id: string) {
      const user = await User.findOne<UserEntity>({ _id: _id(id) });
      if (!user) return null;
      return from(user) as AdapterUser;
    },
    // Get user by email
    async getUserByEmail(email: string) {
      const user = await User.findOne<UserProfileEntity>({ email });
      if (!user) return null;
      return from(user) as AdapterUser;
    },
    // Get user by account
    async getUserByAccount(
      provider_providerAccountId: Pick<
        AccountEntity,
        "provider" | "providerAccountId"
      >
    ) {
      const account = await Account.findOne<AccountEntity>(
        provider_providerAccountId
      );
      if (!account) return null;
      const user = await User.findOne<UserEntity>({ _id: account.userId });
      if (!user) return null;
      return from(user) as AdapterUser;
    },
    // Update user
    async updateUser(data: Partial<AdapterUser>) {
      const { value: user } = await User.findOneAndUpdate(
        { _id: _id(data.id!) },
        { $set: data }
      );
      return from(user!) as AdapterUser;
    },
    // Delete user
    async deleteUser(id: string) {
      const userId = _id(id);
      await Promise.all([
        m.collection(collections.Account).deleteMany({ userId }),
        m.collection(collections.Session).deleteMany({ userId }),
        m.collection(collections.UserProfile).deleteOne({ userId }),
        m.collection(collections.User).deleteOne({ _id: userId }),
      ]);
    },
    // Link account
    linkAccount: async (data: AccountEntity) => {
      const account = to(data);
      await Account.insertOne(account);
      return account as AccountEntity;
    },
    // Unlink account
    async unlinkAccount(
      provider_providerAccountId: Pick<
        AccountEntity,
        "provider" | "providerAccountId"
      >
    ) {
      const { value: account } = await Account.findOneAndDelete(
        provider_providerAccountId
      );
      return from(account!) as AccountEntity;
    },
    // Create session
    async createSession(data: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) {
      const session = to(data);
      await Session.insertOne(session);
      return from(session) as AdapterSession;
    },
    // Get session and user
    async getSessionAndUser(sessionToken: string) {
      const session = await Session.findOne<SessionEntity>({ sessionToken });

      // @todo start here
      if (!session) return null;
      const user = await User.findOne<UserEntity>({
        _id: session.userId,
      });
      if (!user) return null;
      const { id, userId, ...profile } =
        (await UserProfile.findOne<UserProfileEntity>({
          userId: session.userId,
        })) || {};
      const { password, ...userProps } = user;
      // const hasPassword = password ? true : false;
      return {
        user: {
          ...from(profile),
          ...from(userProps),
          // hasPassword,
        } as AdapterUser,
        session: from(session) as AdapterSession,
      };
    },
    // Update session
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      const { value: session } = await Session.findOneAndUpdate(
        { sessionToken: data.sessionToken },
        { $set: data }
      );
      return from(session!) as AdapterSession;
    },
    // Delete session
    async deleteSession(sessionToken: string) {
      const { value: session } = await Session.findOneAndDelete({
        sessionToken,
      });
      return from(session!) as AdapterSession;
    },
    // Create verification token
    async createVerificationToken(data: VerificationToken) {
      await VerificationToken.insertOne(to(data));
      return data as VerificationToken;
    },
    // User verification token
    async useVerificationToken(identifier_token: {
      identifier: string;
      token: string;
    }) {
      const { value: verificationToken } =
        await VerificationToken.findOneAndDelete(identifier_token);
      if (!verificationToken) return null;
      // @ts-expect-error
      delete verificationToken._id;
      return verificationToken as unknown as VerificationToken;
    },
  };
};

export { CustomMongoDbAdapter };
