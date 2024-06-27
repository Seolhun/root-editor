import { useCallback, useMemo, useState } from 'react';
import * as React from 'react';

import { Modal } from '../ui/Modal';

export function useModal(): [
  JSX.Element | null,
  (title: string, showModal: (onClose: () => void) => JSX.Element) => void,
] {
  const [modalContent, setModalContent] = useState<{
    closeOnClickOutside: boolean;
    content: JSX.Element;
    title: string;
  } | null>(null);

  const onClose = useCallback(() => {
    setModalContent(null);
  }, []);

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null;
    }
    const { closeOnClickOutside, content, title } = modalContent;
    return (
      <Modal closeOnClickOutside={closeOnClickOutside} onClose={onClose} title={title}>
        {content}
      </Modal>
    );
  }, [modalContent, onClose]);

  const showModal = useCallback(
    (
      title: string,
      // eslint-disable-next-line no-shadow
      getContent: (onClose: () => void) => JSX.Element,
      closeOnClickOutside = false,
    ) => {
      setModalContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      });
    },
    [onClose],
  );

  return [modal, showModal];
}
