'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Providers from '@/components/providers';
import { RegisterDto } from '@/types/user.types';
import { trpc } from '@/utils/trpc-client.utils';

export default function RegisterPage() {
  return (
    <main>
      <h1>Regisztráció</h1>
      <Providers>
        <RegisterForm />
      </Providers>
    </main>
  );
}

function RegisterForm() {
  const { mutateAsync, isPending, isError } = trpc.registerUser.useMutation();

  const { handleSubmit, register } = useForm<z.infer<typeof RegisterDto>>();

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <label>Vezetéknév</label>
      <input type='text' {...register('lastName')} />

      <label>Keresztnév</label>
      <input type='text' {...register('firstName')} />

      <label>E-mail</label>
      <input type='email' {...register('email')} />
      <label>Jelszó</label>
      <input type='password' {...register('password')} />

      <label>Telefonszám</label>
      <input type='tel' {...register('phone')} />

      <label>Levelezési cím</label>
      <input type='text' {...register('address')} />

      <button type='submit'>Regisztráció</button>
      {isError && <p>Hiba történt a regisztráció során</p>}
      {isPending && <p>Folyamatban...</p>}
    </form>
  );
}
