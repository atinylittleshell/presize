import { component$, noSerialize } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import dayjs from 'dayjs';
import JSZip from 'jszip';
import mixpanel from 'mixpanel-browser';
import { typeid } from 'typeid-js';

import { TbBrandGithubFilled, TbBrandTwitterFilled, TbInfoCircle } from '~/components/common-ui/icons';
import { ImageSelector } from '~/components/ImageSelector';
import { useImageSelectorContext } from '~/components/ImageSelectorContext';
import { APP_NAME, DEFAULT_HEAD } from '~/lib/constants';
import { OutputFormat, OutputSizingMode } from '~/lib/types';

export const head: DocumentHead = DEFAULT_HEAD;

export default component$(() => {
  const imageSelectorContext = useImageSelectorContext();

  return (
    <div class="w-screen min-h-screen p-4 flex flex-col-reverse lg:flex-row lg:items-start gap-4 overflow-y-auto">
      <div class="flex flex-col lg:sticky lg:top-0 z-10">
        <div class="rounded-box shadow-xl bg-base-200 flex flex-col gap-2 p-4">
          <div class="text-2xl font-bold">{APP_NAME}</div>
          <div class="flex lg:flex-col lg:w-64 gap-2">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Output</span>
                <span class="label-text">
                  <div
                    class="tooltip tooltip-bottom cursor-pointer"
                    data-tip="Fixed Size allows you to produce output images with the exact dimensions as specified. Fixed Aspect Ratio allows the output images to match the specified aspect ratio but preserve maximum possible resolution."
                  >
                    <TbInfoCircle />
                  </div>
                </span>
              </label>
              <select
                class="select select-bordered"
                onChange$={(e) => {
                  imageSelectorContext.outputSizingMode = e.target.value as OutputSizingMode;
                }}
              >
                <option value="fixed_size">Fixed Size</option>
                <option value="fixed_aspect_ratio">Fixed Aspect Ratio</option>
              </select>
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Width</span>
              </label>
              <input
                type="number"
                class="input input-bordered w-full"
                value={imageSelectorContext.outputSize.width}
                onChange$={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    imageSelectorContext.outputSize = { width: value, height: imageSelectorContext.outputSize.height };
                  }
                }}
              />
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Height</span>
              </label>
              <input
                type="number"
                class="input input-bordered w-full"
                value={imageSelectorContext.outputSize.height}
                onChange$={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    imageSelectorContext.outputSize = { width: imageSelectorContext.outputSize.width, height: value };
                  }
                }}
              />
            </div>
          </div>
          <div class="flex lg:flex-col lg:w-64 gap-2">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Format</span>
              </label>
              <select
                class="select select-bordered"
                onChange$={(e) => {
                  imageSelectorContext.outputFormat = e.target.value as OutputFormat;
                }}
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
          </div>
          <div class="flex lg:flex-col lg:w-64 gap-2 pt-2">
            <button
              class="btn btn-block btn-neutral"
              disabled={!imageSelectorContext.imageProvider || imageSelectorContext.processing}
              onClick$={async () => {
                if (!imageSelectorContext.imageProvider || imageSelectorContext.processing) {
                  return;
                }

                imageSelectorContext.processing = true;

                const results = await imageSelectorContext.imageProvider(`image/${imageSelectorContext.outputFormat}`);
                if (!results.length) {
                  window.alert('Please select at least one image.');
                  imageSelectorContext.processing = false;
                  return;
                }

                const zip = new JSZip();
                const existingNames = new Set<string>();
                for (const result of results) {
                  let fileName = result.file.name;
                  if (existingNames.has(fileName)) {
                    fileName = `${typeid().toString()}_${fileName}`;
                  }
                  existingNames.add(fileName);

                  const newFileName = fileName.replace(/\.[^.]+$/, '') + `.${imageSelectorContext.outputFormat}`;
                  zip.file(newFileName, result.blob);
                }

                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const zipUrl = URL.createObjectURL(zipBlob);

                const hiddenLink = document.createElement('a');
                hiddenLink.style.display = 'none';
                hiddenLink.href = zipUrl;
                hiddenLink.download = `Presize.io_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`;
                document.body.appendChild(hiddenLink);

                hiddenLink.click();

                mixpanel.track('downloaded');

                window.setTimeout(() => {
                  document.body.removeChild(hiddenLink);
                  URL.revokeObjectURL(zipUrl);
                  imageSelectorContext.processing = false;
                }, 1000);
              }}
            >
              {imageSelectorContext.processing && <span class="loading loading-spinner"></span>}
              {imageSelectorContext.processing ? 'Processing...' : 'Save as zip'}
            </button>
          </div>
        </div>
        <div class="divider"></div>
        <div class="self-center flex">
          <a
            class="btn btn-ghost btn-square text-2xl"
            href="https://github.com/atinylittleshell/presize"
            target="_blank"
          >
            <TbBrandGithubFilled />
          </a>
          <a class="btn btn-ghost btn-square text-2xl" href="https://twitter.com/onelittleshell" target="_blank">
            <TbBrandTwitterFilled />
          </a>
        </div>
        <div class="self-center scale-90 flex flex-col">
          <script
            type="text/javascript"
            src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
            data-name="bmc-button"
            data-slug="onelittleshell"
            data-color="#a4cbb4"
            data-emoji=""
            data-font="Bree"
            data-text="Buy me a coffee"
            data-outline-color="#282425"
            data-font-color="#282425"
            data-coffee-color="#dc8850"
          ></script>
        </div>
      </div>
      <div class="flex-1 relative">
        <ImageSelector
          client:load
          onLoad$={(provider) => {
            imageSelectorContext.imageProvider = noSerialize(provider);
          }}
          outputSize={imageSelectorContext.outputSize}
          outputSizingMode={imageSelectorContext.outputSizingMode}
          outputFormat={imageSelectorContext.outputFormat}
        />
      </div>
    </div>
  );
});
