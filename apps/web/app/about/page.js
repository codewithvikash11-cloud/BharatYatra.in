import { InformationPage } from '../../components/information-page.js';
import { getLanguage } from '../../lib/i18n.js';
export const metadata={title:'About BharatYatra',description:'BharatYatra helps travellers explore published destination guides, attractions and travel stories.'};
export default async function AboutPage(){
  const lang = await getLanguage();
  const title = lang === 'hi' ? 'हमारे बारे में' : 'About Us';
  const desc = lang === 'hi' ? 'भारत के स्थानों और कहानियों को ध्यान से खोजने का एक मंच।' : 'A platform to thoughtfully discover places and stories of India.';
  return <InformationPage eyebrow="BHARATYATRA" title={title} description={desc}><div lang="hi"><p>BharatYatra पर यात्रियों को प्रकाशित destination guides, attraction information और travel stories एक जगह मिलती हैं। यहाँ दिखाई देने वाली सामग्री संपादकीय समीक्षा के बाद प्रकाशित की जाती है।</p><p>हम Hindi और English में जानकारी प्रस्तुत करने की दिशा में काम कर रहे हैं। यात्रा से जुड़ी आवश्यक जानकारी—जैसे पहुँच, शुल्क और समय—के लिए संबंधित आधिकारिक स्रोत और हाल की पुष्टि देखना उपयोगी है।</p></div></InformationPage>;
}
