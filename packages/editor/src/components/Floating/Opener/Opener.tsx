import { OpenerContent } from './Opener.Content';
import { OpenerRoot } from './Opener.Root';
import { OpenerTrigger } from './Opener.Trigger';

export const Opener = Object.assign(OpenerRoot, {
  Content: OpenerContent,
  Trigger: OpenerTrigger,
});
