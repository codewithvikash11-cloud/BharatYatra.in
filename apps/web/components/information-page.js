import { PageHeading } from './content.js';
import { getLanguage } from '../lib/i18n.js';

export async function InformationPage({eyebrow,title,description,children,review=false}){
  const lang = await getLanguage();
  return <main className="page-shell list-page information-page"><PageHeading eyebrow={eyebrow} title={title} description={description}/>{review&&<p className="review-notice" role="note">{lang === 'hi' ? 'प्रकाशन से पहले project owner की समीक्षा ज़रूरी है।' : 'Owner review required before launch.'}</p>}<div className="information-copy">{children}</div></main>;
}
