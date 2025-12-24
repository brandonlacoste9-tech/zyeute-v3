import { Worker, Job } from 'bullmq';
import { processVideo, VideoProcessingJob } from './services/videoProcessor.js';
import { uploadProcessedVideo } from './services/storage.js';
import { updatePostStatus, saveVideoUrls } from './services/videoDatabase.js';
import { notifyCompletion, sendProgress } from './services/notifications.js';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
};

export const videoWorker = new Worker<VideoProcessingJob>('processVideo', async (job) => {
    const { postId, userId } = job.data;
    console.log(`[Worker] Starting job for post ${postId}`);

    try {
        // 1. Update Status
        await updatePostStatus(postId, 'processing');
        await sendProgress(userId, postId, 10, 'Downloading');

        // 2. Process Video (Download, Transcode, Thumbnail)
        // This handles download, valid, transcode, filter, thumb generation
        const processedFiles = await processVideo(job.data);
        
        await sendProgress(userId, postId, 80, 'Uploading');

        // 3. Upload to Storage
        const urls = await uploadProcessedVideo(processedFiles, postId);
        
        // 4. Update Database
        await saveVideoUrls(postId, urls); // videoDatabase expects string
        
        await sendProgress(userId, postId, 100, 'Done');
        await notifyCompletion(userId, postId, true, urls.videoHighUrl);
        
        console.log(`[Worker] Job completed for post ${postId}`);
        return urls;

    } catch (error: any) {
        console.error(`[Worker] Job failed for post ${postId}:`, error);
        await updatePostStatus(postId, 'failed');
        await notifyCompletion(userId, postId, false);
        throw error; // BullMQ handles retry
    }
}, {
    connection,
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '2'),
    limiter: {
        max: 10,
        duration: 1000
    }
});

videoWorker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed!`);
});

videoWorker.on('failed', (job, err) => {
    console.log(`[Worker] Job ${job?.id} failed with ${err.message}`);
});
