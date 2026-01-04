const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../../turquoise-koala/config/routes.oas.json');
const outputPath = path.join(__dirname, '../public/openapi.json');

const spec = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Remove x-zuplo-* extensions recursively
function removeZuploExtensions(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(removeZuploExtensions);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!key.startsWith('x-zuplo')) {
      cleaned[key] = removeZuploExtensions(value);
    }
  }
  return cleaned;
}

// Filter out internal endpoints
function filterInternalEndpoints(spec) {
  if (!spec.paths) return spec;

  const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

  for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
    for (const method of methods) {
      if (pathItem[method]?.['x-internal'] === true) {
        delete pathItem[method];
      }
    }
    // Remove empty path items
    const remainingMethods = Object.keys(pathItem).filter(k => methods.includes(k));
    if (remainingMethods.length === 0) {
      delete spec.paths[pathKey];
    }
  }
  return spec;
}

// Clean the spec
let cleaned = removeZuploExtensions(spec);
cleaned = filterInternalEndpoints(cleaned);

// Update info for kong-portal
cleaned.info.title = 'ABM.dev API';
cleaned.info.description = 'GTM Intelligence API - Enrichment, content generation, and integrations';

// Write cleaned spec
fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2));
console.log('OpenAPI spec cleaned and saved to public/openapi.json');
console.log('Paths remaining:', Object.keys(cleaned.paths).length);
