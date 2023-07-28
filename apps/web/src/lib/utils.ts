import AvatarEditor from 'react-avatar-editor';

import { OutputSizingMode } from './types';

export const getImageBlobFromEditor = (editor: AvatarEditor, type: string, sizingMode: OutputSizingMode) => {
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
