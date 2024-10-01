'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { TbLoader, TbMailForward, TbSend } from 'react-icons/tb';
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
import { TextAreaField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { SendEmailDto } from '@/types/group.types';

interface SendEmailProps {
  groupId: string;
}

export default function SendEmail({ groupId }: SendEmailProps) {
  const sendEmail = trpc.sendEmail.useMutation();
  const form = useForm<z.infer<typeof SendEmailDto>>({
    resolver: zodResolver(SendEmailDto),
    defaultValues: {
      groupId,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await sendEmail.mutateAsync(data);
  });

  return (
    <Dialog>
      <Button variant='outline' asChild>
        <DialogTrigger>
          {sendEmail.isPending && <TbLoader className='animate-spin' />}
          <TbMailForward /> E-mail küldése
        </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>E-mail küldése</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogBody>
              <TextField control={form.control} name='subject' label='Tárgy' />
              <TextAreaField
                control={form.control}
                name='content'
                label='Tartalom'
                description='Tipp: Használj sortöréseket új bekezdés létrehozásához.'
              />
              <Alert variant='warning' className='mt-5'>
                <TbSend className='shrink-0' />
                <AlertDescription>
                  Az e-mail küldése minden elfogadott csoporttag számára értesítést fog jelenteni. Kérjük, nevezd meg a
                  feladót a levélben!
                </AlertDescription>
              </Alert>
            </DialogBody>
            <DialogFooter className='mt-5'>
              <Button type='reset' variant='outline' asChild>
                <DialogClose>Mégse</DialogClose>
              </Button>
              <Button type='submit' asChild>
                <DialogClose>Küldés</DialogClose>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
