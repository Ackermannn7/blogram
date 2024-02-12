"use server";

import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function updateUser({ userId, username, name, bio, image, path }) {
  try {
    connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      // update existing fields and insert new fields in a single time
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId) {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: Community,
    // });
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
