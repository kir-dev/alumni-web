'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SiteSpecialty, StaticSite } from '@prisma/client';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import { useForm } from 'react-hook-form';
import { TbStars } from 'react-icons/tb';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { Button, LoadingButton } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SelectField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { SpecialtyOptions } from '@/lib/static-site';
import { SetSiteSpecialtyDto } from '@/types/site-editor.types';

interface SiteSpecialtySelectorProps {
  site: StaticSite;
}

export default function SiteSpecialtySelector({ site }: SiteSpecialtySelectorProps) {
  const setSiteSpecialty = trpc.setSiteSpecialty.useMutation();

  const form = useForm<z.infer<typeof SetSiteSpecialtyDto>>({
    defaultValues: {
      siteId: site.id,
      specialty: site.specialty as SiteSpecialty,
    },
    resolver: zodResolver(SetSiteSpecialtyDto),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await setSiteSpecialty.mutateAsync(data);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <LoadingButton isLoading={setSiteSpecialty.isPending} variant='outline'>
          <TbStars /> Specializáció beállítása
        </LoadingButton>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Specializáció beállítása</DialogTitle>
              <p>{site.title}</p>
            </DialogHeader>
            <DialogBody>
              <p>
                Specializáció beállításával az oldalt speciális funkciókhoz állíthatód be, így nem csak egy egyszerű
                statikus oldal lesz.
              </p>
              <SelectField control={form.control} name='specialty' label='Specializáció' options={SpecialtyOptions} />
            </DialogBody>
            <DialogFooter className='mt-5'>
              <DialogClose asChild>
                <Button variant='outline'>Mégse</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type='submit'>Mentés</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
