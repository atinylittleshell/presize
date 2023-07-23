/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';
import { SVGProps, useEffect, useMemo, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import { typeid } from 'typeid-js';

import { OutputSizingMode, ProcessedImage, Size } from '~/lib/types';

import ImageItem from './ImageItem';

type ImageFile = {
  id: string;
  file: File;
  editorRef?: AvatarEditor;
};

function TbPhotoPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M15 8h.01M12.5 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6.5"></path>
        <path d="m3 16l5-5c.928-.893 2.072-.893 3 0l4 4"></path>
        <path d="m14 14l1-1c.67-.644 1.45-.824 2.182-.54M16 19h6m-3-3v6"></path>
      </g>
    </svg>
  );
}

function TbCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m5 12l5 5L20 7"
      ></path>
    </svg>
  );
}

const getImageBlobFromEditor = (editor: AvatarEditor, type: string, sizingMode: OutputSizingMode) => {
  return new Promise<Blob>((resolve, reject) => {
    (sizingMode === 'fixed_size' ? editor.getImageScaledToCanvas() : editor.getImage()).toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Error converting image to blob'));
      }
    }, type);
  });
};

function ImageSelectorImpl({
  onLoad,
  outputSize,
  outputSizingMode,
}: {
  onLoad: (provider: (imageType: string) => Promise<ProcessedImage[]>) => void;
  outputSize: Size;
  outputSizingMode: OutputSizingMode;
}) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [
        ...acceptedFiles.map((file) => ({
          id: typeid().toString(),
          file,
        })),
        ...prev,
      ]);
    },
  });

  const thumbnailScale = useMemo(() => {
    const longestEdge = Math.max(outputSize.width, outputSize.height);
    return 400 / longestEdge;
  }, [outputSize]);

  useEffect(() => {
    const provider = async (imageType: string) => {
      const results: ProcessedImage[] = [];
      for (const file of files) {
        if (file.editorRef) {
          results.push({
            id: file.id,
            file: file.file,
            blob: await getImageBlobFromEditor(file.editorRef, imageType, outputSizingMode),
          });
        }
      }
      return results;
    };

    onLoad(provider);
  }, [files, outputSizingMode, onLoad]);

  return (
    <div
      className={
        files.length
          ? 'w-full flex flex-wrap justify-center gap-4'
          : 'w-full min-h-full flex flex-col items-center gap-8 pt-8 lg:pt-0'
      }
    >
      {!files.length ? (
        <div className="flex flex-col gap-4">
          <div className="text-4xl font-bold text-center">Bulk Proprocess, Resize and Crop Your Images</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="badge badge-lg badge-success badge-outline flex gap-1" title="Free to use, forever.">
              Free
              <TbCheck className="text-sm" />
            </span>
            <span
              className="badge badge-lg badge-success badge-outline flex gap-1"
              title="Images are processed within a matter of seconds."
            >
              Instant
              <TbCheck className="text-sm" />
            </span>
            <span
              className="badge badge-lg badge-success badge-outline flex gap-1"
              title="You can tweak each image individually."
            >
              Flexible
              <TbCheck className="text-sm" />
            </span>
            <span
              className="badge badge-lg badge-success badge-outline flex gap-1"
              title="Images are processed locally on your computer."
            >
              Private
              <TbCheck className="text-sm" />
            </span>
          </div>
        </div>
      ) : null}
      <div
        {...getRootProps({
          className: `flex flex-col items-center justify-center gap-4 p-4 rounded-box border-4 border-dashed ${
            isDragActive ? 'border-neutral' : 'border-base-200'
          }`,
          style: {
            width: (thumbnailScale * outputSize.width).toFixed(2) + 'px',
            height: (thumbnailScale * outputSize.height + 84).toFixed(2) + 'px',
          },
        })}
      >
        <input
          {...getInputProps({
            type: 'file',
            multiple: true,
            className: 'hidden',
          })}
        />
        <div className="text-6xl">
          <TbPhotoPlus />
        </div>
        <div className="text-center">Drop image files here or click the button below to select from your computer.</div>
        <button className="btn" onClick={open}>
          Add Files
        </button>
      </div>
      {files.map((file) => (
        <ImageItem
          ref={(el) => {
            file.editorRef = el || undefined;
          }}
          key={file.id}
          file={file.file}
          outputSize={outputSize}
          thumbnailScale={thumbnailScale}
          onDelete={() => {
            setFiles((prev) => prev.filter((f) => f.id !== file.id));
          }}
        />
      ))}
    </div>
  );
}

export const ImageSelector = qwikify$(ImageSelectorImpl);
