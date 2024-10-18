import { News } from '@prisma/client';
import Link from 'next/link';
import { TbChevronRight, TbClock, TbLock } from 'react-icons/tb';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatHu } from '@/lib/utils';

interface NewsListItemProps {
  news: Pick<News, 'publishDate' | 'id' | 'groupId' | 'title' | 'isPrivate'>;
}

export function NewsListItem({ news }: NewsListItemProps) {
  const dateString = formatHu(news.publishDate, 'yyyy. MMMM dd.');

  const isUpcoming = news.publishDate > new Date();

  return (
    <Link href={`/groups/${news.groupId}/news/${news.id}`}>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between overflow-hidden'>
            <CardTitle className='text-lg truncate'>{news.title}</CardTitle>
            <div className='flex gap-1'>
              {news.isPrivate && <TbLock className='text-red-500 w-5 h-5' />}
              {isUpcoming && <TbClock className='text-slate-500 w-5 h-5' />}
              <TbChevronRight className='text-slate-500' />
            </div>
          </div>
          <CardDescription>{dateString}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
