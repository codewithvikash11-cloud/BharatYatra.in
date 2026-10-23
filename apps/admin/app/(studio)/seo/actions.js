'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSession } from '../../../lib/admin-session.js';
import {
  saveGlobalSeoSettings,
  submitToIndexNow,
  getGlobalSeoSettings,
} from '../../../lib/seo-service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function saveGlobalSeoSettingsAction(formData) {
  const session = await getAdminSession();
  if (!session) throw new Error('Unauthorized');

  const newSettings = {
    websiteName: String(formData.get('websiteName') || '').trim(),
    productionSiteUrl: String(formData.get('productionSiteUrl') || '').trim(),
    defaultSeoTitle: String(formData.get('defaultSeoTitle') || '').trim(),
    defaultSeoDescription: String(formData.get('defaultSeoDescription') || '').trim(),
    defaultSocialImage: String(formData.get('defaultSocialImage') || '').trim(),
    googleVerificationToken: String(formData.get('googleVerificationToken') || '').trim(),
    bingVerificationToken: String(formData.get('bingVerificationToken') || '').trim(),
    indexNowKey: String(formData.get('indexNowKey') || '').trim(),
    twitterHandle: String(formData.get('twitterHandle') || '').trim(),
  };

  saveGlobalSeoSettings(newSettings);
  revalidatePath('/seo');
  return { success: true, message: 'Global SEO settings successfully updated.' };
}

export async function submitAllPublishedToIndexNowAction() {
  const session = await getAdminSession();
  if (!session) throw new Error('Unauthorized');

  const settings = getGlobalSeoSettings();
  const siteUrl = settings.productionSiteUrl;

  const [articles, destinations] = await Promise.all([
    prisma.articles.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    }),
    prisma.destinations.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    }),
  ]);

  const urls = [
    `${siteUrl}/`,
    `${siteUrl}/destinations`,
    `${siteUrl}/articles`,
    `${siteUrl}/states`,
    `${siteUrl}/destinations/jaipur`,
    ...destinations.map((d) => `${siteUrl}/destinations/${d.slug}`),
    ...articles.map((a) => `${siteUrl}/articles/${a.slug}`),
  ];

  const result = await submitToIndexNow(urls);
  revalidatePath('/seo');
  return result;
}

export async function submitUrlToIndexNowAction(url) {
  const session = await getAdminSession();
  if (!session) throw new Error('Unauthorized');

  const result = await submitToIndexNow([url]);
  revalidatePath('/seo');
  return result;
}
