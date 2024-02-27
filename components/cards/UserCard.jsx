'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const UserCard = ({ id, name, username, imgUrl, personType }) => {
  const router = useRouter();
  return (
    <article className='user-card'>
      <div className='user-card_avatar'>
        <div className='h-[48px] w-[48px] relative'>
          <Image
            src={imgUrl}
            alt='avatar'
            fill
            className='rounded-full object-cover'
          />
        </div>

        <div className='flex-1 text-ellipsis'>
          <h4 className='text-base-semibold text-light-1'>{name}</h4>
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>
      <Button
        className='user-card_btn'
        onClick={() => router.push(`/profile/${id}`)}
      >
        View
      </Button>
    </article>
  );
};

export default UserCard;
