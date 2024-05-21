import { list } from '@vercel/blob';

import { BlobList } from '@/components/admin/blob-list';

export default async function UploadsPage() {
  const response = await list();
  return (
    <main>
      <h1>Feltöltések</h1>
      <BlobList blobs={response.blobs} />
    </main>
  );
}
