"use server";
import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";

import Post from "../models/post.model";
import User from "../models/user.model";

export async function createPost({ text, author, communityId, path }) {
  try {
    connectToDB();
    const createdPost = await Post.create({
      text,
      author,
      community: null,
    });
    // update user model
    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });
    revalidatePath(path);
  } catch (error) {
    throw new Error("Error creating post: ", error.message);
  }
}
export async function addCommentToPost(postId, commentText, userId, path) {
  try {
    connectToDB();
    //find the original post
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      throw new Error("Couldn't find post!");
    }
    // create a new comment
    const postComment = new Post({
      text: commentText,
      author: userId,
      parentId: postId,
    });
    // save the new comment
    const savedPostComment = await postComment.save();

    originalPost.children.push(savedPostComment._id);

    await originalPost.save();
    revalidatePath(path);
  } catch (error) {
    throw new Error(`Error adding comment to post: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  //Calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  //Fetch the posts that have no parents (top-level posts)
  const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
    .sort({
      createdAt: "desc",
    })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Post.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchPostById(postId) {
  try {
    connectToDB();
    //TODO: Populate Community
    const post = await Post.findById(postId)
      .populate({ path: "author", model: User, select: "_id name image" })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Post,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return post;
  } catch (error) {
    throw new Error(`Failed to find post, ${error.message}`);
  }
}
