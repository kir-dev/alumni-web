'use client';

import { User } from '@prisma/client';
import { TbMail, TbPhone, TbUserSearch } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IconValueDisplay } from '@/components/ui/icon-value-display';

interface UserDetailsProps {
  user: Pick<User, 'firstName' | 'lastName' | 'nickname' | 'email' | 'phone'>;
}

export default function UserDetails({ user }: UserDetailsProps) {
  return (
    <Dialog>
      <Button variant='outline' size='icon' asChild>
        <DialogTrigger>
          <TbUserSearch />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader className='text-lg'>
          <DialogTitle>
            {user.lastName} {user.firstName}
            {user.nickname && ` (${user.nickname})`}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className='space-y-4'>
          <IconValueDisplay icon={TbMail} value={user.email} type='email' />
          <IconValueDisplay icon={TbPhone} value={user.phone} type='tel' />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
