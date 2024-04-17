'use client';

import { Membership, MembershipStatus, User } from '@prisma/client';
import type { VariantProps } from 'class-variance-authority';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { TbCheck, TbShieldMinus, TbShieldPlus, TbTrash, TbX } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserListExportButton } from '@/components/ui/user-list-export-button';

interface MemberListProps {
  memberships: (Membership & {
    user: User;
  })[];
  groupName: string;
  groupId: string;
}

const UserDetails = dynamic(() => import('@/components/ui/group/user-details'), { ssr: false });

export function MembersList({ memberships, groupId, groupName }: MemberListProps) {
  const router = useRouter();
  const editMembership = trpc.editMembership.useMutation();
  const deleteMembership = trpc.deleteMembership.useMutation();
  const toggleAdmin = trpc.toggleAdmin.useMutation();

  const onApprove = async (userId: string) => {
    await editMembership.mutateAsync({ userId, groupId, status: 'Approved' }).then(() => router.refresh());
  };

  const onReject = async (userId: string) => {
    await editMembership.mutateAsync({ userId, groupId, status: 'Rejected' }).then(() => router.refresh());
  };

  const onDelete = async (userId: string) => {
    await deleteMembership.mutateAsync({ userId, groupId }).then(() => router.refresh());
  };

  const onToggleAdmin = async (userId: string) => {
    await toggleAdmin.mutateAsync({ userId, groupId }).then(() => router.refresh());
  };

  const approvedMembers = useMemo(
    () => memberships.filter((m) => m.status === 'Approved').map((m) => m.user),
    [memberships]
  );

  return (
    <Card className='mt-10'>
      <CardHeader className='flex justify-end flex-row'>
        <UserListExportButton users={approvedMembers} fileName={`${groupName}-tagok`} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((membership) => (
              <TableRow key={membership.user.id}>
                <TableCell className='text-nowrap'>
                  {membership.user.lastName} {membership.user.firstName}{' '}
                  {membership.isAdmin && <Badge variant='outline'>Admin</Badge>}
                </TableCell>
                <TableCell>{membership.user.email}</TableCell>
                <TableCell>
                  <Badge variant={StatusMap[membership.status].color}>{StatusMap[membership.status].label}</Badge>
                </TableCell>
                <TableCell>
                  <div className='space-x-2 text-right text-nowrap'>
                    <UserDetails member={membership.user} />
                    {(membership.status === 'Pending' || membership.status === 'Rejected') && (
                      <Button onClick={() => onApprove(membership.user.id)} size='icon' variant='successOutline'>
                        <TbCheck />
                      </Button>
                    )}
                    {membership.status === 'Pending' && (
                      <Button onClick={() => onReject(membership.user.id)} size='icon' variant='destructiveOutline'>
                        <TbX />
                      </Button>
                    )}
                    {membership.status === 'Approved' && (
                      <Button onClick={() => onToggleAdmin(membership.user.id)} size='icon' variant='outline'>
                        {membership.isAdmin ? <TbShieldMinus /> : <TbShieldPlus />}
                      </Button>
                    )}
                    {membership.status === 'Approved' && (
                      <Button onClick={() => onDelete(membership.user.id)} size='icon' variant='destructiveOutline'>
                        <TbTrash />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {memberships.length === 0 && <p className='text-center'>Nincsenek tagok a csoportban.</p>}
      </CardContent>
    </Card>
  );
}

const StatusMap: Record<MembershipStatus, { label: string; color: VariantProps<typeof badgeVariants>['variant'] }> = {
  Approved: { label: 'Elfogadva', color: 'green' },
  Pending: { label: 'Függőben', color: 'yellow' },
  Rejected: { label: 'Elutasítva', color: 'red' },
};
