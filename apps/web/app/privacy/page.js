import { InformationPage } from '../../components/information-page.js';
import { getLanguage } from '../../lib/i18n.js';
export const metadata={title:'Privacy notice · draft',robots:{index:false,follow:false}};
export default async function PrivacyPage(){
  const lang = await getLanguage();
  const title = lang === 'hi' ? 'गोपनीयता सूचना' : 'Privacy Notice';
  const desc = lang === 'hi' ? 'यह launch से पहले owner और legal reviewer द्वारा पूरा किया जाने वाला draft है।' : 'This is a draft to be completed by the owner and legal reviewer before launch.';
  return <InformationPage eyebrow="PRIVACY" title={title} description={desc} review><div lang="hi"><h2>जानकारी और सेवाएँ</h2><p>इस सूचना में अभी data controller, hosting providers, server logs, retention अवधि, cookies, analytics, user requests और लागू jurisdiction की पुष्टि शामिल नहीं है। इन बातों की पुष्टि किए बिना इसे final privacy policy न मानें।</p><h2>स्थानीय saved trips</h2><p>Product योजना में guest saved trips device-local रखने की है। लागू implementation और device storage व्यवहार का owner को release से पहले परीक्षण और वर्णन करना है।</p><h2>संपर्क और अधिकार</h2><p>Privacy requests के लिए verified contact channel तथा उपयोगकर्ता अधिकारों की जानकारी owner review के बाद जोड़ी जाएगी।</p></div></InformationPage>;
}
