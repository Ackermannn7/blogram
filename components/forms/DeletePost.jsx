'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { deletePost } from '@/lib/actions/post.actions';

function DeletePost({ postId, currentUserId, authorId, parentId, isComment }) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === '/') return null;

  return (
    <Image
      src='/assets/delete.svg'
      alt='delte'
      width={18}
      height={18}
      className='cursor-pointer object-contain'
      onClick={async () => {
        await deletePost(JSON.parse(postId), isComment, pathname);
        if (!parentId || !isComment) {
          router.push('/');
        }
      }}
    />
  );
}

export default DeletePost;
