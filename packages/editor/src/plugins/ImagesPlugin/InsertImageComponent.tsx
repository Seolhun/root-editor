import { LexicalEditor } from 'lexical';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { InsertImagePayload, useEditorPluginFunctionsContext } from '~/context/plugin-functions';
import { Button } from '~/ui/Button';
import { DialogActions } from '~/ui/Dialog';
import FileInput from '~/ui/FileInput';
import TextInput from '~/ui/TextInput';

import { INSERT_IMAGE_COMMAND } from './ImagePlugin';
import { ImageUploadBox } from './components';

export interface InsertImageDialogProps {
  activeEditor: LexicalEditor;
  onClose: () => void;
}

export function InsertImageDialog({ activeEditor, onClose }: InsertImageDialogProps) {
  const { image } = useEditorPluginFunctionsContext();
  const { onImageFileUpload } = image;

  const hasModifier = React.useRef(false);

  React.useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [activeEditor]);

  const onClickToInsertImages = (images: InsertImagePayload[]) => {
    images.forEach((payload) => {
      activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    });
    onClose();
  };

  return (
    <ImageUploadBox
      max={10}
      onClose={onClose}
      onConfirm={onClickToInsertImages}
      onImageFileUpload={onImageFileUpload}
    />
  );
}

export interface InsertImageUploadedDialogBodyProps {
  onClick: (payload: InsertImagePayload) => void;
}

export function InsertImageUriDialogBody({ onClick }: InsertImageUploadedDialogBodyProps) {
  const { t } = useTranslation();
  const [src, setSrc] = React.useState('');
  const [altText, setAltText] = React.useState('');

  const isDisabled = src === '';

  return (
    <>
      <TextInput
        data-test-id="image-modal-url-input"
        label="Image URL"
        onChange={setSrc}
        placeholder="i.e. https://source.unsplash.com/random"
        value={src}
      />
      <TextInput
        data-test-id="image-modal-alt-text-input"
        label="Alt Text"
        onChange={setAltText}
        placeholder="Random unsplash image"
        value={altText}
      />
      <DialogActions>
        <Button data-test-id="image-modal-confirm-btn" disabled={isDisabled} onClick={() => onClick({ altText, src })}>
          {t('confirm')}
        </Button>
      </DialogActions>
    </>
  );
}

export function InsertImageUploadedDialogBody({ onClick }: { onClick: (payload: InsertImagePayload) => void }) {
  const { t } = useTranslation();
  const [src, setSrc] = React.useState('');
  const [altText, setAltText] = React.useState('');

  const isDisabled = src === '';

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result);
      }
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <>
      <FileInput accept="image/*" data-test-id="image-modal-file-upload" label="Image Upload" onChange={loadImage} />
      <TextInput
        data-test-id="image-modal-alt-text-input"
        label="Alt Text"
        onChange={setAltText}
        placeholder="Descriptive alternative text"
        value={altText}
      />
      <DialogActions>
        <Button
          data-test-id="image-modal-file-upload-btn"
          disabled={isDisabled}
          onClick={() => onClick({ altText, src })}
        >
          {t('confirm')}
        </Button>
      </DialogActions>
    </>
  );
}
