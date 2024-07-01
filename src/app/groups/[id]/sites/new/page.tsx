import { Metadata } from 'next';

import Providers from '@/components/providers';
import { CreateGroupSite } from '@/components/sites/create-group-site';
import Forbidden from '@/components/sites/forbidden';
import { canEdit } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Statikus oldal létrehozása csoportnak'),
  description: 'Hozz létre egy új statikus oldalt a csoportnak!',
};

export default async function CreateGroupSitePage({ params }: { params: { id: string } }) {
  const userCanEdit = await canEdit(params.id);

  if (!userCanEdit) return <Forbidden />;

  return (
    <main>
      <Providers>
        <CreateGroupSite groupId={params.id} />
      </Providers>
    </main>
  );
}
