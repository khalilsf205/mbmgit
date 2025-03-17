// Function to convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

// Function to convert Uint8Array to string
function uint8ArrayToString(arr: Uint8Array): string {
  return new TextDecoder().decode(arr)
}

// Function to convert hex string to Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  const len = hex.length
  const bytes = new Uint8Array(len / 2)
  for (let i = 0; i < len; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

// Function to convert Uint8Array to hex string
function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Function to derive a key from the encryption key
async function getEncryptionKey(salt?: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = process.env.ENCRYPTION_KEY || "default-encryption-key-for-development"
  const encoder = new TextEncoder()
  const keyData = encoder.encode(keyMaterial)

  // Import the raw key material
  const importedKey = await crypto.subtle.importKey("raw", keyData, { name: "PBKDF2" }, false, ["deriveKey"])

  // Use PBKDF2 to derive a key
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt || encoder.encode("fixed-salt-for-encryption"),
      iterations: 100000,
      hash: "SHA-256",
    },
    importedKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

export async function encrypt(text: string): Promise<string> {
  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Get the encryption key
  const key = await getEncryptionKey()

  // Encrypt the data
  const encodedText = stringToUint8Array(text)
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encodedText,
  )

  // Convert to strings and combine
  const encryptedArray = new Uint8Array(encryptedData)
  const ivHex = uint8ArrayToHex(iv)
  const encryptedHex = uint8ArrayToHex(encryptedArray)

  return `${ivHex}:${encryptedHex}`
}

export async function decrypt(text: string): Promise<string> {
  try {
    // Check if the text is in the expected format
    if (!text || !text.includes(":")) {
      console.error("Invalid encrypted text format")
      throw new Error("Invalid encrypted format")
    }

    const [ivHex, encryptedHex] = text.split(":")

    // Convert hex strings back to Uint8Arrays
    const iv = hexToUint8Array(ivHex)
    const encryptedData = hexToUint8Array(encryptedHex)

    // Get the encryption key
    const key = await getEncryptionKey()

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encryptedData,
    )

    // Convert back to string
    return uint8ArrayToString(new Uint8Array(decryptedData))
  } catch (error) {
    console.error("Decryption error:", error)
    throw error
  }
}

