'use client';

import { Membership } from '@prisma/client';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import { useRouter } from 'next/navigation';
import { TbBellCog, TbExclamationCircle, TbLoader } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface NotificationSettingsProps {
  membership: Membership;
}

export default function NotificationSettings({ membership }: NotificationSettingsProps) {
  const router = useRouter();
  const updateNotificationPreferences = trpc.updateNotificationPreferences.useMutation({});

  const onGroupNotificationChange = async (value: boolean) => {
    await updateNotificationPreferences.mutateAsync({ groupId: membership.groupId, enableGroupNotification: value });
  };

  const onEventNotificationChange = async (value: boolean) => {
    await updateNotificationPreferences.mutateAsync({ groupId: membership.groupId, enableEventNotification: value });
  };

  const onNewsNotificationChange = async (value: boolean) => {
    await updateNotificationPreferences.mutateAsync({ groupId: membership.groupId, enableNewsNotification: value });
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      router.refresh();
    }
  };
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button variant='outline' className='w-full'>
          <TbBellCog />
          Értesítések
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Értesítések beállítása ehhez a csoporthoz{' '}
            {updateNotificationPreferences.isPending && <TbLoader className='animate-spin inline' />}
            {updateNotificationPreferences.error && <TbExclamationCircle className='text-red-500 inline' />}
          </DialogTitle>
        </DialogHeader>
        <DialogBody className='space-y-5 mt-5'>
          <NotificationSettingsItem
            label='Értesítés új körlevelekről'
            defaultValue={membership.enableGroupNotification}
            onChange={onGroupNotificationChange}
          />
          <NotificationSettingsItem
            label='Értesítés új eseményekről'
            defaultValue={membership.enableEventNotification}
            onChange={onEventNotificationChange}
          />
          <NotificationSettingsItem
            label='Értesítés új hírekről'
            defaultValue={membership.enableNewsNotification}
            onChange={onNewsNotificationChange}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

interface NotificationSettingsItemProps {
  label: string;
  value?: boolean;
  defaultValue?: boolean;
  onChange: (value: boolean) => void;
}

function NotificationSettingsItem({ label, defaultValue, value, onChange }: NotificationSettingsItemProps) {
  return (
    <div className='flex space-x-2 items-center'>
      <Checkbox id={label} defaultChecked={defaultValue} checked={value} onCheckedChange={onChange} />
      <Label htmlFor={label} className='m-0 cursor-pointer'>
        {label}
      </Label>
    </div>
  );
}
