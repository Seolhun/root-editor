import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components';
import { ImageFileUploadFn, InsertImagePayload } from '~/context/plugin-functions';

import { useDragAndDrop, useFileUpload, useImagePreview, useMultipartUpload } from './useFileUploader';

export interface ImageUploadBoxProps {
  /**
   * The maximum number of images that can be uploaded.
   * @default 10
   */
  max?: number;
  /**
   * A callback that is called when the user closes the
   */
  onClose: () => void;
  /**
   * A callback that is called when the user confirms the upload.
   */
  onConfirm: (images: InsertImagePayload[]) => void;
  /**
   * A callback that is called when a file is uploaded.
   */
  onImageFileUpload: ImageFileUploadFn;
}

export function ImageUploadBox({ max = 10, onClose, onConfirm, onImageFileUpload }: ImageUploadBoxProps) {
  const { t } = useTranslation();
  const id = React.useId();
  const { setFiles, setUploadedImages, uploadedImages } = useFileUpload(max);
  const { inputRef, uploadBoxRef } = useDragAndDrop({ setFiles });
  const PreviewImages = useImagePreview({ setUploadedImages, uploadedImages });
  const { uploadImages } = useMultipartUpload({ onImageFileUpload, uploadedImages });

  const handleConfirm = React.useCallback(async () => {
    const results = await uploadImages();
    onConfirm(results);
    onClose();
  }, [onClose, onConfirm, uploadImages]);

  return (
    <div className={clsx('container', 'space-y-12')}>
      <div className="max-w-md mx-auto rounded">
        <div className="flex flex-col space-y-8">
          <div>
            <div className={clsx('border-2 border-dashed border-neutral', 'p-12', 'rounded mb-4')}>
              <input accept="image/*" className="hidden" id={id} multiple ref={inputRef} type="file" />
              <label
                className={clsx('flex flex-col items-center', 'space-y-8', 'cursor-pointer')}
                htmlFor={id}
                ref={uploadBoxRef}
              >
                <ArrowUpTrayIcon className="size-12" />
                <span className="text-neutral dark:text-neutral">{t('upload.images.dnd')}</span>
              </label>
            </div>

            <div className="flex items-center mb-4">
              <ol className={clsx('list-disc list-inside', 'text-xs', 'text-neutral dark:text-neutral')}>
                <li>{t('upload.images.max')}</li>
                <li>{t('upload.images.size')}</li>
                <li>{t('upload.images.format')}</li>
              </ol>
            </div>
          </div>

          <div className={clsx('flex flex-nowrap', 'w-full', 'space-x-4', 'pt-4', 'overflow-x-auto')}>
            {PreviewImages}
          </div>

          <div className={clsx('grid grid-cols-3 gap-4')}>
            <div className="col-span-1">
              <Button className={clsx('w-full', 'px-4 py-2', 'border border-neutral rounded')} onClick={onClose}>
                {t('cancel')}
              </Button>
            </div>
            <div className="col-span-2">
              <Button
                className={clsx(
                  'w-full',
                  'px-4 py-2',
                  'border border-primary',
                  'bg-primary text-cream-1 dark:text-space-1',
                  'rounded',
                )}
                onClick={handleConfirm}
              >
                {t('confirm')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
