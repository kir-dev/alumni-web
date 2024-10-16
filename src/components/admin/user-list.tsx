'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TbCircleCheck, TbShieldMinus, TbShieldPlus, TbUserSearch } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { Badge } from '@/components/ui/badge';
import { LoadingButton } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Paginator } from '@/components/ui/paginator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserListProps {
  currentUserId?: string;
}

const UserDetails = dynamic(() => import('@/components/group/user-details'), { ssr: false });

export function UserList({ currentUserId }: UserListProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);

  const users = trpc.getUsers.useQuery({
    limit,
    page,
    name: debouncedSearch,
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

  return (
    <>
      <div className='flex gap-2 mt-5 items-center w-full'>
        <div className='flex bg-slate-200 dark:bg-slate-800 rounded-md flex-1 items-center'>
          <TbUserSearch className='text-slate-400 mx-4' />
          <Input onChange={(e) => setSearch(e.target.value)} placeholder='Keresés' />
        </div>
        <PageSizeDropdown limit={limit} setLimit={setLimit} />
      </div>
      <Card className='mt-5'>
        <CardContent className='px-0 pb-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Név</TableHead>
                <TableHead>Email</TableHead>
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
                    <UserDetails
                      user={{
                        ...user,
                        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
                        createdAt: new Date(user.createdAt),
                        updatedAt: new Date(user.updatedAt),
                      }}
                    />
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

function PageSizeDropdown({ limit, setLimit }: { limit: number; setLimit: (limit: number) => void }) {
  return (
    <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value))}>
      <SelectTrigger className='w-20'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[10, 20, 50, 100].map((value) => (
          <SelectItem key={value} onClick={() => setLimit(value)} value={String(value)}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
