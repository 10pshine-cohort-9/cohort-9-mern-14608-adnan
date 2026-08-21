import { TextEncoder, TextDecoder } from "util";

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

import "@testing-library/jest-dom";

if (typeof globalThis.requestAnimationFrame !== "function") {
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 0)) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) =>
    clearTimeout(id)) as typeof cancelAnimationFrame;
}

// jsdom does not implement layout APIs that ProseMirror/TipTap rely on.
Element.prototype.scrollIntoView = () => undefined;
const rectListStub = {
  length: 0,
  item: () => null,
  [Symbol.iterator]: function* () {
    /* no rects */
  },
} as unknown as DOMRectList;
const rectStub = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as unknown as DOMRect;
const getClientRectsStub = function () {
  return rectListStub;
};
const getBoundingClientRectStub = function () {
  return rectStub;
};
(Node.prototype as unknown as { getClientRects: typeof getClientRectsStub }).getClientRects =
  getClientRectsStub;
(
  Node.prototype as unknown as { getBoundingClientRect: typeof getBoundingClientRectStub }
).getBoundingClientRect = getBoundingClientRectStub;
// Overwrite jsdom's own Element implementations too (they sit closer in the prototype chain).
const ElementProto = Element.prototype as unknown as {
  getClientRects: typeof getClientRectsStub;
  getBoundingClientRect: typeof getBoundingClientRectStub;
};
ElementProto.getClientRects = getClientRectsStub;
ElementProto.getBoundingClientRect = getBoundingClientRectStub;
// ProseMirror/TipTap call getClientRects/getBoundingClientRect on a Range, not a Node.
const RangeProto = Range.prototype as unknown as {
  getClientRects: typeof getClientRectsStub;
  getBoundingClientRect: typeof getBoundingClientRectStub;
};
RangeProto.getClientRects = getClientRectsStub;
RangeProto.getBoundingClientRect = getBoundingClientRectStub;
