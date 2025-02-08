'use client';

import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbLoader, TbMailPlus, TbSend } from 'react-icons/tb';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TextAreaField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';

interface LegacyMailListProps {
  groupId: string;
  maillist: string[];
}

export default function LegacyMailList({ groupId, maillist }: LegacyMailListProps) {
  const [open, setOpen] = useState(false);
  const setLegacyMailList = trpc.setLegacyMailList.useMutation();
  const form = useForm<{ maillist: string }>({
    defaultValues: {
      maillist: maillist?.join(',') || '',
    },
  });

  const router = useRouter();

  const onSubmit = form.handleSubmit(async (data) => {
    const maillist = data.maillist
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const errors = z.array(z.string().email()).safeParse(maillist);

    if (!errors.success) {
      form.setError('maillist', { message: 'Hibás e-mail cím formátum' });
      return;
    }

    await setLegacyMailList.mutateAsync({
      groupId,
      maillist,
    });

    setOpen(false);
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant='outline' asChild>
        <DialogTrigger>
          {setLegacyMailList.isPending && <TbLoader className='animate-spin' />}
          <TbMailPlus /> Hagyaték levelezési lista
        </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hagyaték levelezési lista</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogBody>
              <TextAreaField
                control={form.control}
                name='maillist'
                label='Címek vesszővel elválasztva'
                description='Vesszővel elválasztva, e-mail cím formában.'
              />
              <Alert variant='warning' className='mt-5'>
                <TbSend className='shrink-0' />
                <AlertDescription>
                  A hagyaték levelezési listába felvett e-mailek megkapják a csoportban közzétett minden levelet. A
                  listáról a cím le tud iratkozni. Tagok e-mail címei szűrésre kerülnek, nem lesznek benne ebben a
                  listában.
                </AlertDescription>
              </Alert>
            </DialogBody>
            <DialogFooter className='mt-5'>
              <Button type='reset' variant='outline' asChild>
                <DialogClose>Mégse</DialogClose>
              </Button>
              <Button type='submit'>Mentés</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
