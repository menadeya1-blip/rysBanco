import { BancoSistema } from './BancoSistema.js';
import { Almacenamiento } from '../utils/almacenamiento.js';

const CLAVE_INTENTOS = 'rys_intentos_login';
const CLAVE_SESION = 'rys_sesion_usuario';

/**
 * Inicio de sesión: valida credenciales, cuenta los intentos fallidos por usuario,
 * bloquea la cuenta al tercer fallo y mantiene la sesión activa.
 */
export class AutenticacionService {
  static MAX_INTENTOS = 3;
  static MINUTOS_BLOQUEO = 5;

  /** Lee el registro de intentos del usuario y reinicia el bloqueo si ya venció. */
  static #registro(usuario) {
    const todos = Almacenamiento.leerJSON(CLAVE_INTENTOS) ?? {};
    const clave = (usuario ?? '').trim().toLowerCase();
    const actual = { ...(todos[clave] ?? { intentos: 0, bloqueadoHasta: 0 }) };

    if (actual.bloqueadoHasta && Date.now() >= actual.bloqueadoHasta) {
      actual.intentos = 0;
      actual.bloqueadoHasta = 0;
    }

    return { todos, clave, actual };
  }

  static #escribir(todos, clave, actual) {
    todos[clave] = actual;
    Almacenamiento.guardarJSON(CLAVE_INTENTOS, todos);
  }

  /** Estado visible para la pantalla de login: intentos restantes y tiempo de bloqueo. */
  static estado(usuario) {
    const { actual } = AutenticacionService.#registro(usuario);
    const restanteMs = Math.max(actual.bloqueadoHasta - Date.now(), 0);

    return {
      intentosRestantes: Math.max(AutenticacionService.MAX_INTENTOS - actual.intentos, 0),
      bloqueada: restanteMs > 0,
      segundosBloqueo: Math.ceil(restanteMs / 1000)
    };
  }

  static iniciarSesion(usuario, clave) {
    const estado = AutenticacionService.estado(usuario);

    if (estado.bloqueada) {
      const minutos = Math.floor(estado.segundosBloqueo / 60);
      const segundos = String(estado.segundosBloqueo % 60).padStart(2, '0');
      throw new Error(`Cuenta bloqueada temporalmente. Intenta de nuevo en ${minutos}:${segundos}.`);
    }

    const cliente = BancoSistema.instancia.buscarPorUsuario(usuario);
    const { todos, clave: llave, actual } = AutenticacionService.#registro(usuario);

    if (cliente && cliente.verificarContrasena(clave)) {
      AutenticacionService.#escribir(todos, llave, { intentos: 0, bloqueadoHasta: 0 });
      Almacenamiento.guardar(CLAVE_SESION, cliente.usuario);
      return cliente;
    }

    // No se revela si el usuario existe: el fallo cuenta igual.
    actual.intentos += 1;

    if (actual.intentos >= AutenticacionService.MAX_INTENTOS) {
      actual.bloqueadoHasta = Date.now() + AutenticacionService.MINUTOS_BLOQUEO * 60000;
      AutenticacionService.#escribir(todos, llave, actual);
      throw new Error(
        `Tercer intento fallido. La cuenta quedó bloqueada ${AutenticacionService.MINUTOS_BLOQUEO} minutos.`
      );
    }

    AutenticacionService.#escribir(todos, llave, actual);
    const restantes = AutenticacionService.MAX_INTENTOS - actual.intentos;
    throw new Error(`Usuario o contraseña incorrectos. Te quedan ${restantes} intento(s).`);
  }

  static clienteActual() {
    const usuario = Almacenamiento.leer(CLAVE_SESION);
    return usuario ? BancoSistema.instancia.buscarPorUsuario(usuario) : null;
  }

  static cerrarSesion() {
    Almacenamiento.borrar(CLAVE_SESION);
  }

  static cambiarContrasena(cliente, claveActual, claveNueva, confirmacion) {
    cliente.cambiarContrasena(claveActual, claveNueva, confirmacion);
    BancoSistema.instancia.guardar();
  }
}