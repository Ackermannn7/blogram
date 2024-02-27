'use server';
import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';

import Post from '../models/post.model';
import User from '../models/user.model';
import Community from '../models/community.model';

export async function createPost({ text, author, communityId, path }) {
  try {
    connectToDB();
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdPost = await Post.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });
    // update user model
    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { posts: createdPost._id },
      });
    }

    revalidatePath(path);
  } catch (error) {
    throw new Error('Error creating post: ', error);
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
      createdAt: 'desc',
    })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'community',
      model: Community,
    })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image',
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
      .populate({ path: 'author', model: User, select: '_id name image' })
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name parentId image',
          },
          {
            path: 'children',
            model: Post,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image',
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

async function fetchAllChildPosts(postId) {
  const childPosts = await Post.find({ parentId: postId });

  const descendantPosts = [];
  for (const childPost of childPosts) {
    const descendants = await fetchAllChildPosts(childPost._id);
    descendantPosts.push(childPost, ...descendants);
  }

  return descendantPosts;
}

export async function deletePost(id, path) {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainPost = await Post.findById(id).populate('author community');

    if (!mainPost) {
      throw new Error('Post not found');
    }

    // Fetch all child threads and their descendants recursively
    const descendantPosts = await fetchAllChildPosts(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantPostIds = [
      id,
      ...descendantPosts.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantPosts.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPost.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantPosts.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPost.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Post.deleteMany({ _id: { $in: descendantPostIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantPostIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantPostIds } } }
    );

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}
