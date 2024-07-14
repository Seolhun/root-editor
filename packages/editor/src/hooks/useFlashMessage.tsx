import { type ShowFlashMessage, useFlashMessageContext } from '../context/flash-message';

export default function useFlashMessage(): ShowFlashMessage {
  return useFlashMessageContext();
}
