import React from 'react';

import Modal from './Modal';

export type UseModalReturns = [
  JSX.Element | null,
  (title: string, showModal: (onClose: () => void) => JSX.Element) => void,
];

function useModal(): UseModalReturns {
  const [modalContent, setModalContent] = React.useState<{
    closeOnClickOutside: boolean;
    content: JSX.Element;
    title: string;
  } | null>(null);

  const onClose = React.useCallback(() => {
    setModalContent(null);
  }, []);

  const ModalElement = React.useMemo(() => {
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
