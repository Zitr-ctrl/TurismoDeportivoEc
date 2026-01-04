# Documentación de Variables de Entorno - Backend

Este documento describe todas las variables de entorno necesarias para ejecutar el backend de la aplicación de Turismo Deportivo en Ecuador.

## Variables Requeridas

### 1. PORT
- **Descripción**: Puerto en el que se ejecutará el servidor Express
- **Valor por defecto**: `3000`
- **Ejemplo**: `PORT=3000`
- **Ubicación en código**: `server.js:35`

### 2. MONGO_URI
- **Descripción**: URI de conexión a la base de datos MongoDB
- **Requerido**: Sí
- **Ejemplos**:
  - MongoDB local: `mongodb://localhost:27017/turismo-deportivo`
  - MongoDB Atlas: `mongodb+srv://usuario:password@cluster.mongodb.net/turismo-deportivo`
- **Ubicación en código**: `config/db.js:4`
- **Notas**: Asegúrate de que la base de datos esté accesible antes de iniciar el servidor

### 3. JWT_SECRET
- **Descripción**: Clave secreta para firmar y verificar tokens JWT
- **Requerido**: Sí
- **Seguridad**: Debe ser una cadena aleatoria y segura
- **Generación recomendada**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- **Ejemplo**: `JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`
- **Ubicación en código**:
  - `middlewares/auth.js:9`
  - `routes/auth.js:20`
- **Notas**: NUNCA compartas este secreto públicamente ni lo incluyas en el repositorio

### 4. GOOGLE_CLIENT_ID
- **Descripción**: ID de cliente de Google OAuth para autenticación con Google
- **Requerido**: Sí (si se usa autenticación con Google)
- **Obtención**:
  1. Ir a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  2. Crear un nuevo proyecto o seleccionar uno existente
  3. Crear credenciales OAuth 2.0
  4. Configurar la pantalla de consentimiento
  5. Copiar el Client ID
- **Formato**: `GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com`
- **Ubicación en código**:
  - `routes/auth.js:9`
  - `routes/auth.js:91`

### 5. BASE_URL
- **Descripción**: URL base del backend para construir URLs completas de recursos (imágenes)
- **Valor por defecto**: `http://localhost:3000`
- **Ejemplos**:
  - Desarrollo local: `BASE_URL=http://localhost:3000`
  - Producción: `BASE_URL=https://api.tudominio.com`
- **Ubicación en código**:
  - `routes/eventoRoutes.js:77`
  - `routes/eventoRoutes.js:103`
- **Notas**: Importante para que las URLs de las imágenes sean accesibles desde el frontend

## Configuración Inicial

### Paso 1: Copiar el archivo de ejemplo
```bash
cd back-end
cp .env.example .env
```

### Paso 2: Editar el archivo .env
Abre el archivo `.env` y completa cada variable con los valores apropiados para tu entorno.

### Paso 3: Verificar la configuración
Asegúrate de que:
- MongoDB está ejecutándose y es accesible
- El `MONGO_URI` es correcto
- Has generado un `JWT_SECRET` seguro
- El `GOOGLE_CLIENT_ID` está configurado (si usas OAuth de Google)

### Paso 4: Iniciar el servidor
```bash
npm run dev  # Modo desarrollo
# o
npm start    # Modo producción
```

## Seguridad

⚠️ **IMPORTANTE**:
- El archivo `.env` está en `.gitignore` y NO debe ser versionado
- NUNCA compartas tu archivo `.env` en repositorios públicos
- Usa valores diferentes para desarrollo, staging y producción
- Rota el `JWT_SECRET` periódicamente en producción
- Restringe las URIs autorizadas en Google OAuth Console

## Problemas Comunes

### Error: "MongoDB no conectado"
- Verifica que MongoDB está ejecutándose
- Comprueba que el `MONGO_URI` es correcto
- Verifica permisos de red/firewall

### Error: "Token inválido"
- Asegúrate de que el `JWT_SECRET` es el mismo en todos los entornos
- Verifica que el token no ha expirado (duración: 1 día)

### Error en autenticación con Google
- Verifica que el `GOOGLE_CLIENT_ID` es correcto
- Asegúrate de que el dominio está autorizado en Google Console
- Comprueba que las credenciales de OAuth están activas

## Notas Adicionales

### API Key de Google Maps
⚠️ **ADVERTENCIA DE SEGURIDAD**: Actualmente hay una API key de Google Maps hardcodeada en el código (`routes/eventoRoutes.js:19`).

**Recomendación**: Mover esta clave a una variable de entorno:

1. Agregar al archivo `.env`:
   ```
   GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
   ```

2. Modificar el código en `routes/eventoRoutes.js:19`:
   ```javascript
   const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&region=EC&key=${process.env.GOOGLE_MAPS_API_KEY}`;
   ```

## Script de Creación de Admin

El script `script/createAdmin.js` crea un usuario administrador por defecto:
- **Email**: `admin@ecuador.ec`
- **Password**: `admin123`
- **Rol**: `admin`

**Ejecutar**:
```bash
node script/createAdmin.js
```

⚠️ **IMPORTANTE**: Cambia la contraseña del admin después de la primera ejecución en producción.
