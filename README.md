# &rys Banco 🏦

> **Tu dinero, con estilo.** Una aplicación bancaria web, responsive (computador, tablet y celular), creada con JavaScript orientado a objetos.

**Creadora:** Deyaneira Gutierrez Mena
**Programa:** Estudiante de segundo semestre · CESDE
**Docente:** Jorge Albeiro Muriel

---

## ✨ Presentación

&rys Banco nace con una idea sencilla: que manejar tu dinero sea claro, rápido y bonito. Desde el celular, la tablet o el computador puedes:

- Abrir tu **cuenta de ahorros**, tu **cuenta corriente** o una **tarjeta de crédito** en minutos.
- **Consignar, retirar y transferir** dinero, incluso a otros usuarios del banco.
- **Pagar facturas** y **comprar el SOAT** de tu vehículo.
- Comprar a **cuotas** con tu tarjeta, viendo antes la cuota mensual y las tasas.
- Revisar tus **movimientos** ordenados del más reciente al más antiguo.
- Mantener tu cuenta segura con **contraseñas**, **bloqueo tras 3 intentos** y **códigos de un solo uso** para retirar dinero.

Los colores de la marca son el **azul rey** y el **violeta**, que se mezclan en el fondo, las tarjetas de producto y los botones.

---

## 🧩 Funcionalidades

| Módulo | Qué hace |
|---|---|
| **Landing** | Menú, presentación de productos, sección institucional y pie de página con redes. |
| **Registro** | Crea el cliente con usuario, nombre, documento, celular y contraseña (con confirmación). Abre el producto elegido con un **número único de 16 dígitos**. |
| **Login** | Usuario y contraseña. **Máximo 3 intentos**, contador visible y bloqueo de 5 minutos. |
| **Panel** | Saldo, consignar, retirar (con código de un solo uso), transferir, pagar facturas, comprar SOAT, compra a cuotas y movimientos. |
| **Mi perfil** | Editar datos personales y cambiar contraseña (usuario → clave actual → clave nueva → confirmación). |
| **Administración** | Acceso de administrador para crear, editar y eliminar usuarios, con confirmación antes de eliminar. |

### Reglas del negocio

| Producto | Regla |
|---|---|
| **Cuenta de ahorros** | Interés mensual del **1,5 %**, calculado y aplicado en el momento del retiro. El monto a retirar no puede superar el saldo disponible. |
| **Cuenta corriente** | Permite **sobregiro del 20 %** sobre el saldo. |
| **Tarjeta de crédito** | Cupo inicial de **$5.000.000**. Consignar **abona a la deuda**. No permite retiros en efectivo. |
| **Compra a cuotas** | ≤ 2 cuotas: **0 %** · 3 a 6 cuotas: **1,9 %** · ≥ 7 cuotas: **2,3 %** (tasas mensuales). |
| **Productos por cliente** | Un cliente puede tener un producto de cada tipo: ahorros, corriente y tarjeta. |
| **Transferencias** | Entre productos propios (por ejemplo, de ahorros a corriente) o a cuentas de otros usuarios de cualquier tipo. **No se permite transferir al mismo producto.** |
| **Retiros** | Requieren un **código de un solo uso** de 6 dígitos, que vence en 5 minutos y tiene 3 intentos. |

---

## 📋 Historias de usuario y maquetación

Las **historias de usuario** están en [`docs/historias-de-usuario.md`](docs/historias-de-usuario.md): 24 historias en formato "Como… quiero… para…", cada una con criterios de aceptación.

La **maquetación** en blanco y negro está en `docs/maquetacion/png/`. Cada pantalla tiene una imagen para escritorio, tableta y celular.

### Página de inicio

![Página de inicio en escritorio](docs/maquetacion/png/inicio-escritorio.png)

### Ingreso (login)

![Login en escritorio](docs/maquetacion/png/maquetacion-login-escritorio.png)

### Panel principal

![Panel principal en escritorio](docs/maquetacion/png/maquetacion-panel-principal-escritorio.png)

### Perfil

![Perfil en escritorio](docs/maquetacion/png/maquetacion-perfil-escritorio.png)

### Administración de usuarios

![Administración de usuarios en escritorio](docs/maquetacion/png/maquetacion-admin-escritorio.png)

Las versiones de tableta (`-tableta.png`) y celular (`-celular.png`) de cada pantalla están en la misma carpeta.

---

## 🛠️ Tecnologías utilizadas

- **HTML5** semántico para la estructura de cada página.
- **CSS3** con variables (`:root`), Flexbox, CSS Grid, animaciones y diseño responsive con *media queries* (1024 px, 900 px, 768 px, 600 px y 380 px).
- **JavaScript ES2022** con **módulos** (`import` / `export`), **clases**, **campos privados** (`#`), *getters*, miembros `static` y `new.target`.
- **localStorage** para guardar los datos en el navegador, con un envoltorio `try/catch` para no fallar si el navegador lo bloquea.
- **Visual Studio Code** + **Live Server** para ejecutar el proyecto.
- **Git** y **GitHub** para el control de versiones.
- **Diagrams** para el diagrama UML.


## 🧬 Programación orientada a objetos
El proyecto alica los 4 principios del POO,(Herencia,Polimorfismo,Encapsulamiento,Abstrabcion)


## 🚀 Cómo ejecutar el proyecto

1. Descarga o clona el repositorio.
2. Abre la carpeta `rysBanco` en **Visual Studio Code**.
3. Haz clic derecho en `index.html` y elige **Open with Live Server**.
4. Crea una cuenta en **Crear cuenta**, luego inicia sesión.
5. Para administrar usuarios, abre `admin.html` y entra con el usuario y la contraseña de administrador.


## 👩‍💻 Autora

**Deyaneira Gutierrez Mena**
Estudiante de segundo semestre · CESDE
Creadora de &rys Banco

*Hecho con 💜 y 💙 para aprender programación orientada a objetos.*
