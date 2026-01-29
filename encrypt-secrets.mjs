import sodium from 'libsodium-wrappers';

await sodium.ready;

const publicKey = '8kFy7u0NQQSfvUc4ncslRF+iM5h89inhf2yKxXnF4XE=';
const keyId = '3380204578043523366';

// Secrets to encrypt
const accountId = '59fea97fab54fbd4d4168ccaa1fa3410';
const apiToken = 'rQSEvfDkypQIm31Zwu68_Zhk6yCgy4Qp_IQMUlNB'; // Try first token

// Convert base64 public key to Uint8Array
const keyBytes = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);

// Encrypt account ID
const accountIdBytes = sodium.from_string(accountId);
const encryptedAccountId = sodium.crypto_box_seal(accountIdBytes, keyBytes);
const encryptedAccountIdBase64 = sodium.to_base64(encryptedAccountId, sodium.base64_variants.ORIGINAL);

// Encrypt API token
const apiTokenBytes = sodium.from_string(apiToken);
const encryptedApiToken = sodium.crypto_box_seal(apiTokenBytes, keyBytes);
const encryptedApiTokenBase64 = sodium.to_base64(encryptedApiToken, sodium.base64_variants.ORIGINAL);

console.log('Key ID:', keyId);
console.log('\nEncrypted CLOUDFLARE_ACCOUNT_ID:');
console.log(encryptedAccountIdBase64);
console.log('\nEncrypted CLOUDFLARE_API_TOKEN:');
console.log(encryptedApiTokenBase64);
