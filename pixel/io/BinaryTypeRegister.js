export default class BinaryTypeRegister {
  /**
   * Types
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
   * Returns whether type is defined
   *
   * @param {string} type
   * @returns {boolean}
   */
  isRegistered(type) {
    return this.#types.has(type)
  }

  /**
   * Returns type definition.
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
   * Registers a type.
   *
   * @param {string} type
   * @param {BinaryTypeDefinition} definition
   */
  register(type, definition) {
    this.#types.set(type, definition)
  }

  /**
   * Removes a type from the types registry.
   *
   * @param {string} type
   */
  unregister(type) {
    this.#types.delete(type)
  }
}
