'use client';

import { Group } from '@prisma/client';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { trpc } from '@/_trpc/client';
import { Button, LoadingButton } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SelectField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';

interface RootGroupSelectorProps {
  rootGroupId: string | null;
  rootGroups: Group[];
}

export function RootGroupSelector({ rootGroupId, rootGroups }: RootGroupSelectorProps) {
  const [open, setOpen] = useState(false);
  const updateRootGroup = trpc.updateRootGroup.useMutation();

  const form = useForm({
    defaultValues: {
      rootGroupId: rootGroupId || '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await updateRootGroup.mutateAsync({ rootGroupId: data.rootGroupId || null });
    setOpen(false);
    window.location.reload();
  });

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <Button onClick={() => setOpen(true)} variant='outline'>
        Forrás csoport módosítása
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forrás csoport módosítása</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Ez a csoport határozza meg az értesítő e-mailek megjelenését és márkázását. A rendszer a regisztrációd során
          automatikusan választotta ki a domén alapján.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <SelectField
              control={form.control}
              name='rootGroupId'
              label='Forrás csoport'
              options={rootGroups.map((group) => ({
                label: group.name,
                value: group.id,
              }))}
            />
            <DialogFooter className='mt-5'>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                Mégse
              </Button>
              <LoadingButton type='submit' isLoading={updateRootGroup.isPending}>
                Mentés
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
