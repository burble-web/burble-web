'use server';

import { translateToArabic, TranslationContext } from '@/lib/translation/service';

export async function translateTextAction(
  text: string,
  context: TranslationContext = 'product_name'
): Promise<{ success: boolean; translation?: string; error?: string }> {
  try {
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'Text to translate cannot be empty.' };
    }

    const translation = await translateToArabic(text, context);
    return { success: true, translation };
  } catch (err: any) {
    console.error('[Translate Action Error]', err);
    return { success: false, error: err?.message || 'Translation failed.' };
  }
}
