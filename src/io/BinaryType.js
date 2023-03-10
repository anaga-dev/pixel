/**
 * Lista de tipos de dato.
 *
 * @readonly
 * @enum {string}
 */
export const BinaryType = {
  U1: 'u1', /* unsigned char */
  U2: 'u2', /* unsigned short */
  U4: 'u4', /* unsigned long */
  U8: 'u8', /* unsigned long long */

  S1: 's1', /* signed char */
  S2: 's2', /* signed short */
  S4: 's4', /* signed long */
  S8: 's8', /* signed long long */

  F4: 'f4', /* float */
  F8: 'f8', /* double */

  UNSIGNED: 'u',
  SIGNED: 's',
  FLOAT: 'f'
}

export default BinaryType
