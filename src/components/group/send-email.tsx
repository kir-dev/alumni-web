'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import { useForm } from 'react-hook-form';
import { TbMailForward } from 'react-icons/tb';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
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
            </DialogBody>
            <DialogFooter>
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
