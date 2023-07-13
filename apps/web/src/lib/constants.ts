import { Size } from './types';

export const APP_NAME = 'Presize.io';

export const LOCAL_STORAGE_PREFIX = 'presize';

export const DEFAULT_HEAD = {
  title: 'Presize.io - Bulk Proprocess, Resize and Crop Your Images',
  meta: [
    {
      name: 'description',
      content:
        'Presize.io is a free online tool to bulk crop and resize images. It is free, easy to use, and supports batch processing.',
    },
    {
      name: 'keywords',
      content:
        'image, size, resize, crop, bulk, batch, ai, stable diffusion, training, lora, free, online, tool, presize, presize.io',
    },
  ],
};

export const DEFAULT_OUTPUT_SIZE: Size = {
  width: 512,
  height: 512,
};
