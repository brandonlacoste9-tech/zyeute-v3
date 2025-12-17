/**
 * Orchestrator Core
 * Routes tasks to appropriate bees based on capability
 */

import { HiveTask, HiveTaskResult } from '../types';
import { getBeesByCapability } from '../bee-registry';
// We will import the bees dynamically or via a map to avoid circular deps if possible
// For now, we stub the execution

export class OrchestratorCore {
    async handleHiveTask(task: HiveTask): Promise<HiveTaskResult> {
        console.log(`[Orchestrator] Received task: ${task.type}`);

        // Map task type to capability (simple mapping for now)
        const capability = this.mapTaskTypeToCapability(task.type);

        // Find bee
        const bees = getBeesByCapability(capability);
        if (bees.length === 0) {
            return {
                taskId: task.id,
                success: false,
                error: `No bee found for capability: ${capability}`
            };
        }

        const bee = bees[0]; // Pick first available
        console.log(`[Orchestrator] Routing to bee: ${bee.id}`);

        try {
            // Dynamic import to break circular dependency if any, or just standard import pattern
            // In a real app, we might use a BeeFactory or Command pattern.
            // For this plan, we'll assume we load the module from ../bees/<id>

            const beeModule = await import(`../bees/${bee.id}`);
            if (beeModule && typeof beeModule.run === 'function') {
                const result = await beeModule.run(task.payload);
                return {
                    taskId: task.id,
                    success: true,
                    data: result,
                    metadata: {
                        beeId: bee.id,
                        executionTime: 0, // TODO: Measure
                        model: bee.model
                    }
                };
            } else {
                throw new Error(`Bee ${bee.id} does not export a run function`);
            }

        } catch (error: any) {
            console.error(`[Orchestrator] Error executing bee ${bee.id}:`, error);
            return {
                taskId: task.id,
                success: false,
                error: error.message || String(error)
            };
        }
    }

    private mapTaskTypeToCapability(taskType: string): any {
        // fast mapping
        if (taskType.includes('chat')) return 'chat';
        if (taskType.includes('caption')) return 'caption';
        if (taskType.includes('image')) return 'image';
        if (taskType.includes('video')) return 'video';
        if (taskType.includes('compose')) return 'compose';
        if (taskType.includes('moderate')) return 'moderation';
        if (taskType.includes('budget')) return 'budget';
        if (taskType.includes('analytics')) return 'analytics';
        return 'chat'; // default
    }
}

export const orchestrator = new OrchestratorCore();
