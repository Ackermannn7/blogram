import { fetchUserPosts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import PostCard from '../cards/PostCard';
import { fetchCommunityPosts } from '@/lib/actions/community.actions';

const PostsTab = async ({ currentUserId, accountId, accountType }) => {
  // TODO: Fetch profile posts
  let result;
  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }
  if (!result) redirect('/');
  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.posts.map((post) => (
        <PostCard
          key={post._id}
          id={post._id}
          currentUserId={currentUserId}
          parentId={post.parentId}
          likes={post.likes}
          content={post.text}
          author={
            accountType === 'User'
              ? {
                  name: result.name,
                  image: result.image,
                  id: result.id,
                  _id: result._id,
                }
              : {
                  name: post.author.name,
                  image: post.author.image,
                  id: post.author.id,
                }
          } // todo
          community={post.community} // todo
          createdAt={post.createdAt}
          comments={post.children}
        />
      ))}
    </section>
  );
};

export default PostsTab;
