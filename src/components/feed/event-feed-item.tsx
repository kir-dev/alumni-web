import { TbCalendarPlus } from 'react-icons/tb';

import { EventListItem } from '@/components/group/event-list-item';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EventFeedItem } from '@/lib/feed';
import { formatRelativeHu } from '@/lib/utils';

interface EventFeedItemProps {
  eventFeedItem: EventFeedItem;
}

export function EventFeedItemComponent({ eventFeedItem }: EventFeedItemProps) {
  return (
    <Card className='mt-5'>
      <CardHeader className='flex gap-5 flex-row space-y-0'>
        <div className='bg-slate-100 dark:bg-slate-700 rounded-full p-2 w-fit h-fit'>
          <TbCalendarPlus size={30} />
        </div>
        <div>
          <b>{eventFeedItem.groupName}</b> csoportban új eseményt hoztak létre!
          <div className='text-slate-500'>{formatRelativeHu(eventFeedItem.date, new Date())}</div>
        </div>
      </CardHeader>

      <CardContent>
        <EventListItem event={eventFeedItem.event} />
      </CardContent>
    </Card>
  );
}
