export interface RGB {
  b: number;
  g: number;
  r: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface Color {
  hex: string;
  hsv: HSV;
  rgb: RGB;
}
