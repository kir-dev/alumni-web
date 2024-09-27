'use client';

import { User } from '@prisma/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { TbCircleCheck, TbShieldMinus, TbShieldPlus } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { Badge } from '@/components/ui/badge';
import { LoadingButton } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserListProps {
  users: User[];
  currentUserId?: string;
}

const UserDetails = dynamic(() => import('@/components/group/user-details'), { ssr: false });

export function UserList({ users, currentUserId }: UserListProps) {
  const router = useRouter();
  const toggleSuperAdmin = trpc.toggleSuperAdmin.useMutation();

  const onToggleSuperAdmin = async (userId: string) => {
    await toggleSuperAdmin.mutateAsync(userId);
    router.refresh();
  };
  return (
    <Card className='mt-10'>
      <CardContent className='px-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Email</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='text-nowrap'>
                  {user.lastName} {user.firstName} {user.nickname && ` (${user.nickname})`}{' '}
                  {user.isSuperAdmin && <Badge variant='outline'>Admin</Badge>}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    {user.email}{' '}
                    {user.emailVerified && (
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <TbCircleCheck size={20} className='text-green-500 inline' />
                        </TooltipTrigger>
                        <TooltipContent>Ellenőrizve</TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                </TableCell>
                <TableCell className='space-x-2 text-right text-nowrap'>
                  <UserDetails user={user} />
                  <LoadingButton
                    disabled={currentUserId === user.id}
                    isLoading={toggleSuperAdmin.isPending}
                    onClick={() => onToggleSuperAdmin(user.id)}
                    size='icon'
                    variant={user.isSuperAdmin ? 'default' : 'outline'}
                  >
                    {user.isSuperAdmin ? <TbShieldMinus /> : <TbShieldPlus />}
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.length === 0 && <p className='text-center'>Nincsenek felhasználók.</p>}
      </CardContent>
    </Card>
  );
}
