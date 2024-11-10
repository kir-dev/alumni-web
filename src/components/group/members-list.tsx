'use client';

import { Prisma } from '@prisma/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TbCheck, TbShieldMinus, TbShieldPlus, TbTrash, TbUserSearch, TbX } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { AdminFilter } from '@/components/admin-filter';
import { SortableTableHead } from '@/components/sortable-table-head';
import { Badge } from '@/components/ui/badge';
import { LoadingButton } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageSizeDropdown } from '@/components/ui/page-size-dropdown';
import { Paginator } from '@/components/ui/paginator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { StatusMap } from '@/lib/group';
import SortOrder = Prisma.SortOrder;

interface MemberListProps {
  groupId: string;
}

const UserDetails = dynamic(() => import('@/components/group/user-details'), { ssr: false });

export function MembersList({ groupId }: MemberListProps) {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<SortOrder>('desc');
  const [adminFilter, setAdminFilter] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const members = trpc.getMembers.useQuery({
    groupId,
    limit,
    page,
    name: debouncedSearch,
    sort: {
      field: sortColumn,
      order: sortDirection,
    },
    isAdministrator: adminFilter,
  });

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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit]);

  const onSort = (column: string) => (sortOrder: SortOrder) => {
    setSortColumn(column);
    setSortDirection(sortOrder);
  };

  return (
    <>
      <div className='flex gap-2 mt-5 items-center w-full'>
        <div className='flex bg-slate-200 dark:bg-slate-800 rounded-md flex-1 items-center'>
          <TbUserSearch className='text-slate-400 mx-4' />
          <Input onChange={(e) => setSearch(e.target.value)} placeholder='Keresés' />
        </div>
        <AdminFilter isAdmin={adminFilter} onToggleAdmin={setAdminFilter} />
        <PageSizeDropdown limit={limit} setLimit={setLimit} />
      </div>
      <Card className='mt-10'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  column='lastName'
                  sortDirection={sortColumn === 'lastName' ? sortDirection : undefined}
                  onSort={onSort('lastName')}
                >
                  Név
                </SortableTableHead>
                <SortableTableHead
                  column='email'
                  sortDirection={sortColumn === 'email' ? sortDirection : undefined}
                  onSort={onSort('email')}
                >
                  Email
                </SortableTableHead>
                <TableHead>Státusz</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.data?.result.map((membership) => (
                <TableRow key={membership.user.id}>
                  <TableCell className='text-nowrap'>
                    {membership.user.lastName} {membership.user.firstName}
                    {membership.user.nickname && ` (${membership.user.nickname})`}{' '}
                    {membership.isAdmin && <Badge variant='outline'>Admin</Badge>}
                  </TableCell>
                  <TableCell>{membership.user.email}</TableCell>
                  <TableCell>
                    <Badge variant={StatusMap[membership.status].color}>{StatusMap[membership.status].label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className='space-x-2 text-right text-nowrap'>
                      <UserDetails user={membership.user} />
                      {(membership.status === 'Pending' || membership.status === 'Rejected') && (
                        <LoadingButton
                          isLoading={editMembership.isPending}
                          onClick={() => onApprove(membership.user.id)}
                          size='icon'
                          variant='successOutline'
                        >
                          <TbCheck />
                        </LoadingButton>
                      )}
                      {membership.status === 'Pending' && (
                        <LoadingButton
                          isLoading={editMembership.isPending}
                          onClick={() => onReject(membership.user.id)}
                          size='icon'
                          variant='destructiveOutline'
                        >
                          <TbX />
                        </LoadingButton>
                      )}
                      {membership.status === 'Approved' && (
                        <LoadingButton
                          isLoading={toggleAdmin.isPending}
                          onClick={() => onToggleAdmin(membership.user.id)}
                          size='icon'
                          variant={membership.isAdmin ? 'default' : 'outline'}
                        >
                          {membership.isAdmin ? <TbShieldMinus /> : <TbShieldPlus />}
                        </LoadingButton>
                      )}
                      {membership.status === 'Approved' && (
                        <LoadingButton
                          isLoading={deleteMembership.isPending}
                          onClick={() => onDelete(membership.user.id)}
                          size='icon'
                          variant='destructiveOutline'
                        >
                          <TbTrash />
                        </LoadingButton>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {members.isLoading &&
                [1, 2, 3, 4, 5].map((index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={3}>
                      <Skeleton className='h-10' />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {members.data?.result.length === 0 && <p className='text-center'>Nincsenek ilyen találatok.</p>}
        </CardContent>
      </Card>
      <Paginator
        currentPage={page}
        totalCount={members.data?.totalCount ?? 0}
        pageSize={limit}
        onPageChange={(page) => setPage(page)}
      />
    </>
  );
}
