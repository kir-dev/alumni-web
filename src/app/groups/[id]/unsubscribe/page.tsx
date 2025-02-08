import { notFound } from 'next/navigation';

import { UnsubscribeForm } from '@/components/group/unsubscribe-form';
import Providers from '@/components/providers';
import { prismaClient } from '@/config/prisma.config';

interface UnsubscribePageProps {
  params: {
    id: string;
  };
}

export default async function UnsubscribePage({ params }: UnsubscribePageProps) {
  const groupId = params.id;

  const group = await prismaClient.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    return notFound();
  }

  return (
    <main className='mx-auto max-w-lg w-full'>
      <h1>Leiratkozás</h1>
      <p>Leiratkozás a(z) {group.name} csoport minden értesítéséről</p>
      <Providers>
        <UnsubscribeForm group={group} />
      </Providers>
    </main>
  );
}
