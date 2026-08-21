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
    setTimeout(() => cb(performance.now()), 0)) as unknown as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) =>
    clearTimeout(id)) as unknown as typeof cancelAnimationFrame;
}

// jsdom does not implement layout APIs that ProseMirror/TipTap rely on.
Element.prototype.scrollIntoView = () => undefined;

const rectStub: DOMRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  toJSON: () => ({}),
};

const rectListStub = {
  length: 0,
  item: (): null => null,
  [Symbol.iterator]: function* (): Generator<DOMRect, void, unknown> {
    /* no rects */
  },
} as unknown as DOMRectList;

const getClientRectsStub = (): DOMRectList => rectListStub;
const getBoundingClientRectStub = (): DOMRect => rectStub;

// jsdom lacks layout APIs; assign on Element and Range (the types that declare these).
Element.prototype.getClientRects = getClientRectsStub;
Element.prototype.getBoundingClientRect = getBoundingClientRectStub;
// ProseMirror/TipTap call getClientRects/getBoundingClientRect on a Range, not a Node.
Range.prototype.getClientRects = getClientRectsStub;
Range.prototype.getBoundingClientRect = getBoundingClientRectStub;
