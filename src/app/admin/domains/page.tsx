import { DomainList } from '@/components/admin/domain-list';
import { prismaClient } from '@/config/prisma.config';
import { getVercelDomains } from '@/network/vercel.network';

export default async function DomainsListPage() {
  const domains = await prismaClient.groupDomain.findMany({
    include: {
      group: true,
    },
  });

  const vercelDomains = await getVercelDomains();

  return (
    <main>
      <h1>Domének</h1>
      <DomainList vercelDomains={vercelDomains} groupDomains={domains} />
    </main>
  );
}
