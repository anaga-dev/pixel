# Refactor

## To Do

- [ ] Renombrar ImageDataUtils a PixelPerfect y que sólo contenga las funciones de pintado.
- [ ] Crear un ImageDataTransaccional, es decir, que al arrancar (`startTransaction`) se guarde una copia en memoria del ImageData, que en el buffer actual se puedan realizar todo tipo de operaciones y que cuando se termine (`commit`) genere otra copia del ImageData con todos los cambios aplicados. De esta forma podremos hacer en el history que el `paintOperation` pueda empezar en el `pointerdown` y terminar en el `pointerup`.
- [ ] Dejar de usar reactividad donde no es necesaria.
- [ ] Utilizar `FastImageData` para todas las operaciones de pintado.
- [ ] Cambiar la forma en la que funciona todo el tema de los colores para que no haya que estar usando cadenas de texto todo el rato y se pueda utilizar el valor `rgba` como un entero (mirar si tiene sentido implementar con AssemblyScript y WebAssembly).
- [ ] Terminar de implementar la selección.

