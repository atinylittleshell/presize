export type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

export type ProcessedImage = {
  id: string;
  file: File;
  blob: Blob;
};

export type Size = {
  width: number;
  height: number;
};

export type OutputFormat = 'png' | 'jpeg';

export type OutputSizingMode = 'fixed_size' | 'fixed_aspect_ratio';
