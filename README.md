# Indie Games Studio

## Music Editor

## Sound Editor

## Tile Editor

## Pixel Editor

### Próximos pasos

- [x] Zoom/posición
  - [x] Usar eventos touch
- [ ] Seleccionar
  - [ ] Forma libre
  - [ ] Rectángulo
  - [ ] Por color
  - [ ] Dibujar selección
  - [ ] Añadir a selección
  - [ ] Eliminar de selección
  - [ ] Transformar selección
- [x] Simetría
  - [x] Horizontal
  - [x] Vertical
  - [x] Ambas
  - [ ] Cambiar la posición de la simetría
- [x] Animación
  - [x] Añadir frame
  - [x] Duplicar frame
  - [ ] Borrar frame
  - [x] Reproducir
  - [ ] Cambiar velocidad de reproducción
  - [x] Siguiente frame
  - [x] Anterior frame
  - [x] Último frame
  - [x]  Primer frame
- [x] Capas
  - [x] Reordenación
  - [x] Dibujado con blending
  - [x] Opciones de capa
  - [ ] Transformación de capa (molaría una opción que sea algo como 'wrapAround')

- [x] Dibujado
  - [x] Elipses con: [Algoritmos de Aseprite](https://github.com/aseprite/aseprite/blob/1eace2489125933f1975def6d5f3eea3344c4dc3/src/doc/algo.cpp) Aunque finalmente use otro (que es peor, tengo que ver cómo lo cambio).

## Hecho

- [x] Utilizar un composable del tipo `usePointer` que nos permita manejar TODOS los eventos del puntero de forma sencilla, pudiendo diferenciar entre punteros, pudiendo diferenciar acciones (mover, arrastrar, rotar, pintar, etc).

### ¿Cómo implementar el dibujado de figuras correctamente?

1. Lo primero es copiar el contenido del `<canvas>`.
2. Una vez que tenemos la copia, lo que hacemos es pintar la línea, el rectángulo o el circulo sobre el `<canvas>`.
3. Cada vez que necesitemos repintar, lo que hacemos es copiar el contenido que ya teníamos, reemplazar el contenido antiguo y repintar encima la figura.

### ¿Cómo implementar el historial?

Imaginemos el siguiente caso: pintar un pixel.

1. Llamamos a la función que nos devolverá el `<canvas>` de la capa sobre la que vamos a pintar.
2. Guardamos una copia de ese `<canvas>`.
3. Añadimos al historial la entrada, algo del tipo: `{ action: 'pencil', layer, canvas }`
4. Pintamos el pixel en el `<canvas>` (no en la copia).

Si quisiésemos hacer un `undo` sería tan fácil como:

1. Comprobar si se puede hacer `undo` (index > 0 && history.length > 0)
2. Obtener el elemento previo del historial.
3. Restaurar el `<canvas>` guardado en
