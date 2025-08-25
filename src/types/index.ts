export interface Element {
  type: 'zone' | 'wall' | 'window' | 'surface';
  id: string;
  name: string;
}

export interface Dimensions {
  width: number;
  length: number;
  height: number;
}

export interface Materials {
  wall: string;
  window: string;
  surface: string;
}

export interface Zone {
  id: string;
  name: string;
  dimensions: Dimensions;
  surfaces: Surface[];
  walls: Wall[];
}

export interface Surface {
  id: string;
  name: string;
  type: 'floor' | 'ceiling' | 'roof';
  vertices: number[][]; // Array of [x, y, z] coordinates
  material: string;
}

export interface Wall {
  id: string;
  name: string;
  vertices: number[][]; // Array of [x, y, z] coordinates
  material: string;
  windows: Window[];
}

export interface Window {
  id: string;
  name: string;
  vertices: number[][]; // Array of [x, y, z] coordinates
  material: string;
}

export interface Model {
  zones: Zone[];
  northAngle: number;
}

// Tipo para o IDF
export interface IdfObject {
  class: string;
  fields: Record<string, string | number>;
}
