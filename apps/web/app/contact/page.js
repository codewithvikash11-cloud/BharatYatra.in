import { InformationPage } from '../../components/information-page.js';
import { getLanguage } from '../../lib/i18n.js';
export const metadata={title:'Contact BharatYatra',robots:{index:false,follow:true}};
export default async function ContactPage(){
  const lang = await getLanguage();
  const title = lang === 'hi' ? 'संपर्क' : 'Contact';
  const desc = lang === 'hi' ? 'सुझाव या content correction साझा करने के लिए संपर्क माध्यम जल्द प्रकाशित होगा।' : 'A contact channel for sharing feedback or content corrections will be published soon.';
  return <InformationPage eyebrow="GET IN TOUCH" title={title} description={desc} review><div lang="hi"><p>इस page पर अभी कोई verified contact channel configured नहीं है। किसी व्यक्ति या संगठन का email या phone number अनुमान से नहीं जोड़ा गया है।</p><p>Project owner को public contact channel और response expectations तय करने के बाद इस page को अपडेट करना चाहिए।</p></div></InformationPage>;
}
