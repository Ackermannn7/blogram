import { getActivity } from '@/lib/actions/user.actions';
import Image from 'next/image';
import Link from 'next/link';

const RepliesTab = async ({ activity }) => {
  return (
    <div className='mt-10 flex flex-col gap-5'>
      {activity.length > 0 ? (
        <>
          {activity.map((activityItem) => (
            <Link
              key={activityItem._id}
              href={`/post/${activityItem.parentId}`}
            >
              <article className='activity-card'>
                <div className='w-5 h-5 relative'>
                  <Image
                    src={activityItem.author.image}
                    alt='Profile picture'
                    fill
                    className='rounded-full object-cover'
                  />
                </div>
                <p className='!text-small-regular text-light-1'>
                  <span className='mr-1 text-primary-500'>
                    {activityItem.author.name}
                  </span>{' '}
                  replied to your post:{' '}
                  <span className='!text-small-semibold'>
                    "{activityItem.text}"
                  </span>
                </p>
              </article>
            </Link>
          ))}
        </>
      ) : (
        <p className='!text-base-regular text-light-3'>No activity yet</p>
      )}
    </div>
  );
};
export default RepliesTab;
