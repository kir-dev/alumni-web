import axios, { isAxiosError } from 'axios';

import { VERCEL_API_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID } from '@/config/environment.config';
import { DomainConfig, VercelDomain } from '@/types/domain.types';

export async function addVercelDomain(domain: string) {
  await axios.post(
    `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains?&teamId=${VERCEL_TEAM_ID}`,
    {
      name: domain,
    },
    {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
    }
  );
}

export async function getVercelDomains(): Promise<VercelDomain[]> {
  try {
    const response = await axios.get<{
      domains: VercelDomain[];
    }>(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains?teamId=${VERCEL_TEAM_ID}`, {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
    });

    return response.data.domains;
  } catch (error) {
    if (isAxiosError(error)) console.error(error.response?.data);

    return [];
  }
}

export async function deleteVercelDomain(domain: string): Promise<void> {
  await axios.delete(
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}?&teamId=${VERCEL_TEAM_ID}`,
    {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
    }
  );
}

export async function getDomainConfig(domain: string): Promise<DomainConfig> {
  const apiResponse = await axios.get<DomainConfig>(
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/config?&teamId=${VERCEL_TEAM_ID}`,
    {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
    }
  );
  return apiResponse.data;
}
