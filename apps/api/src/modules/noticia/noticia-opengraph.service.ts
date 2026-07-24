import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

export interface ScrapedNoticia {
  ok: boolean;
  title?: string;
  description?: string;
  image?: string;
  fecha?: string;
  error?: string;
}

// Mirrors NoticiaController::getNoticiaFromUrlAction() exactly: prefers
// og:* over twitter:* when both are present, falls back to whichever one
// exists, and reformats article:published_time from YYYY-MM-DD to DD-MM-YYYY.
@Injectable()
export class NoticiaOpenGraphService {
  async scrape(url: string): Promise<ScrapedNoticia> {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);

      const meta: Record<string, string> = {};
      $('meta').each((_, el) => {
        const name = $(el).attr('name');
        const property = $(el).attr('property');
        const content = $(el).attr('content');
        if (!content) return;
        if (name && ['twitter:title', 'twitter:description', 'twitter:image'].includes(name)) {
          meta[name] = content;
        }
        if (
          property &&
          ['og:title', 'og:description', 'og:image', 'article:published_time'].includes(property)
        ) {
          meta[property] = content;
        }
      });

      const result: ScrapedNoticia = { ok: true };

      if (meta['article:published_time']) {
        const datePart = meta['article:published_time'].split('T')[0];
        result.fecha = datePart.split('-').reverse().join('-');
      }

      result.title = this.pick(meta, 'twitter:title', 'og:title', 'og:title') ?? 'NO TITLE';
      result.description =
        this.pick(meta, 'twitter:description', 'og:description', 'og:description') ?? 'NO description';
      result.image = this.pick(meta, 'twitter:image', 'og:image', 'og:image') ?? 'NO image';

      return result;
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  }

  // twitterKey/ogKey both present -> ogKey wins (legacy behavior); otherwise
  // whichever single one is present.
  private pick(
    meta: Record<string, string>,
    twitterKey: string,
    ogKey: string,
    preferredWhenBoth: string,
  ): string | undefined {
    if (meta[twitterKey] && meta[ogKey]) return meta[preferredWhenBoth];
    return meta[twitterKey] ?? meta[ogKey];
  }
}
