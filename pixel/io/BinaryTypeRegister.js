export default class BinaryTypeRegister {
  /**
   * Tipos
   *
   * @type {Map<string, BinaryTypeDefinition>}
   */
  #types = new Map()

  /**
   * Constructor
   *
   * @param {Map<string, BinaryTypeDefinition>} types
   */
  constructor(types = new Map()) {
    this.#types = types
  }

  /**
   * Devuelve si está definido el tipo
   *
   * @param {string} type
   * @returns {boolean}
   */
  isRegistered(type) {
    return this.#types.has(type)
  }

  /**
   * Devuelve la definición del tipo.
   *
   * @param {string} type
   * @returns {BinaryTypeDefinition}
   */
  get(type) {
    if (!this.#types.has(type)) {
      throw new Error(`Binary type "${type}" not registered`)
    }
    return this.#types.get(type)
  }

  /**
   * Registra un tipo.
   *
   * @param {string} type
   * @param {BinaryTypeDefinition} definition
   */
  register(type, definition) {
    this.#types.set(type, definition)
  }

  /**
   * Borra un tipo del registro de tipos.
   *
   * @param {string} type
   */
  unregister(type) {
    this.#types.delete(type)
  }
}
