import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import * as React from 'react';

import { ImageFile, ImageFileUploadFn } from '~/context/plugin-functions';

type SetFilesFn = (files: FileList) => void;

export interface UseFileUploadReturns {
  setFiles: SetFilesFn;
  setUploadedImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  uploadedImages: ImageFile[];
}

export function useFileUpload(max: number) {
  const [uploadedImages, setUploadedImages] = React.useState<ImageFile[]>([]);

  const handleFiles = React.useCallback(
    (files: FileList) => {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          continue;
        }

        const reader = new FileReader();
        reader.onloadend = (e: ProgressEvent<FileReader>) => {
          const imageDataUrl = e.target?.result as string;
          if (imageDataUrl) {
            setUploadedImages((state) => [...state, imageDataUrl].slice(0, max));
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [max],
  );

  return {
    setFiles: handleFiles,
    setUploadedImages,
    uploadedImages,
  } as const;
}

export interface UseDragAndDropProps {
  setFiles: SetFilesFn;
}

export function useDragAndDrop({ setFiles }: UseDragAndDropProps) {
  const uploadBoxRef = React.useRef<HTMLLabelElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const uploadBox = uploadBoxRef.current;
    const input = inputRef.current;

    const changeHandler = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      const target = event.target as HTMLInputElement;
      if (target.files) {
        setFiles(target.files);
      }
    };

    const dropHandler = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        setFiles(event.dataTransfer.files);
      }
    };

    const dragOverHandler = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    uploadBox?.addEventListener('drop', dropHandler);
    uploadBox?.addEventListener('dragover', dragOverHandler);
    input?.addEventListener('change', changeHandler);
    return () => {
      uploadBox?.removeEventListener('drop', dropHandler);
      uploadBox?.removeEventListener('dragover', dragOverHandler);
      input?.removeEventListener('change', changeHandler);
    };
  }, [setFiles]);

  return {
    inputRef,
    uploadBoxRef,
  };
}

export interface ImagePreviewProps {
  onClickToDelete: () => void;
  src: string;
}

function ImagePreview({ onClickToDelete, src }: ImagePreviewProps) {
  return (
    <div className={clsx('relative', 'border-4 border-transparent hover:border-primary')}>
      <img alt="preview" className={clsx('aspect-square', 'min-w-48')} src={src} />
      <button
        className={clsx(
          'absolute -top-4 -right-4',
          'border',
          'bg-cream-1 dark:bg-space-1',
          'rounded-full',
          'shadow-xl',
        )}
        onClick={onClickToDelete}
      >
        <XMarkIcon className="size-6" />
      </button>
    </div>
  );
}

export interface UseImagePreviewProps {
  setUploadedImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  uploadedImages: ImageFile[];
}

export function useImagePreview({ setUploadedImages, uploadedImages }: UseImagePreviewProps) {
  const [PreviewImages, setPreviewImages] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    const ImageNodes = uploadedImages.map((image, index) => {
      const onClickToDelete = () => {
        setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
      };
      return (
        <ImagePreview
          key={index}
          onClickToDelete={onClickToDelete}
          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
        />
      );
    });
    setPreviewImages(ImageNodes);
  }, [setUploadedImages, uploadedImages]);

  return PreviewImages;
}

export interface UseMultipartUploadProps {
  onImageFileUpload: ImageFileUploadFn;
  uploadedImages: ImageFile[];
}

export function useMultipartUpload({ onImageFileUpload, uploadedImages }: UseMultipartUploadProps) {
  const uploadImages = React.useCallback(async () => {
    const uploadFiles = uploadedImages.map((image) => {
      return onImageFileUpload(image);
    });
    return await Promise.all(uploadFiles);
  }, [onImageFileUpload, uploadedImages]);

  return {
    uploadImages,
  } as const;
}
