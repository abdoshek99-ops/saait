// app/api/news/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const feeds = [
      'https://www.arabhardware.net/feed',
      'https://www.itp.net/feed',
      'https://techcrunch.com/feed/',
      'https://www.theverge.com/rss/index.xml',
      'https://www.wired.com/feed/rss',
      'http://feeds.arstechnica.com/arstechnica/index/',
      'https://www.bbc.com/arabic/topics/c2dwqdn2zq2t.rss'
    ];

    const allArticles: any[] = [];

    for (const feedUrl of feeds) {
      try {
        const res = await fetch(feedUrl, { next: { revalidate: 1800 } });
        const text = await res.text();

        // Ø§Ø³ØªØ®Ø±Ø§Ø¬ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø¨Ø·Ø±ÙŠÙ‚Ø© Ø£Ø¨Ø³Ø· ÙˆØ£ÙƒØ«Ø± Ø£Ù…Ø§Ù†Ø§Ù‹ (Ø¨Ø¯ÙˆÙ† lookbehind)
        const titleMatches = [...text.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
        const descMatches = [...text.matchAll(/<description>([\s\S]*?)<\/description>/gi)];
        const linkMatches = [...text.matchAll(/<link>([\s\S]*?)<\/link>/gi)];
        const imageMatches = [...text.matchAll(/<media:content[^>]*url="([^"]*)"/gi),
                              ...text.matchAll(/<img[^>]+src="([^"]*)"/gi)];

        for (let i = 1; i < Math.min(4, titleMatches.length); i++) {
          let title = titleMatches[i]?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
          let description = descMatches[i]?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
          let link = linkMatches[i]?.[1]?.trim() || '';

          // Ø§Ø³ØªØ®Ø±Ø§Ø¬ ØµÙˆØ±Ø©
          let image_url = null;
          if (imageMatches.length > 0) {
            const imgIndex = Math.min(i, imageMatches.length - 1);
            image_url = imageMatches[imgIndex]?.[1] || null;
          }

          if (title && link && title.length > 15) {
            description = description.replace(/<[^>]+>/g, '').slice(0, 220);

            allArticles.push({
              title,
              description: description || 'Ø§Ù‚Ø±Ø£ Ø§Ù„Ù…Ø²ÙŠØ¯...',
              link,
              image_url,
              source_name: feedUrl.includes('techcrunch') ? 'TechCrunch' :
                           feedUrl.includes('theverge') ? 'The Verge' :
                           feedUrl.includes('wired') ? 'Wired' :
                           feedUrl.includes('arabhardware') ? 'Ø¹Ø±Ø¨ Ù‡Ø§Ø±Ø¯ÙˆÙŠØ±' :
                           feedUrl.includes('itp') ? 'ITP.net' : 'ØªÙ‚Ù†ÙŠØ©',
              publishedAt: new Date().toISOString(),
              category: (title + description).toLowerCase().includes('ai') || 
                        (title + description).includes('Ø°ÙƒØ§Ø¡') ? 'Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ' : 'Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§'
            });
          }
        }
      } catch (e) {
        console.log(`ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨: ${feedUrl}`);
      }
    }

    // Ø¥Ø²Ø§Ù„Ø© Ø§Ù„ØªÙƒØ±Ø§Ø±Ø§Øª + ØªØ±ØªÙŠØ¨
    const uniqueArticles = allArticles.filter((item, index, self) =>
      index === self.findIndex(a => a.title === item.title)
    );

    const finalData = {
      all: uniqueArticles.slice(0, 18),
      categories: {
        'Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§': uniqueArticles.filter(a => a.category === 'Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§').slice(0, 12),
        'Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ': uniqueArticles.filter(a => a.category === 'Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ').slice(0, 8)
      },
      message: `ØªÙ… Ø¬Ù„Ø¨ ${uniqueArticles.length} Ø®Ø¨Ø±`,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(finalData);

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      all: [],
      categories: {},
      message: 'Ø¬Ø§Ø±ÙŠ ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø£Ø®Ø¨Ø§Ø±... Ø§Ø¶ØºØ· ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø¢Ù†'
    });
  }
}

