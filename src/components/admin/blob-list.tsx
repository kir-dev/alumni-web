'use client';
import { ListBlobResultBlob } from '@vercel/blob';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface BlobListProps {
  blobs: ListBlobResultBlob[];
}

export function BlobList({ blobs }: BlobListProps) {
  return (
    <Card className='mt-10'>
      <CardContent className='px-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Előnézet</TableHead>
              <TableHead>Név</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {blobs.map((blob) => (
              <TableRow key={blob.url}>
                <TableCell className='text-nowrap'>
                  <Image
                    src={blob.url}
                    alt={blob.pathname}
                    width={200}
                    height={200}
                    className='h-20 w-20 rounded-lg object-cover object-center'
                  />
                </TableCell>
                <TableCell className='text-nowrap'>{blob.pathname}</TableCell>
                <TableCell className='space-x-2 text-right text-nowrap' />
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {blobs.length === 0 && <p className='text-center'>Nincsenek feltöltések.</p>}
      </CardContent>
    </Card>
  );
}
