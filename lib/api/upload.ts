// src/api/upload.ts
import { sendPost } from "./axios";

export type UploadImageThumbnails = {
  thumb?: string;
  medium?: string;
};

export type UploadImageData = {
  url: string;
  thumbnailUrl?: string;
  thumbnails?: UploadImageThumbnails;
};

// Nếu non-image backend chỉ trả url
export type UploadNonImageData = {
  url: string;
};

// Backend envelope hiện tại
export type UploadEnvelope<T> = {
  data: T;
  timestamp: string;
  path: string;
  traceId: string;
};

// Vì endpoint trả thẳng về 1 object có `data`
// nhưng `data` có thể là image (có thumbnailUrl/thumbnails) hoặc file (chỉ url)
export type UploadResponse = UploadEnvelope<UploadImageData | UploadNonImageData>;

// Normalize output cho UI
export type UploadResult =
  | {
    kind: "image";
    url: string;
    thumbnailUrl?: string;
    thumbnails?: UploadImageThumbnails;
    raw: UploadResponse;
  }
  | {
    kind: "file";
    url: string;
    raw: UploadResponse;
  };

const isImageData = (d: UploadImageData | UploadNonImageData): d is UploadImageData => {
  // có thumbnailUrl hoặc thumbnails => image
  return "thumbnailUrl" in d || "thumbnails" in d;
};

export const UploadApi = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    // Theo snippet mới của bạn: sendPost(url, body) trả về data luôn
    const res = await sendPost("/api/core/upload", formData);
    return res as UploadResponse;
  },

  async upload(file: File): Promise<UploadResult> {
    const raw = await UploadApi.uploadFile(file);
    const d = raw.data;

    if (!d?.url) throw new Error("Upload succeeded but response has no url");

    if (isImageData(d)) {
      return {
        kind: "image",
        url: d.url,
        thumbnailUrl: d.thumbnailUrl,
        thumbnails: d.thumbnails,
        raw,
      };
    }

    return {
      kind: "file",
      url: d.url,
      raw,
    };
  },
};
