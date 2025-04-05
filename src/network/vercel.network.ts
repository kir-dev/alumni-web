import axios, { isAxiosError } from 'axios';

import { VERCEL_API_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID } from '@/config/environment.config';
import { DomainConfig, VercelDomain } from '@/types/domain.types';

const vercelApi = axios.create({
  baseURL: 'https://api.vercel.com',
  headers: {
    Authorization: `Bearer ${VERCEL_API_TOKEN}`,
  },
});

export async function addVercelDomain(domain: string) {
  await vercelApi.post(`/v10/projects/${VERCEL_PROJECT_ID}/domains?&teamId=${VERCEL_TEAM_ID}`, {
    name: domain,
  });
}

export async function getVercelDomains(): Promise<VercelDomain[]> {
  try {
    const response = await vercelApi.get<{
      domains: VercelDomain[];
    }>(`/v9/projects/${VERCEL_PROJECT_ID}/domains?teamId=${VERCEL_TEAM_ID}`);

    return response.data.domains;
  } catch (error) {
    if (isAxiosError(error)) console.error(error.response?.data);

    return [];
  }
}

export async function deleteVercelDomain(domain: string): Promise<void> {
  await vercelApi.delete(`/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}?&teamId=${VERCEL_TEAM_ID}`);
}

export async function getDomainConfig(domain: string): Promise<DomainConfig> {
  const apiResponse = await vercelApi.get<DomainConfig>(
    `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}?&teamId=${VERCEL_TEAM_ID}`
  );

  return apiResponse.data;
}
