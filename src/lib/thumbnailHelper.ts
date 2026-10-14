/**
 * thumbnailHelper.ts
 * Utility to detect and generate thumbnail & peek view URLs for Google Drive
 * and direct image links in BPS Solok Selatan's personal repository.
 */

export interface PreviewInfo {
  hasPreview: boolean;
  thumbnailUrl: string | null;
  peekUrl: string | null;
  fallbackThumbnailUrl?: string | null;
  fallbackPeekUrl?: string | null;
  isGoogleDrive: boolean;
  isDirectImage: boolean;
  fileId?: string;
  sourceType: "gdrive" | "direct_image" | "none";
}

/**
 * Extracts a Google Drive file ID from various Drive URL formats.
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // Pattern 1: drive.google.com/file/d/{FILE_ID}
  const fileDMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: docs.google.com/(document|spreadsheets|presentation)/d/{FILE_ID}
  const docsDMatch = trimmed.match(/docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/i);
  if (docsDMatch && docsDMatch[1]) {
    return docsDMatch[1];
  }

  // Pattern 3: drive.google.com/(open|uc)...?id={FILE_ID}
  if (/drive\.google\.com/i.test(trimmed) || /docs\.google\.com/i.test(trimmed)) {
    const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
    if (idParamMatch && idParamMatch[1]) {
      return idParamMatch[1];
    }
  }

  return null;
}

/**
 * Checks if a URL points directly to an image file or known image CDN.
 */
export function isDirectImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  const trimmed = url.trim();

  // Common image file extensions (with optional query parameters)
  const imageExtPattern = /\.(jpe?g|png|webp|gif|svg|avif)(\?.*)?$/i;
  if (imageExtPattern.test(trimmed)) {
    return true;
  }

  // Known image hosting CDNs where URLs are direct images without extensions
  if (
    /images\.unsplash\.com/i.test(trimmed) ||
    /cdn\.pixabay\.com/i.test(trimmed) ||
    /i\.imgur\.com/i.test(trimmed) ||
    /res\.cloudinary\.com/i.test(trimmed)
  ) {
    return true;
  }

  return false;
}

/**
 * Analyzes a URL and produces thumbnail & peek preview URLs if available.
 */
export function getPreviewInfo(url: string): PreviewInfo {
  if (!url || typeof url !== "string") {
    return {
      hasPreview: false,
      thumbnailUrl: null,
      peekUrl: null,
      isGoogleDrive: false,
      isDirectImage: false,
      sourceType: "none",
    };
  }

  const trimmed = url.trim();

  // Check 1: Google Drive
  const driveFileId = extractGoogleDriveFileId(trimmed);
  if (driveFileId) {
    return {
      hasPreview: true,
      // Direct Google CDN endpoint (avoids 302 redirect & 429 hotlink referer issues)
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${driveFileId}=w600`,
      peekUrl: `https://lh3.googleusercontent.com/d/${driveFileId}=w1600`,
      // Secondary fallback URL via drive.google.com/thumbnail
      fallbackThumbnailUrl: `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w600`,
      fallbackPeekUrl: `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1600`,
      isGoogleDrive: true,
      isDirectImage: false,
      fileId: driveFileId,
      sourceType: "gdrive",
    };
  }

  // Check 2: Direct Image
  if (isDirectImageUrl(trimmed)) {
    return {
      hasPreview: true,
      thumbnailUrl: trimmed,
      peekUrl: trimmed,
      isGoogleDrive: false,
      isDirectImage: true,
      sourceType: "direct_image",
    };
  }

  return {
    hasPreview: false,
    thumbnailUrl: null,
    peekUrl: null,
    isGoogleDrive: false,
    isDirectImage: false,
    sourceType: "none",
  };
}
