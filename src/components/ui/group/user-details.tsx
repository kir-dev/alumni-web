'use client';

import { User } from '@prisma/client';
import { ReactNode } from 'react';
import { TbHome, TbMail, TbPhone } from 'react-icons/tb';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { IconValueDisplay } from '@/components/ui/icon-value-display';

interface UserDetailsProps {
  member: User;
  trigger: ReactNode;
}

export default function UserDetails({ member, trigger }: UserDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className='text-lg'>
          {member.lastName} {member.lastName}
        </DialogHeader>
        <DialogDescription className='space-y-4'>
          <IconValueDisplay icon={TbMail} value={member.email} type='email' />
          <IconValueDisplay icon={TbPhone} value={member.phone} type='tel' />
          <IconValueDisplay icon={TbHome} value={member.address} type='address' />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
