import { Almacenamiento } from '../utils/almacenamiento.js';

const CLAVE_CODIGOS = 'rys_codigos_seguridad';

/**
 * Códigos de un solo uso para operaciones sensibles (por ejemplo, retiros).
 *
 * - Cada código vence a los pocos minutos.
 * - Se bloquea después de varios intentos fallidos.
 * - Se elimina al usarse: no puede reutilizarse.
 * - Guarda la operación (cuenta y monto) al solicitar el código, así que
 *   no se puede cambiar el monto después de pedirlo.
 *
 * Simulación: no hay SMS real, por eso el código se muestra en pantalla.
 */
export class CodigoSeguridadService {
  static TIEMPO_MINUTOS = 5;
  static MAX_INTENTOS = 3;

  static #todos() {
    return Almacenamiento.leerJSON(CLAVE_CODIGOS) ?? {};
  }

  static #guardar(todos) {
    Almacenamiento.guardarJSON(CLAVE_CODIGOS, todos);
  }

  static #generar() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /** Crea un código nuevo y reemplaza cualquier código anterior del usuario. */
  static solicitar(usuario, operacion, datos) {
    const llave = usuario.toLowerCase();
    const codigo = CodigoSeguridadService.#generar();
    const todos = CodigoSeguridadService.#todos();

    todos[llave] = {
      codigo,
      operacion,
      datos,
      expira: Date.now() + CodigoSeguridadService.TIEMPO_MINUTOS * 60000,
      intentos: 0
    };

    CodigoSeguridadService.#guardar(todos);
    return codigo;
  }

  /**
   * Valida el código. Si es correcto, lo elimina (único uso) y devuelve
   * los datos guardados al solicitarlo.
   */
  static validar(usuario, operacion, codigoIngresado) {
    const llave = usuario.toLowerCase();
    const todos = CodigoSeguridadService.#todos();
    const registro = todos[llave];

    if (!registro || registro.operacion !== operacion) {
      throw new Error('No hay un código activo para esta operación. Solicita uno nuevo.');
    }

    if (Date.now() > registro.expira) {
      delete todos[llave];
      CodigoSeguridadService.#guardar(todos);
      throw new Error('El código venció. Solicita uno nuevo.');
    }

    if (String(codigoIngresado ?? '').trim() !== registro.codigo) {
      registro.intentos += 1;

      if (registro.intentos >= CodigoSeguridadService.MAX_INTENTOS) {
        delete todos[llave];
        CodigoSeguridadService.#guardar(todos);
        throw new Error('Código incorrecto. Se agotaron los intentos; solicita uno nuevo.');
      }

      CodigoSeguridadService.#guardar(todos);
      const restantes = CodigoSeguridadService.MAX_INTENTOS - registro.intentos;
      throw new Error(`Código incorrecto. Te quedan ${restantes} intento(s).`);
    }

    delete todos[llave];
    CodigoSeguridadService.#guardar(todos);
    return registro.datos;
  }

  static cancelar(usuario) {
    const todos = CodigoSeguridadService.#todos();
    delete todos[usuario.toLowerCase()];
    CodigoSeguridadService.#guardar(todos);
  }
}