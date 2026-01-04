/**
 * API Key Metadata Storage
 *
 * Simple JSON file-based storage for API key metadata.
 * Kong stores the actual keys, this stores user-friendly metadata like names.
 */

import fs from 'fs/promises';
import path from 'path';
import type { ApiKeyMetadata } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const METADATA_FILE = path.join(DATA_DIR, 'api-keys-metadata.json');

interface MetadataStore {
  keys: Record<string, ApiKeyMetadata>;
}

/**
 * Ensure the data directory and metadata file exist
 */
async function ensureMetadataFile(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(METADATA_FILE);
  } catch {
    // Create empty metadata file
    await fs.writeFile(METADATA_FILE, JSON.stringify({ keys: {} }, null, 2));
  }
}

/**
 * Read the metadata store
 */
async function readStore(): Promise<MetadataStore> {
  await ensureMetadataFile();
  const content = await fs.readFile(METADATA_FILE, 'utf-8');
  return JSON.parse(content);
}

/**
 * Write the metadata store
 */
async function writeStore(store: MetadataStore): Promise<void> {
  await ensureMetadataFile();
  await fs.writeFile(METADATA_FILE, JSON.stringify(store, null, 2));
}

/**
 * Save metadata for an API key
 */
export async function saveKeyMetadata(
  kongKeyId: string,
  metadata: ApiKeyMetadata
): Promise<void> {
  const store = await readStore();
  store.keys[kongKeyId] = metadata;
  await writeStore(store);
}

/**
 * Get metadata for a specific API key
 */
export async function getKeyMetadata(
  kongKeyId: string
): Promise<ApiKeyMetadata | null> {
  const store = await readStore();
  return store.keys[kongKeyId] || null;
}

/**
 * Delete metadata for an API key
 */
export async function deleteKeyMetadata(kongKeyId: string): Promise<void> {
  const store = await readStore();
  delete store.keys[kongKeyId];
  await writeStore(store);
}

/**
 * Get all keys metadata for a specific user
 */
export async function getKeysForUser(
  userId: string
): Promise<Record<string, ApiKeyMetadata>> {
  const store = await readStore();
  const userKeys: Record<string, ApiKeyMetadata> = {};

  for (const [keyId, metadata] of Object.entries(store.keys)) {
    if (metadata.userId === userId) {
      userKeys[keyId] = metadata;
    }
  }

  return userKeys;
}

/**
 * Get key prefix from a full API key
 */
export function getKeyPrefix(fullKey: string): string {
  return fullKey.substring(0, 8);
}
