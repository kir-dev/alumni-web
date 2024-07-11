import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CreateEventForm } from '@/components/group/create-event-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { canEdit, getGroup } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Új esemény'),
  description: 'Hozz létre egy új eseményt a csoportod számára.',
};

export default async function CreateEventPage({ params }: { params: { id: string } }) {
  const userCanEdit = await canEdit(params.id);
  if (!userCanEdit) return <Forbidden />;

  const group = await getGroup(params.id);

  if (!group) return notFound();

  return (
    <main>
      <h1>Új esemény</h1>
      <Providers>
        <CreateEventForm groupId={params.id} group={group} />
      </Providers>
    </main>
  );
}
