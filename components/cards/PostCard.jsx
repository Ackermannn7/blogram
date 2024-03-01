import { formatDateString } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

import Like from '../ui/like'; // import { useEffect, useState } from 'react';
import DeletePost from '../forms/DeletePost';
const PostCard = ({
  id,
  currentUserId,
  parentId,
  content,
  likes,
  author,
  community,
  createdAt,
  comments,
  isComment,
}) => {
  const uniqueImages = new Set();

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={author.image}
                alt='Profile image'
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>
            <div className='thread-card_bar' />
          </div>
          <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.username}
              </h4>
            </Link>
            <p className='mt-2 text-small-regular text-light-2'>{content}</p>
            <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
              <div className='flex gap-3.5'>
                <Like userId={currentUserId} postId={id} likes={likes} />

                <Link href={`/post/${id}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='reply'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>
                <Image
                  src='/assets/repost.svg'
                  alt='repost'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Image
                  src='/assets/share.svg'
                  alt='share'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
              </div>
              {isComment && (
                <div className='flex items-center gap-2'>
                  <p className='text-subtle-medium text-gray-1'>
                    {formatDateString(createdAt)}
                  </p>
                  {comments.length > 0 && (
                    <Link
                      href={`/post/${id}`}
                      className='flex items-center text-subtle-medium text-gray-1'
                    >
                      {comments?.map((comment, index) => {
                        const imageUrl = comment.author?.image || '';

                        if (!uniqueImages.has(imageUrl)) {
                          uniqueImages.add(imageUrl);

                          return (
                            <Image
                              key={index}
                              src={imageUrl}
                              alt={`user_${index}`}
                              width={20}
                              height={20}
                              className={`${
                                index !== 0 && '-ml-3'
                              } rounded-full object-cover`}
                            />
                          );
                        }

                        return null; // Skip rendering for duplicate images
                      })}
                      {comments.length > 3 ? (
                        <p className='ml-1 text-subtle-medium text-gray-1'>
                          {comments.length}+ users
                        </p>
                      ) : (
                        <p className='ml-2 text-subtle-medium text-gray-1'>
                          {comments.length !== 1
                            ? `${comments.length} replies`
                            : `${comments.length} reply`}
                        </p>
                      )}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* TODO: DeleteThread */}
        <DeletePost
          postId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author._id}
          parentId={parentId}
          isComment={isComment}
        />
        {/* TODO: ShowCommentLogos */}
      </div>
      {!isComment &&
        (community ? (
          <Link
            href={`/communities/${community.id}`}
            className='mt-5 flex items-center'
          >
            <p className='text-subtle-medium text-gray-1'>
              {formatDateString(createdAt)} - {community.name} Community
            </p>
            <Image
              src={community.image}
              alt={community.name}
              width={14}
              height={14}
              className='ml-1 rounded-full object-cover'
            />
          </Link>
        ) : (
          <div className='mt-5 flex items-center gap-4'>
            <p className='text-subtle-medium text-gray-1'>
              {formatDateString(createdAt)}
            </p>
            <p className='text-subtle-medium text-gray-1'>
              {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
            </p>
            {comments.length > 0 && (
              <Link
                href={`/post/${id}`}
                className='flex items-center text-subtle-medium text-gray-1'
              >
                {comments.slice(0, 3).map((comment, index) => {
                  const imageUrl = comment.author.image;
                  if (!uniqueImages.has(imageUrl)) {
                    uniqueImages.add(imageUrl);

                    return (
                      <div
                        className={`relative w-5 h-5 ${index !== 0 && '-ml-2'}`}
                        key={index}
                      >
                        <Image
                          src={imageUrl}
                          alt={`user_${index}`}
                          fill
                          className='rounded-full object-cover'
                        />
                      </div>
                    );
                  }

                  return null; // Skip rendering for duplicate images
                })}

                {comments.length > 3 ? (
                  <p className='ml-1 text-subtle-medium text-gray-1'>
                    {comments.length}+ users
                  </p>
                ) : (
                  <p className='ml-2 text-subtle-medium text-gray-1'>
                    {comments.length !== 1
                      ? `${comments.length} replies`
                      : `${comments.length} reply`}
                  </p>
                )}
              </Link>
            )}
          </div>
        ))}
    </article>
  );
};
export default PostCard;
