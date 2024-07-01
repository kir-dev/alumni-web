import { Metadata } from 'next';

import { CreateEventForm } from '@/components/group/create-event-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { canEdit } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Új esemény'),
  description: 'Hozz létre egy új eseményt a csoportod számára.',
};

export default async function CreateEventPage({ params }: { params: { id: string } }) {
  const userCanEdit = await canEdit(params.id);
  if (!userCanEdit) return <Forbidden />;

  return (
    <main>
      <h1>Új esemény</h1>
      <Providers>
        <CreateEventForm groupId={params.id} />
      </Providers>
    </main>
  );
}
