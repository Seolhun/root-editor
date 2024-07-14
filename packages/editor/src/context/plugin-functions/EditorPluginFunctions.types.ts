import { ImagePayload } from '~/nodes/ImageNodes';

export type ImageFile = File | string;
export type InsertImagePayload = Readonly<ImagePayload>;
export type ImageFileUploadFn = (image: ImageFile) => Promise<InsertImagePayload>;
