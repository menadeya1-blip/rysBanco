import { Almacenamiento } from '../utils/almacenamiento.js';

const CLAVE_SESION = 'rys_sesion_admin';
const CLAVE_INTENTOS = 'rys_intentos_admin';

/**
 * Acceso del administrador a la gestión de usuarios.
 *
 * Simulación: las credenciales van en el código para que el proyecto funcione
 * sin servidor. En un banco real vivirían en el servidor, con la contraseña cifrada.
 * Cambia la contraseña antes de entregar el proyecto.
 */
export class AdministradorService {
  static USUARIO = 'admin';
  static #CLAVE = 'Admin2026*';
  static MAX_INTENTOS = 3;
  static MINUTOS_BLOQUEO = 5;

  static #registro() {
    const datos = Almacenamiento.leerJSON(CLAVE_INTENTOS) ?? { intentos: 0, bloqueadoHasta: 0 };

    if (datos.bloqueadoHasta && Date.now() >= datos.bloqueadoHasta) {
      datos.intentos = 0;
      datos.bloqueadoHasta = 0;
    }

    return datos;
  }

  static estado() {
    const registro = AdministradorService.#registro();
    const restanteMs = Math.max(registro.bloqueadoHasta - Date.now(), 0);

    return {
      intentosRestantes: Math.max(AdministradorService.MAX_INTENTOS - registro.intentos, 0),
      bloqueada: restanteMs > 0,
      segundosBloqueo: Math.ceil(restanteMs / 1000)
    };
  }

  static iniciarSesion(usuario, clave) {
    const estado = AdministradorService.estado();

    if (estado.bloqueada) {
      const minutos = Math.floor(estado.segundosBloqueo / 60);
      const segundos = String(estado.segundosBloqueo % 60).padStart(2, '0');
      throw new Error(`Acceso bloqueado temporalmente. Intenta de nuevo en ${minutos}:${segundos}.`);
    }

    if (usuario === AdministradorService.USUARIO && clave === AdministradorService.#CLAVE) {
      Almacenamiento.guardarJSON(CLAVE_INTENTOS, { intentos: 0, bloqueadoHasta: 0 });
      Almacenamiento.guardar(CLAVE_SESION, 'true');
      return;
    }

    const registro = AdministradorService.#registro();
    registro.intentos += 1;

    if (registro.intentos >= AdministradorService.MAX_INTENTOS) {
      registro.bloqueadoHasta = Date.now() + AdministradorService.MINUTOS_BLOQUEO * 60000;
      Almacenamiento.guardarJSON(CLAVE_INTENTOS, registro);
      throw new Error(
        `Tercer intento fallido. El acceso de administrador quedó bloqueado ${AdministradorService.MINUTOS_BLOQUEO} minutos.`
      );
    }

    Almacenamiento.guardarJSON(CLAVE_INTENTOS, registro);
    const restantes = AdministradorService.MAX_INTENTOS - registro.intentos;
    throw new Error(`Usuario o contraseña incorrectos. Te quedan ${restantes} intento(s).`);
  }

  static estaAutenticado() {
    return Almacenamiento.leer(CLAVE_SESION) === 'true';
  }

  static cerrarSesion() {
    Almacenamiento.borrar(CLAVE_SESION);
  }
}