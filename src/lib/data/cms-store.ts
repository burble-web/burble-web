import fs from 'fs';
import path from 'path';

const CMS_STORAGE_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'cms-content.json');

export interface LocalCmsData {
  promo_cards?: {
    gift_hampers_image?: string;
    combos_image?: string;
    diy_flowers_image?: string;
  };
  [key: string]: any;
}

export function getLocalCmsData(): LocalCmsData {
  try {
    if (fs.existsSync(CMS_STORAGE_PATH)) {
      const content = fs.readFileSync(CMS_STORAGE_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('[CMS Store] Error reading local CMS file:', err);
  }
  return {};
}

export function saveLocalCmsData(data: Partial<LocalCmsData>): LocalCmsData {
  try {
    const existing = getLocalCmsData();
    const merged = { ...existing, ...data };
    fs.writeFileSync(CMS_STORAGE_PATH, JSON.stringify(merged, null, 2), 'utf-8');
    return merged;
  } catch (err) {
    console.error('[CMS Store] Error writing local CMS file:', err);
    return {};
  }
}
