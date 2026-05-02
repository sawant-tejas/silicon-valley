const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'navbar.tsx',
  'hero.tsx',
  'feature-cards.tsx',
  'how-it-works.tsx',
  'footer.tsx'
];

const componentsDir = path.join(__dirname, 'components');

const replacements = [
  { search: /\bbg-black\b/g, replace: 'bg-white dark:bg-black' },
  { search: /\btext-white\b/g, replace: 'text-black dark:text-white' },
  { search: /\btext-gray-400\b/g, replace: 'text-gray-600 dark:text-gray-400' },
  { search: /\btext-gray-500\b/g, replace: 'text-gray-500 dark:text-gray-500' },
  { search: /\bbg-gray-900\b/g, replace: 'bg-gray-100 dark:bg-gray-900' },
  { search: /\bborder-gray-800\b/g, replace: 'border-gray-200 dark:border-gray-800' },
  { search: /\bborder-gray-700\b/g, replace: 'border-gray-300 dark:border-gray-700' },
  { search: /\bhover:text-white\b/g, replace: 'hover:text-black dark:hover:text-white' },
];

filesToProcess.forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
