import { InformationPage } from '../../components/information-page.js';
import { getLanguage } from '../../lib/i18n.js';
export const metadata={title:'Terms · draft',robots:{index:false,follow:false}};
export default async function TermsPage(){
  const lang = await getLanguage();
  const title = lang === 'hi' ? 'उपयोग की शर्तें' : 'Terms of Use';
  const desc = lang === 'hi' ? 'यह launch से पहले owner और legal reviewer द्वारा पूरा किया जाने वाला draft है।' : 'This is a draft to be completed by the owner and legal reviewer before launch.';
  return <InformationPage eyebrow="TERMS" title={title} description={desc} review><div lang="hi"><h2>सूचना की सीमा</h2><p>किसी destination या attraction की जानकारी यात्रा की तारीख पर बदल सकती है। शुल्क, समय, पहुँच और स्थानीय नियमों की पुष्टि संबंधित आधिकारिक स्रोत से करें।</p><h2>संपादकीय सामग्री</h2><p>इस draft में उपयोग की अनुमति, तृतीय-पक्ष सामग्री, दायित्व, लागू कानून, विवाद समाधान और सेवा उपलब्धता की शर्तें निर्धारित नहीं हैं। Project owner को इन्हें legal review के बाद भरना होगा।</p><h2>लॉन्च से पहले</h2><p>कानूनी reviewer की स्वीकृति और लागू jurisdiction तय होने तक इस page को अंतिम terms न समझें।</p></div></InformationPage>;
}
