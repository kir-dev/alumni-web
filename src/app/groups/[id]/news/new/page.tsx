import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CreateNewsForm } from '@/components/group/create-news-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { canEdit, getGroup } from '@/lib/server-utils';

export const metadata: Metadata = {
  title: 'Új hír',
  description: 'Hozz létre egy új hírt a csoportod számára.',
};

export default async function CreateNewsPage({ params }: { params: { id: string } }) {
  const userCanEdit = await canEdit(params.id);

  if (!userCanEdit) return <Forbidden />;

  const group = await getGroup(params.id);

  if (!group) return notFound();

  return (
    <main>
      <h1>Új hír</h1>
      <Providers>
        <CreateNewsForm groupId={params.id} group={group} />
      </Providers>
    </main>
  );
}
