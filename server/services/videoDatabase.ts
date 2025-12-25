import { db } from "../storage.js";
import { posts } from "../../shared/schema.js";
import { eq } from "drizzle-orm";

export async function updatePostStatus(
  postId: string,
  status: 'processing' | 'completed' | 'failed'
): Promise<void> {
  await db.update(posts)
    .set({ processingStatus: status })
    .where(eq(posts.id, postId));
}

export async function saveVideoUrls(
  postId: string,
  urls: {
    videoHighUrl: string;
    videoMediumUrl: string;
    videoLowUrl: string;
    thumbnailUrl: string;
  }
): Promise<void> {
    
    // Store all qualities as JSON in the mediaUrl column
    // This allows backward compatibility (string vs json string)
    const mediaPayload = JSON.stringify({
        high: urls.videoHighUrl,
        medium: urls.videoMediumUrl,
        low: urls.videoLowUrl
    });

    await db.update(posts)
        .set({ 
            mediaUrl: mediaPayload,
            // Original URL is kept as backup or previously set
            // In future, we can add columns for resolutions if schema migration is possible
            processingStatus: 'completed',
        })
        .where(eq(posts.id, postId));
}
