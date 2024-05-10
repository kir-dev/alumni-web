'use client';

import { TbCheck, TbCircle } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { Button, ButtonProps } from '@/components/ui/button';

interface RsvpProps extends Omit<ButtonProps, 'onClick'> {
  disabled: boolean;
  eventId: string;
}

export default function Rsvp({ eventId, disabled, ...props }: RsvpProps) {
  const eventApplication = trpc.getEventApplicationForUser.useQuery(eventId);
  const createEventApplication = trpc.createEventApplication.useMutation();

  const isDisabled = !eventApplication.isSuccess || Boolean(eventApplication.data) || disabled;

  const handleClick = async () => {
    if (isDisabled) return;
    await createEventApplication.mutateAsync(eventId).then(() => {
      eventApplication.refetch();
    });
  };

  if (eventApplication.isLoading && !disabled) return null;

  return (
    <Button onClick={handleClick} disabled={isDisabled} {...props}>
      {disabled && 'Jelentkezz be a jelentkezéshez!'}
      {!disabled && eventApplication.data && (
        <>
          <TbCheck /> Jelentkeztél
        </>
      )}
      {!disabled && !isDisabled && (
        <>
          <TbCircle /> Jelentkezés
        </>
      )}
    </Button>
  );
}
