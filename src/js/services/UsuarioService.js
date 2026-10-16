import { BancoSistema } from './BancoSistema.js';
import { Cliente } from '../models/Cliente.js';
import { Validaciones } from '../utils/validaciones.js';
import { GeneradorProducto } from '../utils/generadorProducto.js';

/**
 * CRUD de usuarios: agregar (registro o administración), editar y eliminar.
 */
export class UsuarioService {
  static listar() {
    return BancoSistema.instancia.clientes;
  }

  static buscar(usuario) {
    return BancoSistema.instancia.buscarPorUsuario(usuario);
  }

  /** Crea el cliente y abre automáticamente el producto elegido, con su número único. */
  static registrar(datos) {
    UsuarioService.#validarDatos(datos);

    const cliente = new Cliente(datos);
    const producto = BancoSistema.crearProducto(datos.producto, UsuarioService.#numeroUnico());
    cliente.agregarCuenta(producto);

    return BancoSistema.instancia.agregarCliente(cliente);
  }

  static editar(usuario, datos) {
    const cliente = UsuarioService.#existente(usuario);
    cliente.actualizarDatos(datos);
    BancoSistema.instancia.guardar();
    return cliente;
  }

  static eliminar(usuario) {
    BancoSistema.instancia.eliminarCliente(usuario);
  }

  /** Abre un producto adicional a un cliente existente. Solo un producto de cada tipo. */
  static abrirProducto(usuario, tipoProducto) {
    const cliente = UsuarioService.#existente(usuario);
    const producto = BancoSistema.crearProducto(tipoProducto, UsuarioService.#numeroUnico());

    if (cliente.cuentas.some((cuenta) => cuenta.tipo === producto.tipo)) {
      throw new Error(`Ya tienes un producto de tipo "${producto.tipo}". Solo puedes tener uno de cada tipo.`);
    }

    cliente.agregarCuenta(producto);
    BancoSistema.instancia.guardar();
    return producto;
  }

  /** Genera un número de producto que no exista en ningún otro producto del banco. */
  static #numeroUnico() {
    let numero = GeneradorProducto.generar();
    while (BancoSistema.instancia.buscarCuentaPorNumero(numero)) {
      numero = GeneradorProducto.generar();
    }
    return numero;
  }

  static #existente(usuario) {
    const cliente = BancoSistema.instancia.buscarPorUsuario(usuario);
    if (!cliente) {
      throw new Error('El usuario no existe.');
    }
    return cliente;
  }

  static #usuarioValido(usuario) {
    return /^[A-Za-z0-9_.]{4,20}$/.test(usuario ?? '');
  }

  static #validarDatos(datos) {
    if (!Validaciones.nombre(datos.nombres) || !Validaciones.nombre(datos.apellidos)) {
      throw new Error('Nombres y apellidos deben tener al menos 2 letras.');
    }
    if (!Validaciones.documento(datos.tipoDocumento, datos.numeroDocumento)) {
      throw new Error('El número de documento no es válido para el tipo seleccionado.');
    }
    if (!Validaciones.celular(datos.celular)) {
      throw new Error('El celular debe tener 10 dígitos y empezar por 3.');
    }
    if (!Validaciones.correo(datos.correo)) {
      throw new Error('El correo electrónico no es válido.');
    }
    if (!UsuarioService.#usuarioValido(datos.usuario)) {
      throw new Error('El usuario debe tener entre 4 y 20 letras, números, punto o guion bajo.');
    }
    if ((datos.contrasena ?? '').length < 8) {
      throw new Error('La contraseña debe tener mínimo 8 caracteres.');
    }
  }
}