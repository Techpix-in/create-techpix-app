import { rmSync } from "node:fs";

export interface RollbackOperation {
	undo: () => void | Promise<void>;
}

export class ProjectRollback {
	private operations: RollbackOperation[] = [];

	/**
	 * Track an operation that may need to be undone on failure.
	 */
	track(operation: RollbackOperation) {
		this.operations.push(operation);
	}

	/**
	 * Track a directory creation for cleanup.
	 */
	trackDir(path: string) {
		this.track({
			undo: () => {
				try {
					rmSync(path, { recursive: true, force: true });
				} catch (_e) {
					// Ignore cleanup errors
				}
			},
		});
	}

	/**
	 * Execute all tracked rollback operations in reverse order.
	 */
	async rollback(): Promise<void> {
		console.log("\nRolling back changes...");
		for (const op of [...this.operations].reverse()) {
			await op.undo();
		}
	}
}
