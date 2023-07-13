/** @jsxImportSource react */
import { forwardRef, Ref, SVGProps, useCallback, useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  const setScale = useCallback((value: number) => {
    setScaleImpl(parseFloat(value.toFixed(2)));
  }, []);
  const changeScaleBy = useCallback((delta: number) => {
    setScaleImpl((prev) => parseFloat((prev + delta).toFixed(2)));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY > 0 ? 0.01 : -0.01;
        changeScaleBy(delta);
      };
      container.addEventListener('wheel', onWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', onWheel);
      };
    }
  }, [changeScaleBy]);

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
          ref={containerRef}
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
        <div className="flex justify-center">
          <div className="join">
            <button
              className="join-item btn btn-xs btn-ghost"
              onClick={() => {
                changeScaleBy(-0.01);
              }}
            >
              -
            </button>
            <input
              type="text"
              className="join-item input input-xs text-center w-full"
              value={(scale * 100).toFixed() + '%'}
              onChange={(e) => {
                const scale = parseFloat(e.target.value.replace('%', '')) / 100;
                if (isNaN(scale) || scale < 0) {
                  setScale(1);
                } else {
                  setScale(scale);
                }
              }}
            />
            <button
              className="join-item btn btn-xs btn-ghost"
              onClick={() => {
                changeScaleBy(0.01);
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(ImageItem);
