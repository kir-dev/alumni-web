'use client';

import { TbCheck } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { Button, ButtonProps } from '@/components/ui/button';

interface RsvpProps extends Omit<ButtonProps, 'onClick'> {
  disabled: boolean;
  eventId: string;
}

export default function Rsvp({ eventId, disabled, ...props }: RsvpProps) {
  const eventApplication = trpc.getEventApplicationForUser.useQuery(eventId);
  const createEventApplication = trpc.createEventApplication.useMutation();
  const deleteEventApplication = trpc.deleteEventApplication.useMutation();

  const isDisabled = !eventApplication.isSuccess || disabled;

  const handleApplication = () => {
    createEventApplication.mutateAsync(eventId).then(() => {
      eventApplication.refetch();
    });
  };

  const handleDelete = () => {
    deleteEventApplication.mutateAsync(eventId).then(() => {
      eventApplication.refetch();
    });
  };

  if (isDisabled)
    return (
      <Button disabled {...props}>
        Jelentkezés
      </Button>
    );

  if (!eventApplication.data)
    return (
      <Button onClick={handleApplication} {...props}>
        Jelentkezés
      </Button>
    );

  return (
    <Button onClick={handleDelete} {...props}>
      <TbCheck /> Jelentkeztél
    </Button>
  );
}
