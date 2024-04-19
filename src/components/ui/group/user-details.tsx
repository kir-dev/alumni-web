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
  member: User;
}

export default function UserDetails({ member }: UserDetailsProps) {
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
            {member.lastName} {member.firstName}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className='space-y-4'>
          <IconValueDisplay icon={TbMail} value={member.email} type='email' />
          <IconValueDisplay icon={TbPhone} value={member.phone} type='tel' />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
