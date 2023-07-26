/** @jsxImportSource react */
import { forwardRef, Ref, SVGProps, useCallback, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';

import { Size } from '~/lib/types';

function TbX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 6L6 18M6 6l12 12"
      ></path>
    </svg>
  );
}

export function TbZoomIn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m4 0h6m-3-3v6m11 8l-6-6"
      ></path>
    </svg>
  );
}

const ImageItem = (
  {
    file,
    outputSize,
    thumbnailScale,
    onDelete,
  }: { file: File; outputSize: Size; thumbnailScale: number; onDelete: () => void },
  ref: Ref<AvatarEditor>,
) => {
  const [scale, setScaleImpl] = useState(1);
  const [minScalePerc, setMinScalePerc] = useState(1);
  const [maxScalePerc, setMaxScalePerc] = useState(1);

  const setScale = useCallback((value: number) => {
    setScaleImpl(parseFloat(value.toFixed(2)));
  }, []);

  return (
    <div
      className="card card-compact shadow-xl bg-base-100"
      style={{
        width: (thumbnailScale * outputSize.width).toFixed(2) + 'px',
      }}
    >
      <figure
        className="w-full"
        style={{
          height: (thumbnailScale * outputSize.height).toFixed(2) + 'px',
        }}
      >
        <div
          style={{
            scale: thumbnailScale.toFixed(2),
          }}
        >
          <AvatarEditor
            image={file}
            ref={ref}
            width={outputSize.width}
            height={outputSize.height}
            border={0}
            scale={scale}
            onLoadSuccess={(image) => {
              setMinScalePerc(
                Math.ceil((Math.min(image.width, image.height) / Math.max(image.width, image.height)) * 100),
              );
              setMaxScalePerc(
                Math.floor(Math.min(image.resource.width / image.width, image.resource.height / image.height) * 100),
              );
            }}
          />
        </div>
      </figure>
      <div className="card-body">
        <div className="w-full flex justify-center gap-1">
          <div className="truncate">{file.name}</div>
          <button
            className="btn btn-xs btn-square"
            onClick={() => {
              onDelete();
            }}
          >
            <TbX />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg">
            <TbZoomIn />
          </div>
          <input
            type="range"
            min={minScalePerc}
            max={maxScalePerc}
            value={scale * 100}
            className="range range-xs flex-1"
            onChange={(e) => {
              const scale = parseFloat(e.target.value) / 100;
              if (isNaN(scale) || scale < 0) {
                setScale(1);
              } else {
                setScale(scale);
              }
            }}
          />
          <input
            type="text"
            className="input input-xs text-right w-12"
            value={(((scale * 100 - minScalePerc) / (maxScalePerc - minScalePerc)) * 100).toFixed() + '%'}
            onChange={(e) => {
              const scale = parseFloat(e.target.value.replace('%', '')) / 100;
              if (isNaN(scale) || scale < 0) {
                setScale(1);
              } else {
                setScale(scale);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default forwardRef(ImageItem);
