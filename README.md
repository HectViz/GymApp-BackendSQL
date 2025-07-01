# 🏋️ GymApp - Sistema de Gestión de Gimnasio

## 📋 Descripción

**GymApp** es una aplicación web desarrollada en **Node.js** con **Express.js** para la gestión integral de un gimnasio. Esta aplicación permite administrar clientes, membresías y pagos de manera eficiente y organizada.

### 🎯 Propósito
Este proyecto fue desarrollado como asignatura universitaria para la materia de **Backend**, demostrando la implementación de una base de datos relacional en MySQL y operaciones CRUD con sus debidos Endpoints.

## ✨ Características Principales

### 👥 Gestión de Clientes
- Registro de nuevos clientes
- Visualización de información detallada
- Edición de datos personales
- Búsqueda y filtrado de clientes

### 🎫 Gestión de Membresías
- Creación de membresías (Mensual, Trimestral, Semestral, Anual)
- Control de fechas de inicio y vencimiento
- Estados de membresía (Activa, Vencida, Cancelada)
- Asociación automática con clientes

### 💰 Gestión de Pagos
- Registro de transacciones
- Múltiples métodos de pago (Efectivo, Tarjeta, Transferencia)
- Historial de pagos por cliente
- Control de montos y fechas

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MySQL
- **Motor de Vistas**: EJS (Embedded JavaScript)
- **Estilos**: CSS personalizado
- **ORM**: mysql2 para conexiones a base de datos

## 📦 Instalación

### Prerrequisitos
- Node.js
- MySQL
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/HectViz/GymApp-BackendSQL.git
   cd gymapp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - Crear una base de datos MySQL llamada `gymapp`
   - Configurar las credenciales en `config/db.js`:
     ```javascript
     const dbConfig = {
       host: 'localhost',
       user: 'root',
       password: 'tu-contraseña',
       database: 'gymapp',
       port: 3306
     };
     ```

4. **Inicializar la aplicación**
   ```bash
   npm start
   ```

5. **Acceder a la aplicación**
   - Abrir el navegador en: `http://localhost:3000`

## 🚀 Uso de la Aplicación

### Página Principal
La aplicación cuenta con una interfaz principal que muestra tres módulos principales:
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
- `created_at`
- `updated_at`

## 🔧 Scripts Disponibles

- `npm start`: Inicia la aplicación en modo producción

## 📝 Notas de Desarrollo

- La aplicación utiliza **Method Override** para soportar operaciones PUT y DELETE en formularios HTML
- Las conexiones a la base de datos se manejan mediante un pool de conexiones
- Se implementa manejo de errores con middleware personalizado
- Las vistas utilizan EJS como motor de plantillas

## 👨‍💻 Autor

Desarrollado como proyecto académico para la materia de Backend por:

Hector Villegas
Adriel Peralta

Este proyecto es meramente de uso educativo y académico.
