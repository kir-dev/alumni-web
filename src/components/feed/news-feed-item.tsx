import { TbNews } from 'react-icons/tb';

import { NewsListItem } from '@/components/group/news-list-item';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { NewsFeedItem } from '@/lib/feed';
import { formatRelativeHu } from '@/lib/utils';

interface NewsFeedItemProps {
  newsFeedItem: NewsFeedItem;
}

export function NewsFeedItemComponent({ newsFeedItem }: NewsFeedItemProps) {
  return (
    <Card className='mt-5'>
      <CardHeader className='flex gap-5 flex-row space-y-0'>
        <div className='bg-slate-100 dark:bg-slate-700 rounded-full p-2 w-fit h-fit'>
          <TbNews size={30} />
        </div>
        <div>
          <div>
            <b>{newsFeedItem.groupName}</b> csoportban új hírt publikáltak!
          </div>
          <div className='text-slate-500'>{formatRelativeHu(newsFeedItem.date, new Date())}</div>
        </div>
      </CardHeader>
      <CardContent>
        <NewsListItem news={newsFeedItem.news} />
      </CardContent>
    </Card>
  );
}
