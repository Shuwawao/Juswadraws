import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const artworksDir = path.join(rootDir, 'artworks');
const outputFile = path.join(rootDir, 'src', 'data', 'artworksManifest.js');

const CATEGORY_MAP = {
  'commissioned work': {
    id: 'commissioned-work',
    name: 'Commissioned Work',
    subtitle: 'Client Commissions & Custom Character Illustrations',
    badge: 'CLIENT WORK'
  },
  'my photo': {
    id: 'my-photo',
    name: 'My Photo',
    subtitle: 'Original Self-Portraits, Personas & Brand Graphics',
    badge: 'IDENTITY'
  },
  'personal works': {
    id: 'personal-works',
    name: 'Personal Works',
    subtitle: 'Original Characters, Anime Tributes & Conceptual Art',
    badge: 'ORIGINAL'
  },
  'sketches and studies': {
    id: 'sketches-and-studies',
    name: 'Sketches and Studies',
    subtitle: 'Rough Drafts, Anatomy Studies, Ink Work & Experiments',
    badge: 'STUDY'
  }
};

const FEATURED_SELECTION = [
  'Adelynn 1.png',
  'final edgeunners.png',
  'Kristian_comms.png',
  'juswa pogi.jpg',
  'juswa-zoom-2.png',
  'Untitled Design.png',
  'chainsaw man.png',
  'CHARACTER SHEET2.png',
  'Hyakkimaru.png',
  'supaidaman.png',
  'gachiakuta oc.png',
  'deku and bakugo.png',
  'garou.png'
];

function cleanTitle(fileName) {
  // strip extension and leading dot
  let name = fileName.replace(/^\./, '').replace(/\.[^/.]+$/, '');
  // normalize underscores and dashes to spaces
  name = name.replace(/[_-]/g, ' ').trim();
  // Capitalize words
  return name.replace(/\b\w/g, c => c.toUpperCase());
}

function generateManifest() {
  const folders = fs.readdirSync(artworksDir);
  const artworks = [];
  let index = 1;

  for (const folder of folders) {
    const folderPath = path.join(artworksDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const categoryMeta = CATEGORY_MAP[folder.toLowerCase()] || {
      id: folder.toLowerCase().replace(/\s+/g, '-'),
      name: folder,
      subtitle: '',
      badge: 'ART'
    };

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) continue;

      const title = cleanTitle(file);
      const isFeatured = FEATURED_SELECTION.includes(file);
      const cleanFileName = file.startsWith('.') ? file.substring(1) : file;
      const url = `/artworks/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;

      artworks.push({
        id: `art-${index++}`,
        fileName: file,
        cleanFileName,
        folder,
        categoryId: categoryMeta.id,
        categoryName: categoryMeta.name,
        badge: categoryMeta.badge,
        title,
        url,
        isFeatured,
        isBrandAsset: folder.toLowerCase() === 'my photo' && (file === 'favicon.png' || file === 'juswa-font.png'),
        tags: [categoryMeta.name, ext.replace('.', '').toUpperCase()]
      });
    }
  }

  const fileContent = `// AUTO-GENERATED ARTWORKS MANIFEST
// Source of truth: D:/art-portfolio2/artworks
// Generated on ${new Date().toISOString()}

export const CATEGORIES = ${JSON.stringify(Object.values(CATEGORY_MAP), null, 2)};

export const ARTWORKS = ${JSON.stringify(artworks, null, 2)};

export default ARTWORKS;
`;

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, fileContent, 'utf-8');
  console.log(`Successfully generated manifest with ${artworks.length} artworks!`);
}

generateManifest();
