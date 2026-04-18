/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export type Point = {
  x: number;
  y: number;
};
