# Historias de usuario — &rys Banco

Formato: **Como** [rol], **quiero** [acción], **para** [beneficio]. Cada historia tiene criterios de aceptación que indican cuándo se considera terminada.

Roles: **Cliente** (persona con cuenta) y **Administrador** (gestiona usuarios del banco).

---

## 1. Registro y acceso

### HU-01 · Registrarme
Como **cliente nuevo**, quiero registrarme con mis datos personales, para tener una cuenta en el banco.

Criterios de aceptación:
- Pido nombre, documento, usuario, contraseña y confirmación de contraseña.
- El documento y el usuario no pueden repetirse.
- La contraseña y su confirmación deben coincidir.
- Si hay errores, se muestran junto al campo que los causa.
- Al terminar, puedo ingresar con mi usuario y contraseña.

### HU-02 · Ingresar al banco
Como **cliente**, quiero ingresar con mi usuario y contraseña, para ver mis productos.

Criterios de aceptación:
- Si la contraseña es incorrecta, veo cuántos intentos me quedan (3 en total).
- Después de 3 intentos fallidos, el acceso se bloquea 5 minutos y veo el tiempo restante.
- Si no tengo sesión activa, al entrar al panel me lleva al login.

### HU-03 · Cerrar sesión
Como **cliente**, quiero cerrar mi sesión desde el menú, para que nadie más use mi cuenta en este equipo.

Criterios de aceptación:
- La opción "Cerrar sesión" está en el menú.
- Al cerrar sesión, vuelvo al login y el panel ya no es accesible sin ingresar de nuevo.

---

## 2. Perfil

### HU-04 · Ver mis datos personales
Como **cliente**, quiero ver mis datos personales, para confirmar que están bien.

Criterios de aceptación:
- Veo nombre, documento, usuario y datos de contacto.
- El documento no se puede editar.

### HU-05 · Cambiar mi contraseña
Como **cliente**, quiero cambiar mi contraseña, para proteger mi cuenta.

Criterios de aceptación:
- Pido usuario, contraseña actual, contraseña nueva y confirmación.
- La contraseña actual debe ser correcta.
- La nueva contraseña y su confirmación deben coincidir.
- Al guardar, veo un mensaje de confirmación.

---

## 3. Productos

### HU-06 · Ver mis productos
Como **cliente**, quiero elegir uno de mis productos, para ver su saldo y su número.

Criterios de aceptación:
- En el panel hay un selector con mis productos (ahorros, corriente, tarjeta de crédito).
- Veo el saldo (o la deuda, en la tarjeta) y el número del producto.
- Puedo ver el número completo y ocultar el monto.

### HU-07 · Abrir un producto nuevo
Como **cliente**, quiero abrir otro producto, para usar otros servicios del banco.

Criterios de aceptación:
- Elijo el tipo de producto en la sección "Abrir otro producto".
- No puedo abrir dos productos del mismo tipo: los tipos que ya tengo aparecen deshabilitados.
- El número del producto tiene 16 dígitos y es único.

---

## 4. Consignar y pagar

### HU-08 · Consignar dinero
Como **cliente**, quiero consignar dinero en mi cuenta de ahorros o corriente, para aumentar mi saldo.

Criterios de aceptación:
- El monto debe ser mayor que cero.
- El saldo aumenta por el monto consignado.
- La consignación queda registrada en los movimientos.

### HU-09 · Abonar a mi tarjeta de crédito
Como **cliente con tarjeta**, quiero consignar en mi tarjeta, para reducir mi deuda.

Criterios de aceptación:
- El botón dice "Consignar (abona a la deuda)".
- El valor consignado reduce la deuda pendiente.
- El abono queda registrado en los movimientos.

---

## 5. Retirar

### HU-10 · Retirar dinero
Como **cliente**, quiero retirar dinero de mi cuenta, para tener efectivo.

Criterios de aceptación:
- **Ahorros:** el límite de retiro es mi saldo. Al retirar se aplica un interés mensual del 1,5 % sobre el saldo, calculado en el momento del retiro. El interés no es un cobro aparte.
- **Corriente:** puedo retirar hasta el saldo más un 20 % de sobregiro (saldo × 1,2).
- **Tarjeta de crédito:** no permite retiro en efectivo; el panel muestra un mensaje que lo explica.
- Si el monto supera el límite, no se hace el retiro y veo el motivo.

### HU-11 · Confirmar el retiro con código
Como **cliente**, quiero confirmar cada retiro con un código, para que nadie retire mi dinero sin mi autorización.

Criterios de aceptación:
- Al pedir un retiro, se genera un código de 6 dígitos.
- El código es de un solo uso y vence en 5 minutos.
- Tengo 3 intentos para escribir el código correcto.
- Si se vence o se agotan los intentos, debo pedir un código nuevo.

---

## 6. Transferir y comprar a cuotas

### HU-12 · Transferir entre mis productos
Como **cliente**, quiero pasar dinero de un producto a otro, para organizar mi dinero.

Criterios de aceptación:
- En "Mis productos…" elijo el producto de destino y se llena el campo.
- No puedo transferir al mismo tipo de producto.
- El monto sale de un producto y entra en el otro, y ambos movimientos quedan registrados.

### HU-13 · Transferir a otro cliente
Como **cliente**, quiero enviar dinero a la cuenta de otra persona, para pagarle.

Criterios de aceptación:
- Escribo el número de 16 dígitos del destino. Los espacios se ignoran al validar.
- Si el número no existe, veo "La cuenta de destino no existe".
- No puedo transferir a mi misma cuenta.
- Los dos movimientos quedan registrados.

### HU-14 · Comprar a cuotas con la tarjeta
Como **cliente con tarjeta**, quiero financiar una compra en cuotas, para pagarla poco a poco.

Criterios de aceptación:
- La compra no puede superar el cupo disponible.
- La tasa depende del número de cuotas: 1 a 2 cuotas sin interés; 3 a 6 cuotas, 1,9 %; 7 o más, 2,3 %.
- Veo el valor de la cuota mensual antes de confirmar.
- La cuota mensual aparece en la descripción del movimiento.

---

## 7. Servicios

### HU-15 · Pagar una factura
Como **cliente**, quiero pagar una factura con su número de referencia, para no ir a una sucursal.

Criterios de aceptación:
- El número de referencia es obligatorio.
- En ahorros o corriente, el pago descuenta el valor del saldo y no tiene interés.
- Si no tengo saldo suficiente, veo el error junto al formulario.
- Con la tarjeta, el pago se registra como una compra de 1 cuota.

### HU-16 · Comprar el SOAT
Como **cliente**, quiero comprar el SOAT de mi vehículo desde el banco.

Criterios de aceptación:
- La placa tiene formato válido (ABC12D o ABC123).
- Elijo el tipo de vehículo: moto ($350.000), automóvil ($600.000) o camioneta ($800.000). Son valores de simulación.
- El valor se cobra del producto elegido y queda registrado con la placa.
- Si no tengo saldo suficiente, veo el error junto al formulario.

---

## 8. Movimientos

### HU-17 · Ver mis movimientos
Como **cliente**, quiero ver el historial de un producto, para revisar mis operaciones.

Criterios de aceptación:
- Cada movimiento muestra fecha, tipo, descripción, monto y saldo resultante.
- Los movimientos aparecen del más reciente al más antiguo.
- Los intereses y las cuotas aparecen como movimientos propios.

---

## 9. Administrador

### HU-18 · Ingresar como administrador
Como **administrador**, quiero ingresar con mi usuario y contraseña, para gestionar usuarios.

Criterios de aceptación:
- Tiene las mismas reglas de intentos y bloqueo que HU-02.
- Si entro a la pantalla de usuarios sin ser administrador, me redirige al ingreso de administrador.

### HU-19 · Gestionar usuarios
Como **administrador**, quiero ver, editar y eliminar usuarios, para mantener la información del banco.

Criterios de aceptación:
- Veo los usuarios en una tabla.
- Al editar, los datos se cargan en el formulario.
- Antes de eliminar, aparece un cuadro de confirmación.
- Puedo cerrar mi sesión de administrador.

---

## 10. Requisitos generales

### HU-20 · Usar la app en cualquier pantalla
Como **cliente**, quiero usar el banco desde el computador, la tableta o el celular, para hacer operaciones desde donde esté.

Criterios de aceptación:
- El diseño se adapta a escritorio (1024 px o más), tableta (768 px) y celular (380 px o menos).
- En pantallas pequeñas, el menú se abre con el botón de hamburguesa.
- No aparece desplazamiento horizontal.

### HU-21 · Entender los errores
Como **cliente**, quiero ver mensajes claros cuando algo falla, para saber qué corregir.

Criterios de aceptación:
- Cada error dice qué pasó y qué debo hacer.
- Si una operación falla, mis datos y mi saldo no cambian.

---

## 11. Página de inicio

### HU-22 · Conocer el banco
Como **visitante**, quiero ver la página de inicio con la presentación del banco, para entender qué ofrece antes de registrarme.

Criterios de aceptación:
- Veo el nombre del banco y el texto de presentación.
- Veo imágenes de persona y de promociones, y un espacio para una promoción.
- Veo una simulación de tarjeta con cupo de ejemplo, rotulada como simulación.

### HU-23 · Ir a crear cuenta o ingresar desde el inicio
Como **visitante**, quiero ver los botones "Crear cuenta" e "Iniciar sesión" en el encabezado, para entrar al banco con un clic.

Criterios de aceptación:
- "Iniciar sesión" es el botón principal y está visible en todas las pantallas.
- En celular, "Crear cuenta" y "Sobre nosotros · Términos" van dentro del menú de hamburguesa.

### HU-24 · Consultar beneficios y contacto
Como **visitante**, quiero ver los beneficios, los términos y los datos de contacto, para resolver mis dudas.

Criterios de aceptación:
- Veo el bloque "Beneficios y descuentos".
- El pie muestra términos y condiciones, PQR, redes sociales, ubicaciones, líneas de atención y soluciones.
- En celular, el pie se muestra en una o dos columnas.
