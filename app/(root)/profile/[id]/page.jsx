import PostsTab from '@/components/shared/PostsTab';

import ProfileHeader from '@/components/shared/ProfileHeader';
import RepliesTab from '@/components/shared/RepliesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser, getActivity } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const Page = async ({ params }) => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className='mt-9'>
        <Tabs defaultValue='posts' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>
                {tab.label === 'Posts' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo?.posts?.length}
                  </p>
                )}
                {tab.label === 'Replies' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {activity?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='posts' className='w-full text-light-1'>
            <PostsTab
              currentUserId={userInfo._id}
              accountId={userInfo.id}
              accountType='User'
            />
          </TabsContent>
          <TabsContent value='replies' className='w-full text-light-1'>
            <RepliesTab activity={activity} />
          </TabsContent>
          <TabsContent value='tagged' className='w-full text-light-1'>
            <PostsTab
              currentUserId={userInfo._id}
              accountId={userInfo.id}
              accountType='User'
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
export default Page;
