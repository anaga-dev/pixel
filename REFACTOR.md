# Refactor

## To Do

- [ ] Rename ImageDataUtils to PixelPerfect and make it to only have rendering functions.
- [ ] Create a ImageDataTransactional so when we start (`startTransaction`):
  - A copy is stored in imageData's memory.
  - We can do all kinds of operations in the current buffer.
  - When we finish (`commit`) another copy of ImageData is generated with all the changes in place. This way we can make `paintOperation` to start in `pointerdown` and finish in `pointerup` in history.
- [ ] Stop using reactivity where it's not necessary.
- [ ] Use `FastImageData` for all rendering functions.
- [ ] Change how color is managed so we can use `rgba` as an integer instead of multiple strings (think about using AssemblyScript and WebAssembly).
- [ ] Finish selection tool.
