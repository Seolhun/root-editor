import { createCommand, LexicalCommand } from 'lexical';

export const SPEECH_TO_TEXT_COMMAND: LexicalCommand<boolean> = createCommand('SPEECH_TO_TEXT_COMMAND');

export const SUPPORT_SPEECH_RECOGNITION: boolean = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
