# Mods-Roles: Guía de Despliegue

## Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   MongoDB       │
│   (Vercel)      │     │   (Render)      │     │   (Atlas)       │
│   React + Vite  │     │   Express       │     │   Free Tier     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 1. Configurar MongoDB Atlas (Gratis)

1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo cluster (elige "Shared" - FREE)
4. Configura tu usuario de base de datos:
   - Database Access > Add New Database User
   - Guarda el usuario y contraseña
5. Configura acceso de red:
   - Network Access > Add IP Address
   - Haz clic en "Allow Access from Anywhere" (0.0.0.0/0)
6. Obtén la connection string:
   - Connect > Drivers > Copia la URI
   - Reemplaza `<password>` con tu contraseña

## 2. Desplegar Backend en Render (Gratis 24/7)

> ⚠️ **Importante**: Asegúrate de que `server/package.json` incluya las dependencias de tipos (`@types/node`, `@types/express`, etc.) en `devDependencies`.

1. Ve a [Render.com](https://render.com)
2. Crea una cuenta o inicia sesión con GitHub
3. Conecta tu repositorio de GitHub
4. Click "New" > "Web Service"
5. Configura:
   - **Name**: `mods-roles-api`
   - **Region**: Oregon (o el más cercano)
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Añade las variables de entorno:
   - `MONGODB_URI`: tu connection string de MongoDB Atlas
   - `SESSION_SECRET`: un string largo y aleatorio
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: (lo añadirás después del deploy de Vercel)

7. Click "Create Web Service"
8. Copia la URL del servicio (ej: `https://mods-roles-api.onrender.com`)

### Ejecutar Seed (una vez)

Después del deploy, ve a Render > Shell y ejecuta:
```bash
npm run seed
```

## 3. Desplegar Frontend en Vercel (Gratis)

1. Ve a [Vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Click "Add New" > "Project"
4. Importa tu repositorio
5. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Añade la variable de entorno:
   - `VITE_API_URL`: la URL de tu backend en Render
7. Click "Deploy"

## 4. Configurar CORS (Importante)

Después de obtener la URL de Vercel, vuelve a Render y actualiza:
- `FRONTEND_URL`: tu URL de Vercel (ej: `https://mods-roles.vercel.app`)

## Estructura de Carpetas

```
/
├── client/          # Frontend (Vercel)
│   ├── package.json
│   ├── vercel.json
│   └── src/
│
├── server/          # Backend (Render)
│   ├── package.json
│   ├── index-mongo.ts
│   ├── routes-mongo.ts
│   ├── mongo-storage.ts
│   ├── mongodb.ts
│   ├── models.ts
│   └── seed.ts
│
└── render.yaml      # Configuración de Render
```

## Variables de Entorno Resumen

### Backend (Render)
| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | Connection string de MongoDB Atlas |
| `SESSION_SECRET` | Secret para cookies de sesión |
| `FRONTEND_URL` | URL del frontend en Vercel |
| `NODE_ENV` | `production` |

### Frontend (Vercel)
| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL del backend en Render |

## Notas Importantes

- **Render Free Tier**: El servicio puede "dormir" después de 15 minutos de inactividad. La primera petición después puede tardar ~30 segundos.
- **MongoDB Atlas Free**: 512MB de almacenamiento, suficiente para proyectos pequeños.
- **Vercel Free**: 100GB de bandwidth al mes.

## Desarrollo Local

```bash
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

Crea archivos `.env` basados en los `.env.example` proporcionados.
