export const shareOrDownload = async (url: string, fileName: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const cleanName = fileName.includes(".") ? fileName : `contenido.${ext}`;
    const mimeType = blob.type || `image/${ext === "jpg" ? "jpeg" : ext}`;
    const file = new File([blob], cleanName, { type: mimeType });
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
    } else {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = cleanName;
      a.click();
      URL.revokeObjectURL(blobUrl);
    }
  } catch {
    // user cancelled share
  }
};

export const downloadFile = async (url: string, fileName: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(blobUrl);
  } catch {
    // download failed
  }
};
