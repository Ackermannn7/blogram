import PostCard from '@/components/cards/PostCard';
import Comment from '@/components/forms/Comment';
import { fetchPostById } from '@/lib/actions/post.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async ({ params }) => {
  if (!params.id) return null;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user?.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  const post = await fetchPostById(params.id);
  return (
    <section className='relative'>
      <div>
        <PostCard
          key={post._id}
          id={post._id}
          currentUserId={userInfo?._id}
          parentId={post.parentId}
          content={post.text}
          author={post.author}
          likes={post.likes}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
        />
      </div>
      <div className='mt-7'>
        <Comment
          postId={post.id}
          currentUserImg={userInfo?.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className='mt-10'>
        {post.children.map((child) => (
          <PostCard
            key={child._id}
            id={child._id}
            currentUserId={userInfo?._id}
            parentId={child.parentId}
            content={child.text}
            author={child.author}
            likes={child.likes}
            community={child.community}
            createdAt={child.createdAt}
            comments={child.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};
export default Page;
