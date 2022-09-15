export interface File {
  file: string;
  lines: Line[];
}
export interface Line {
  text: string;
  number: number;
  hex: string;
}
export interface LineWithFileName extends Line {
  file: string;
}