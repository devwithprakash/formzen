import "dotenv/config";

import db, { eq } from "@repo/database";
import { createClerkClient } from "@clerk/backend";

import { usersTable } from "@repo/database/models/user";

import { userInput, type UserInputType } from "./model";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

const USER_SELECT_FIELDS = {
  email: usersTable.email,
  fullName: usersTable.fullName,
  imageUrl: usersTable.imageUrl,
} as const;

export const upsertUserByClerkId = async (payload: UserInputType) => {
  const { clerkUserId } = await userInput.parseAsync(payload);

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, clerkUserId))
    .limit(1);

  if (existingUser) {
    return existingUser;
  }

  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  const primaryEmail =
    clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ?? null;

  if (!primaryEmail) {
    throw new Error(`No primary email found for user: ${clerkUserId}`);
  }

  const fullName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() || "Unknown";

  const [newUser] = await db
    .insert(usersTable)
    .values({
      clerkUserId,
      email: primaryEmail,
      fullName,
      imageUrl: clerkUser.imageUrl,
    })
    .returning(USER_SELECT_FIELDS);

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  return newUser;
};
