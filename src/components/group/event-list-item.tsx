import { Event } from '@prisma/client';
import { isAfter, isBefore, isPast } from 'date-fns';
import Link from 'next/link';
import { TbArchive, TbChevronRight, TbLock } from 'react-icons/tb';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getFormattedDateInterval } from '@/lib/utils';

interface EventListItemProps {
  event: Event;
}

export function EventListItem({ event }: EventListItemProps) {
  const dateString = getFormattedDateInterval(event.startDate, event.endDate);

  const isArchived = isPast(event.endDate);
  const isCurrent = isAfter(event.endDate, new Date()) && isBefore(event.startDate, new Date());

  return (
    <Link href={`/groups/${event.groupId}/events/${event.id}`}>
      <Card className='mt-2'>
        <CardHeader>
          <div className='flex items-center justify-between overflow-hidden'>
            <CardTitle className='text-lg truncate'>{event.name}</CardTitle>
            <div className='flex gap-1'>
              {event.isPrivate && <TbLock className='text-red-500 w-5 h-5' />}
              {isArchived && <TbArchive className='text-amber-800 w-5 h-5' />}
              {isCurrent && <PulsingDot />}
              <TbChevronRight className='text-slate-500' />
            </div>
          </div>
          <CardDescription>{dateString}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

function PulsingDot() {
  return (
    <div className='bg-green-500 bg-opacity-10 flex items-center justify-center animate-pulse rounded-full w-5 h-5'>
      <div className='w-3 h-3 rounded-full bg-green-500' />
    </div>
  );
}
