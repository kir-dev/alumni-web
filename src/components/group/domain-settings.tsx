'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GroupDomain } from '@prisma/client';
import type { VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TbCheck, TbLink, TbX } from 'react-icons/tb';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { Button, buttonVariants, LoadingButton } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/fields';
import { cn } from '@/lib/utils';
import { AddDomainDto } from '@/types/domain.types';

interface DomainSettingsProps {
  domain: GroupDomain | null | undefined;
  groupId: string;
}

export default function DomainSettings({ domain, groupId }: DomainSettingsProps) {
  const router = useRouter();
  const addDomain = trpc.addDomain.useMutation();
  const deleteDomain = trpc.deleteDomain.useMutation();
  const [checkEnabled, setCheckEnabled] = useState(Boolean(addDomain.status === 'success' || domain));
  const checkDomain = trpc.checkDomain.useQuery(
    {
      groupId,
    },
    {
      refetchInterval: 2000,
      enabled: checkEnabled,
    }
  );

  const hasDomain = Boolean(domain);

  let buttonVariant: VariantProps<typeof buttonVariants>['variant'] = 'outline';
  if (checkDomain.data) {
    buttonVariant = checkDomain.data.misconfigured ? 'destructiveOutline' : 'successOutline';
  }

  const onDomainAdd = async (values: z.infer<typeof AddDomainDto>) => {
    await addDomain.mutateAsync(values);
    router.refresh();
  };

  const onDomainDelete = async () => {
    if (!domain?.domain) return;
    await deleteDomain.mutateAsync({ domain: domain.domain, groupId });
    router.refresh();
  };

  useEffect(() => {
    if (checkDomain.data) {
      setCheckEnabled(checkDomain.data.misconfigured);
    } else {
      setCheckEnabled(Boolean(addDomain.status === 'success' || domain));
    }
  }, [checkDomain.data?.misconfigured, addDomain.status, domain]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={buttonVariant} className='w-full'>
          <TbLink />
          Domén beállítása
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Domén beállítása</DialogTitle>
        </DialogHeader>
        {hasDomain ? (
          <DomainResult
            loading={deleteDomain.isPending}
            onDelete={onDomainDelete}
            misconfigured={checkDomain.data?.misconfigured ?? true}
            domain={domain?.domain ?? 'n/a'}
          />
        ) : (
          <DomainForm loading={addDomain.isPending} groupId={groupId} onSubmit={onDomainAdd} />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DomainFormProps {
  onSubmit: (values: z.infer<typeof AddDomainDto>) => void;
  loading: boolean;
  groupId: string;
}

function DomainForm({ onSubmit, groupId, loading }: DomainFormProps) {
  const form = useForm<z.infer<typeof AddDomainDto>>({
    defaultValues: {
      domain: '',
      groupId,
    },
    resolver: zodResolver(AddDomainDto),
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    onSubmit(values);
  });
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <TextField control={form.control} name='domain' label='Domén' />
        <DialogFooter className='mt-5'>
          <LoadingButton isLoading={loading} type='submit'>
            Mentés
          </LoadingButton>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}

interface DomainResultProps {
  onDelete: () => void;
  misconfigured: boolean;
  domain: string;
  loading: boolean;
}

export function DomainResult({ misconfigured, domain, loading, onDelete }: DomainResultProps) {
  return (
    <>
      <div className={cn('flex items-center gap-2', misconfigured ? 'text-red-500' : 'text-green-500')}>
        {misconfigured ? <TbX size={30} /> : <TbCheck size={30} />}
        <div>
          {domain}
          <br />
          <span className='text-sm opacity-80'>
            {misconfigured ? 'A domén nincs megfelelően beállítva' : 'A domén megfelelően beállítva'}
          </span>
          <br />
        </div>
      </div>
      <DialogFooter>
        <LoadingButton isLoading={loading} variant='destructiveOutline' onClick={onDelete}>
          Domén eltávolítása
        </LoadingButton>
      </DialogFooter>
    </>
  );
}
