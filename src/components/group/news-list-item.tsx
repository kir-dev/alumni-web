import { News } from '@prisma/client';
import { TbLock } from 'react-icons/tb';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatHu } from '@/lib/utils';

interface NewsListItemProps {
  news: News;
}

export function NewsListItem({ news }: NewsListItemProps) {
  const dateString = formatHu(news.publishDate, 'yyyy. MMMM dd.');

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between overflow-hidden'>
          <CardTitle className='text-lg truncate'>{news.title}</CardTitle>
          <div className='flex gap-1'>{news.isPrivate && <TbLock className='text-red-500 w-5 h-5' />}</div>
        </div>
        <CardDescription>{dateString}</CardDescription>
      </CardHeader>
    </Card>
  );
}
