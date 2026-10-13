import fs from 'fs';

let code = fs.readFileSync('apps/admin/components/article-editor.js', 'utf8');

// 1. Add form state fields
if (!code.includes('attraction_id:')) {
  code = code.replace(
    "status: article?.status || 'DRAFT',",
    "status: article?.status || 'DRAFT',\n    attraction_id: article?.attraction_id || '',\n    image_credits: article?.image_credits || '',\n    og_image_url: article?.og_image_url || '',"
  );
}

// 2. Add attractionsList state
if (!code.includes('const [attractionsList, setAttractionsList]')) {
  code = code.replace(
    "const [destinationsList, setDestinationsList] = useState([]);",
    "const [destinationsList, setDestinationsList] = useState([]);\n  const [attractionsList, setAttractionsList] = useState([]);"
  );
}

// 3. Load attractions in useEffect
if (!code.includes("fetch('/api/admin/attractions?limit=100'")) {
  code = code.replace(
    "const [sRes, dRes, distRes, tehRes] = await Promise.all([",
    "const [sRes, dRes, distRes, tehRes, aRes] = await Promise.all(["
  );
  code = code.replace(
    "fetch('/api/admin/tehsils?limit=100', { cache: 'no-store' }),",
    "fetch('/api/admin/tehsils?limit=100', { cache: 'no-store' }),\n          fetch('/api/admin/attractions?limit=100', { cache: 'no-store' }),"
  );
  code = code.replace(
    "if (tehRes.ok) setTehsilsList((await tehRes.json()).data || []);",
    "if (tehRes.ok) setTehsilsList((await tehRes.json()).data || []);\n        if (aRes.ok) setAttractionsList((await aRes.json()).data || []);"
  );
}

// 4. availableAttractions filter
if (!code.includes('const availableAttractions =')) {
  code = code.replace(
    "const availableDestinations = destinationsList.filter(",
    "const availableAttractions = attractionsList.filter((a) => !form.destination_id || a.destination_id === form.destination_id);\n  const availableDestinations = destinationsList.filter("
  );
}

// 5. Add attraction selector in Location Tab
if (!code.includes('Primary Subject Attraction / Monument')) {
  const targetPattern = /<\/select>\s*<\/label>\s*<>\s*<\/div>\s*<\/div>\s*\{\/\*\s*TAB 4/m;
  // Let's find after Primary Subject Destination
  const destDropdownMarker = "<span>Primary Subject Destination</span>";
  const pos = code.indexOf(destDropdownMarker);
  if (pos !== -1) {
    const endLabelPos = code.indexOf("</label>", pos);
    if (endLabelPos !== -1) {
      const insertion = `\n\n                    <label className="sidebar-field">
                      <span>Primary Subject Attraction / Monument</span>
                      <select
                        value={form.attraction_id}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleFieldChange('attraction_id', val);
                          if (val) {
                            const found = attractionsList.find((a) => a.id === val);
                            if (found?.destination_id && !form.destination_id) {
                              handleFieldChange('destination_id', found.destination_id);
                            }
                          }
                        }}
                      >
                        <option value="">— Link Related Attraction / Monument —</option>
                        {availableAttractions.map((attr) => (
                          <option key={attr.id} value={attr.id}>
                            {attr.name_en} ({attr.category || 'Monument'})
                          </option>
                        ))}
                      </select>
                    </label>`;
      code = code.slice(0, endLabelPos + 8) + insertion + code.slice(endLabelPos + 8);
    }
  }
}

// 6. Add image credits in Media tab
if (!code.includes('Image Credits & Source')) {
  const altTextMarker = "<span>Image Alt Text (Accessibility & SEO)</span>";
  const pos = code.indexOf(altTextMarker);
  if (pos !== -1) {
    const endLabelPos = code.indexOf("</label>", pos);
    if (endLabelPos !== -1) {
      const insertion = `\n\n                <label className="sidebar-field">
                  <span>Image Credits & Source</span>
                  <input
                    type="text"
                    value={form.image_credits}
                    onChange={(e) => handleFieldChange('image_credits', e.target.value)}
                    placeholder="e.g. Photo by Rahul / Unsplash (CC-BY-4.0)"
                  />
                </label>`;
      code = code.slice(0, endLabelPos + 8) + insertion + code.slice(endLabelPos + 8);
    }
  }
}

// 7. Add OG Image in SEO Studio tab and update social preview
if (!code.includes('Social Sharing Image (OG Image)')) {
  const canonMarker = "<span>Canonical URL Override</span>";
  const pos = code.indexOf(canonMarker);
  if (pos !== -1) {
    const endLabelPos = code.indexOf("</label>", pos);
    if (endLabelPos !== -1) {
      const insertion = `\n\n                <label className="sidebar-field">
                  <span>Social Sharing Image (OG Image)</span>
                  <input
                    type="url"
                    value={form.og_image_url}
                    onChange={(e) => handleFieldChange('og_image_url', e.target.value)}
                    placeholder={form.cover_image_url || 'https://... (defaults to Featured Image)'}
                  />
                </label>`;
      code = code.slice(0, endLabelPos + 8) + insertion + code.slice(endLabelPos + 8);
    }
  }
}

code = code.replace(
  '<img src={form.cover_image_url} alt="Card preview" />',
  '<img src={form.og_image_url || form.cover_image_url} alt="Card preview" />'
);

fs.writeFileSync('apps/admin/components/article-editor.js', code, 'utf8');
console.log('Successfully updated article-editor.js with all required fields!');
