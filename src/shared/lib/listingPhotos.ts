import { z } from "zod";

export const MAX_LISTING_PHOTOS = 3;

/**
 * Listing photos are uploaded files (downscaled in the browser to ~1280 px JPEG), stored as
 * data URLs. Links to other sites are refused: every viewer's browser would load them.
 */
export const listingPhotosSchema = z
  .array(
    z
      .string()
      .max(2_800_000, "Each photo must be under about 2 MB")
      .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/, "Photos must be uploaded JPEG, PNG or WebP images")
  )
  .max(MAX_LISTING_PHOTOS, `Add at most ${MAX_LISTING_PHOTOS} photos`)
  .default([]);

/** Lists only need the cover photo; the full set would be ~1.5 MB per listing. */
export const withCoverPhotoOnly = <T extends { images: string[] }>(listing: T): T => ({ ...listing, images: listing.images.slice(0, 1) });
