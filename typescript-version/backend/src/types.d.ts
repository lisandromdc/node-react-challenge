export interface File {
  file: string;
  lines: Line[];
}
export interface Line {
  text: string;
  number: number;
  hex: string;
}