# 🏋️ GymApp - Sistema de Gestión de Gimnasio

Sistema completo de gestión para gimnasios con autenticación de usuarios, control de acceso basado en roles y gestión integral de clientes, membresías y pagos.

## 📋 Descripción

**GymApp** es una aplicación web desarrollada en **Node.js** con **Express.js** para la gestión integral de un gimnasio. Esta aplicación permite administrar clientes, membresías y pagos de manera eficiente y organizada.

### 🎯 Propósito
Este proyecto fue desarrollado como asignatura universitaria para la materia de **Backend**, demostrando la implementación de una base de datos relacional en MySQL y operaciones CRUD con sus debidos Endpoints. En su última actualización, se añadieron características de login demostrando el manejo del cifrado de contraseñas y de los JWT.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **JWT (JSON Web Tokens)** para gestión segura de sesiones
- **Bcrypt** para cifrado seguro de contraseñas
- **Roles diferenciados**: Administradores y Clientes
- **Cookies seguras** para persistencia de sesión

### 👥 Gestión de Usuarios
- **Clientes**: Registro, login y acceso a información personal
- **Administradores**: Acceso completo al sistema
- **Perfiles personalizados** según el rol del usuario

### 💳 Gestión de Pagos
- **Número de confirmación obligatorio** para todos los pagos
- **Métodos de pago**: Efectivo, Tarjeta, Transferencia
- **Historial completo** de transacciones
- **Validaciones** para evitar duplicados

### 🎫 Gestión de Membresías
- **Tipos**: Mensual, Trimestral, Semestral, Anual
- **Estados**: Activa, Vencida, Cancelada
- **Control de fechas** de inicio y vencimiento

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MySQL
- **Motor de Vistas**: EJS
- **Estilos**: CSS personalizado
- **ORM**: mysql2 para conexiones a base de datos

## 📦 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/HectViz/GymApp-BackendSQL.git
   cd GymApp-BackendSQL
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno a la preferencia**
   ```bash
   .env
   ```

Editar el archivo `.env` con tus configuraciones:
```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=gymapp
DB_PORT=3306

# Configuración JWT
JWT_SECRET=clave_que_quisieras_poner
JWT_EXPIRES_IN=24h

# Configuración del Admin por defecto
DEFAULT_ADMIN_EMAIL=admin@gymapp.com
DEFAULT_ADMIN_PASSWORD=admin123

# Configuración del servidor
PORT=3000
NODE_ENV=development
```

4. **Crear la base de datos**
   ```sql
   CREATE DATABASE gymapp;
   ```

5. **Inicializar la aplicación**
   ```bash
   npm start
   ```

6. **Acceder a la aplicación**
   - Abrir el navegador en: `http://localhost:3000`

## 🚀 Uso de la Aplicación

### Página Principal
La aplicación cuenta con una interfaz principal. Dependiendo del rol que tenga asignado la cuenta con la que hagas log in, esta mostrará tres módulos principales:
- **Clientes**: Gestión de información de clientes
- **Membresías**: Control de suscripciones
- **Pagos**: Administración de transacciones

### Funcionalidades por Módulo

#### Clientes (`/clientes`)
- **Listar**: Ver todos los clientes registrados
- **Crear**: Agregar nuevos clientes
- **Ver Detalle**: Información completa del cliente
- **Editar**: Modificar datos del cliente

#### Membresías (`/membresias`)
- **Listar**: Ver todas las membresías
- **Crear**: Asignar nueva membresía a un cliente
- **Ver Detalle**: Información de la membresía
- **Editar**: Modificar datos de la membresía

#### Pagos (`/pagos`)
- **Listar**: Ver historial de pagos
- **Crear**: Registrar nuevo pago
- **Ver Detalle**: Información del pago
- **Editar**: Modificar datos del pago

## 🗄️ Estructura de la Base de Datos

La aplicación crea automáticamente las siguientes tablas:

### Tabla `clientes`
- `id` (Primary Key)
- `nombre`
- `email` (Unique)
- `telefono`
- `password`
- `rol` (usuario, admin)
- `created_at`
- `updated_at`

### Tabla `membresias`
- `id` (Primary Key)
- `clienteId` (Foreign Key)
- `tipo` (Mensual, Trimestral, Semestral, Anual)
- `fechaInicio`
- `fechaVencimiento`
- `estado` (Activa, Vencida, Cancelada)
- `created_at`
- `updated_at`

### Tabla `pagos`
- `id` (Primary Key)
- `clienteId` (Foreign Key)
- `fechaPago`
- `monto`
- `metodoPago` (Efectivo, Tarjeta, Transferencia)
- `numero_confirmacion`
- `created_at`
- `updated_at`

- ### Tabla `admin`
- `id` (Primary Key)
- `nombre`
- `email` (Unique)
- `password`
- `created_at`
- `updated_at`

## 🔧 Scripts Disponibles

- `npm start`: Inicia la aplicación en modo producción

## 📝 Notas de Desarrollo

- La aplicación utiliza **Method Override** para soportar operaciones PUT y DELETE en formularios HTML
- Las conexiones a la base de datos se manejan mediante un pool de conexiones
- Se implementa manejo de errores con middleware personalizado
- Las vistas utilizan EJS como motor de plantillas

## 🔑 Acceso al Sistema

### Usuario Administrador por Defecto
- **Email**: admin@gymapp.com
- **Contraseña**: admin123

### Registro de Clientes
Los clientes pueden registrarse desde la página principal y tendrán acceso limitado a sus propios datos.

## 📋 Funcionalidades por Rol

### 👨‍💼 Administradores
- ✅ Dashboard completo con estadísticas
- ✅ Gestión total de clientes (CRUD)
- ✅ Gestión total de membresías (CRUD)
- ✅ Gestión total de pagos (CRUD)
- ✅ Estadísticas detalladas del gimnasio
- ✅ Acceso a toda la información del sistema

### 👤 Clientes
- ✅ Dashboard personal con información relevante
- ✅ Ver perfil personal y editarlo
- ✅ Consultar membresías activas
- ✅ Ver historial de pagos
- ✅ Registrar nuevos pagos con número de confirmación
- ✅ Acceso limitado solo a sus propios datos

## 🔒 Seguridad

### Autenticación
- **JWT** para tokens de sesión
- **Bcrypt** para hash de contraseñas
- **Cookies httpOnly** para mayor seguridad
- **Expiración automática** de sesiones

### Autorización
- **Middleware de roles** para control de acceso
- **Verificación de propiedad** de recursos
- **Validaciones** en frontend y backend
- **Mensajes de error** claros y seguros

### Validaciones
- **Formato de email** válido
- **Contraseñas** con longitud mínima
- **Campos requeridos** en todos los formularios
- **Números de confirmación** únicos para pagos

## 🎨 Interfaz de Usuario

### Diseño Responsivo
- **CSS moderno** con gradientes y animaciones
- **Sistema en Grid** adaptativo
- **Estados visuales** claros

### Experiencia de Usuario
- **Navegación intuitiva**
- **Estados informativos**
- **Confirmaciones**
- **Validación en tiempo real**

## 📊 Rutas del Sistema

### Rutas Públicas
- `GET /` - Página principal con showcase
- `GET /auth/login` - Formulario de login
- `GET /auth/register` - Formulario de registro
- `POST /auth/login` - Procesar login
- `POST /auth/register` - Procesar registro
- `POST /auth/logout` - Cerrar sesión

### Rutas de Administradores
- `GET /admin/dashboard` - Dashboard principal
- `GET /admin/estadisticas` - Estadísticas detalladas
- `GET /admin/clientes` - Gestión de clientes
- `GET /admin/membresias` - Gestión de membresías
- `GET /admin/pagos` - Gestión de pagos

### Rutas de Clientes
- `GET /cliente/dashboard` - Dashboard personal
- `GET /cliente/perfil` - Perfil personal
- `GET /cliente/membresias` - Mis membresías
- `GET /cliente/pagos` - Mis pagos
- `GET /cliente/pagos/crear` - Registrar pago
- `POST /cliente/pagos` - Crear nuevo pago

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express
- **Base de Datos**: MySQL
- **Autenticación**: JWT + Bcrypt
- **Motor de Vistas**: EJS
- **Estilos**: CSS3 con diseño responsivo
- **Validaciones**: Frontend y Backend

## 📝 Dependencias Principales

```json
{
  "express": "^4.21.2",
  "ejs": "^3.1.10",
  "mysql2": "^3.14.1",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "dotenv": "^16.3.1",
  "method-override": "^3.0.0"
}
```

## 🚀 Despliegue

### Variables de Entorno de Producción
```env
NODE_ENV=production
JWT_SECRET=clave_que_quieras_usar
DB_HOST=tu_host_de_produccion
DB_USER=tu_usuario_de_produccion
DB_PASSWORD=tu_password_de_produccion
```

## 👨‍💻 Autor(es)

Desarrollado como proyecto académico para la materia de Backend por:

Hector Villegas
Adriel Peralta

Este proyecto es meramente de uso educativo y académico.
