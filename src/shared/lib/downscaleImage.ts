/**
 * Browser-only: re-encodes a photo as a JPEG data URL no larger than maxSide pixels.
 * Keeps uploads under the AI and listing size limits, and re-encoding drops
 * EXIF metadata such as the GPS position the photo was taken at.
 */
export async function downscaleImage(file: File, maxSide = 1280, quality = 0.8): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}
