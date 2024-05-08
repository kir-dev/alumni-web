import { Event } from '@prisma/client';
import { isSameMinute } from 'date-fns';

import { Difference } from '@/types/event.types';

export const getEventDifference = (before: Event, after: Event): Difference<Event> => {
  const difference: Difference<Event> = {};

  if (!isSameMinute(before.startDate, after.startDate)) {
    difference.startDate = {
      before: before.startDate,
      after: after.startDate,
    };
  }

  if (!isSameMinute(before.endDate, after.endDate)) {
    difference.endDate = {
      before: before.endDate,
      after: after.endDate,
    };
  }

  if (before.location !== after.location) {
    difference.location = {
      before: before.location,
      after: after.location,
    };
  }

  return difference;
};
