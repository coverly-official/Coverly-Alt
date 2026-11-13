import { insforge, isInsForgeConfigured } from '@/lib/insforge';

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
}

export const storageService = {
  async uploadRfqAttachment(file: File): Promise<{ data: UploadResult | null; error: Error | null }> {
    if (!isInsForgeConfigured) {
      // In offline/demo fallback mode, simulate realistic file key and local object URL
      const dummyKey = `rfq-demo/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      return {
        data: {
          url: URL.createObjectURL(file),
          key: dummyKey,
          filename: file.name,
          size: file.size,
        },
        error: null,
      };
    }

    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const path = `${Date.now()}-${sanitizedName}`;

      // Upload to private rfq-attachments bucket
      const { data, error } = await insforge.storage
        .from('rfq-attachments')
        .upload(path, file);

      if (error || !data) {
        // Fallback gracefully
        return {
          data: {
            url: URL.createObjectURL(file),
            key: `rfq-fallback/${path}`,
            filename: file.name,
            size: file.size,
          },
          error: error ? new Error(error.message) : null,
        };
      }

      return {
        data: {
          url: (data as { url?: string }).url || `/storage/rfq-attachments/${path}`,
          key: (data as { key?: string }).key || path,
          filename: file.name,
          size: file.size,
        },
        error: null,
      };
    } catch (err) {
      return {
        data: {
          url: URL.createObjectURL(file),
          key: `rfq-err/${file.name}`,
          filename: file.name,
          size: file.size,
        },
        error: err as Error,
      };
    }
  },
};
