import { UploadApi, UploadResult } from "@/lib/api/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const uploadKeys = {
  all: ["uploads"] as const,
};

export function useUploadFile() {
  const qc = useQueryClient();

  return useMutation<UploadResult, Error, File>({
    mutationFn: (file) => UploadApi.upload(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: uploadKeys.all });
    },
    onError: (err) => {
      console.error("Upload failed:", err);
    },
  });
}
