'use client';

import { EventApplication, User } from '@prisma/client';
import dynamic from 'next/dynamic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AttendeeListProps {
  eventApplications: (EventApplication & { user: User })[];
}

const UserDetails = dynamic(() => import('@/components/group/user-details'), { ssr: false });

export default function AttendeeList({ eventApplications }: AttendeeListProps) {
  return (
    <Card className='mt-10'>
      <CardHeader className='flex items-center justify-between flex-row'>
        <CardTitle>Jelentkezések</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Email</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventApplications.map((application) => (
              <TableRow key={application.user.id}>
                <TableCell>
                  {application.user.lastName} {application.user.firstName}{' '}
                </TableCell>
                <TableCell>{application.user.email}</TableCell>
                <TableCell>
                  <div className='space-x-2 text-right'>
                    <UserDetails member={application.user} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {eventApplications.length === 0 && <p className='text-center'>Nincsenek jelentkezések.</p>}
      </CardContent>
    </Card>
  );
}
