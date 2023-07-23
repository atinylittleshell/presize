import {
  component$,
  createContextId,
  NoSerialize,
  noSerialize,
  Slot,
  useContext,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';

import { DEFAULT_OUTPUT_SIZE } from '~/lib/constants';
import { OutputFormat, OutputSizingMode, ProcessedImage, Size } from '~/lib/types';

type ImageSelectorContextData = {
  imageProvider: NoSerialize<(imageType: string) => Promise<ProcessedImage[]>>;
  outputSize: Size;
  outputFormat: OutputFormat;
  outputSizingMode: OutputSizingMode;
  processing: boolean;
};

export const ImageSelectorContext = createContextId<ImageSelectorContextData>('image-selector-context');

export const ImageSelectorContextProvider = component$(() => {
  const context = useStore<ImageSelectorContextData>({
    imageProvider: noSerialize(async () => []),
    outputSize: DEFAULT_OUTPUT_SIZE,
    outputFormat: 'png',
    outputSizingMode: 'fixed_size',
    processing: false,
  });
  useContextProvider(ImageSelectorContext, context);

  return <Slot />;
});

export const useImageSelectorContext = () => {
  return useContext(ImageSelectorContext);
};
