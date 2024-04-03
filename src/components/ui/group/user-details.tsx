import { User } from '@prisma/client';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { TbHome, TbMail, TbPhone } from 'react-icons/tb';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';

interface UserDetailsProps {
  member: User;
  trigger: ReactNode;
}

export function UserDetails({ member, trigger }: UserDetailsProps) {
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

function IconValueDisplay({
  icon: Icon,
  value,
  type,
}: {
  icon: IconType;
  value: string;
  type?: 'email' | 'tel' | 'address';
}) {
  return (
    <div className='flex items-center space-x-2 text-lg'>
      <Icon />
      {type === 'email' && <a href={`mailto:${value}`}>{value}</a>}
      {type === 'tel' && <a href={`tel:${value}`}>{value}</a>}
      {type === 'address' && <a href={`https://maps.google.com/?q=${encodeURIComponent(value)}`}>{value}</a>}
      {!type && <p>{value}</p>}
    </div>
  );
}
