'use client';

import {
  fetchPostById,
  likePost,
  removeLike,
} from '@/lib/actions/post.actions';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Like = ({ postId, userId, likes }) => {
  const pathname = usePathname();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userLiked = likes.includes(userId);
        setIsLiked(userLiked);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchData();
  }, [postId, userId]);
  const handleLikePost = async () => {
    try {
      await likePost(postId, userId, pathname);
      setIsLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  const handleRemoveLike = async () => {
    try {
      await removeLike(postId, userId, pathname);
      setIsLiked(false);
    } catch (error) {
      console.error('Error removing like:', error);
    }
  };

  return (
    <Image
      onClick={!isLiked ? handleLikePost : handleRemoveLike}
      src={`/assets/heart-${isLiked ? 'filled' : 'gray'}.svg`}
      alt='heart'
      width={24}
      height={24}
      className='cursor-pointer object-contain'
    />
  );
};
export default Like;
