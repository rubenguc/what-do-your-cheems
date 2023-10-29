import { FC } from 'react';
import { RoomJudge } from 'wdyc-interfaces';
import { Card } from '../../../components/common';

interface JudgeCardProps {
  judge: RoomJudge;
}

export const JudgeCard: FC<JudgeCardProps> = ({ judge }) => {
  const imageOrientiation = judge.card.imageOrientation;

  console.log(JudgeCard)

  return (
    <div
      className={`flex flex-col gap-2 w-full h-full`}
    >
      <Card card={judge.card} isInJudgePosition />
      {/* 
      // <div className='w-fit' >
      //   <p color="white">{t('judge')}:</p>
      //   <img
      //     src={AVATARS[judge?.avatar || '']}
      //   />
      //   <p className='text-center'>
      //     {judge?.username || ''}
      //   </p>
      // </div> */}
    </div>
  );
};
