import React from 'react';

import Modal from './Modal';

export type UseModalReturns = [
  JSX.Element | null,
  (title: string, showModal: (onClose: () => void) => JSX.Element) => void,
];

function useModal(): UseModalReturns {
  const [modalContent, setModalContent] = React.useState<null | {
    closeOnClickOutside: boolean;
    content: JSX.Element;
    title: string;
  }>(null);

  const onClose = React.useCallback(() => {
    setModalContent(null);
  }, []);

  const ModalElement = React.useMemo(() => {
    if (modalContent === null) {
      return null;
    }
    const { title, content, closeOnClickOutside } = modalContent;
    return (
      <Modal onClose={onClose} title={title} closeOnClickOutside={closeOnClickOutside}>
        {content}
      </Modal>
    );
  }, [modalContent, onClose]);

  const showModal = React.useCallback(
    (
      title,
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

  return [ModalElement, showModal];
}

export { useModal };
export default useModal;
