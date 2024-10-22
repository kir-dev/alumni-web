'use client';

import { Prisma } from '@prisma/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TbCircleCheck, TbShieldMinus, TbShieldPlus, TbUserSearch } from 'react-icons/tb';

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDebounce } from '@/hooks/use-debounce';
import SortOrder = Prisma.SortOrder;

interface UserListProps {
  currentUserId?: string;
}

const UserDetails = dynamic(() => import('@/components/group/user-details'), { ssr: false });

export function UserList({ currentUserId }: UserListProps) {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<SortOrder>('desc');
  const [adminFilter, setAdminFilter] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const users = trpc.getUsers.useQuery({
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
  const toggleSuperAdmin = trpc.toggleSuperAdmin.useMutation();

  const onToggleSuperAdmin = async (userId: string) => {
    await toggleSuperAdmin.mutateAsync(userId);
    router.refresh();
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
      <Card className='mt-5'>
        <CardContent className='px-0 pb-0'>
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
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data?.result.map((user) => (
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
              {users.isLoading &&
                [1, 2, 3, 4, 5].map((index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={3}>
                      <Skeleton className='h-10' />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {users.data?.result.length === 0 && <p className='text-center mb-5'>Nincsenek felhasználók.</p>}
        </CardContent>
      </Card>
      <Paginator
        currentPage={page}
        totalCount={users.data?.totalCount ?? 0}
        pageSize={limit}
        onPageChange={(page) => setPage(page)}
      />
    </>
  );
}
