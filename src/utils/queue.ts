type QueueItem<T> = {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
};

class RequestQueue {
  private queue: QueueItem<any>[] = [];
  private processing = false;
  private delayMs: number;

  constructor(delayMs = 1000) {
    this.delayMs = delayMs;
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const item = this.queue.shift()!;

    try {
      const result = await item.execute();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    }

    // Wait for the specified delay before processing the next item
    await new Promise(resolve => setTimeout(resolve, this.delayMs));
    this.processing = false;
    this.processQueue();
  }

  async enqueue<T>(execute: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ execute, resolve, reject });
      this.processQueue();
    });
  }
}

// Create a singleton instance for 1inch API requests
export const inch1Queue = new RequestQueue(1000);
