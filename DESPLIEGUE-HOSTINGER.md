# Despliegue en Hostinger (hosting compartido) + base de datos MySQL

Este sistema es un frontend **Next.js exportado como sitio estático** + una **API en PHP** que
guarda los eventos en **MySQL**. Encaja perfecto con el hosting compartido de Hostinger (Apache + PHP + MySQL).

```
Navegador ──▶  Sitio estático (HTML/JS)  ──fetch──▶  /api/*.php  ──▶  MySQL
```

---

## 1. Crear la base de datos en Hostinger

1. Entrá a **hPanel → Bases de datos → Bases de datos MySQL**.
2. Creá una base de datos y un usuario (anotá **nombre de la base, usuario y contraseña**).
3. Hostinger suele prefijar los nombres (ej. `u123456789_conectadas`). Usá esos nombres exactos.

## 2. Configurar la API

1. Abrí `api/config.php` y completá con los datos reales de Hostinger:
   ```php
   'db_host' => 'localhost',              // en Hostinger casi siempre es localhost
   'db_name' => 'u123456789_conectadas',
   'db_user' => 'u123456789_admin',
   'db_pass' => 'TU_PASSWORD_DE_LA_BASE',
   ```
2. **Cambiá la contraseña inicial del panel** y poné un secreto largo y aleatorio:
   ```php
   'admin_password' => 'una-contraseña-fuerte',
   'auth_secret'    => 'una-cadena-larga-y-aleatoria-de-40+-caracteres',
   ```
   > `config.php` no se sube a Git (está en `.gitignore`). Editalo directo en el servidor o subilo por FTP.

   **Cómo funciona el login:** las credenciales de `config.php` se usan **una sola vez**, cuando
   se crea el usuario en la tabla `users` de MySQL (la contraseña se guarda **hasheada con bcrypt**,
   nunca en texto plano). Después de eso, la base de datos manda: para cambiar la contraseña usá
   el botón **"Cambiar contraseña"** dentro del panel — editar `config.php` ya no tiene efecto.

## 3. Generar el sitio estático

En tu máquina, dentro de la carpeta del proyecto:

```bash
npm install       # solo la primera vez
npm run build
```

Esto genera la carpeta **`out/`** con todo el sitio estático.

> ⚠️ Antes de buildear para producción, asegurate de que **no** exista un `NEXT_PUBLIC_API_BASE`
> apuntando a tu XAMPP. El archivo `.env.development.local` solo se usa en `next dev`, así que el
> build de producción usa `/api` automáticamente. No hace falta tocar nada.

## 4. Subir los archivos a Hostinger

En **hPanel → Administrador de archivos** (o por FTP), dentro de `public_html/`:

1. Subí **todo el contenido de `out/`** a la raíz de `public_html/`.
2. Subí la carpeta **`api/`** completa a `public_html/api/`.

La estructura final en el servidor queda así:

```
public_html/
├── index.html            ← del out/
├── login/index.html      ← del out/
├── _next/ …              ← del out/
├── img-instituciones/ …  ← del out/
└── api/
    ├── config.php        ← con tus datos reales
    ├── events.php
    ├── login.php            ← valida contra la tabla `users` (bcrypt)
    ├── change-password.php  ← cambio de contraseña desde el panel
    ├── upload.php        ← subida de imágenes desde el panel
    ├── helpers.php
    ├── schema.sql
    ├── setup.php
    ├── .htaccess
    └── uploads/          ← acá se guardan las imágenes subidas
        └── .htaccess     ← bloquea la ejecución de código en esta carpeta
```

> Las imágenes que se suben desde el panel quedan en `api/uploads/`. Cuando actualices el sitio,
> **no borres esa carpeta** en el servidor o vas a perder las fotos de los eventos.

## 5. Crear las tablas y cargar datos de ejemplo

1. Visitá **una vez** en el navegador: `https://TU-DOMINIO/api/setup.php`
   - Debería mostrar que se crearon las tablas `users` y `events`, que el usuario
     administrador quedó listo (contraseña hasheada) y que se cargaron los eventos de ejemplo.
2. **Borrá `setup.php` del servidor** (por seguridad).

## 6. Probar

- **Sitio:** `https://TU-DOMINIO/` → la agenda muestra los eventos desde MySQL.
- **Panel:** `https://TU-DOMINIO/login/` → ingresá con el usuario/contraseña de `config.php`
  y probá crear/editar/eliminar un evento.

---

## Actualizar el sitio más adelante

Cada vez que cambies el diseño o el código del frontend:

```bash
npm run build
```

Y volvé a subir el contenido de `out/` a `public_html/` (la carpeta `api/` y `config.php`
no hace falta tocarlas salvo que cambies la API).

## Desarrollo local (XAMPP)

- Base de datos: `ic_conectadas` (creada en phpMyAdmin o por consola).
- API accesible en: `http://localhost/AWENTECH/institucionesconectadas/api/…`
- `next dev` corre en `http://localhost:9002` y ya está configurado para hablar con la API
  local vía `.env.development.local`.

## Seguridad — checklist antes de ir a producción

- [ ] Cambiaste `admin_password` en `config.php` **antes** de correr `setup.php` (es la contraseña con la que se crea el usuario).
- [ ] Pusiste un `auth_secret` largo y aleatorio.
- [ ] Corriste `setup.php` y después lo **borraste** del servidor.
- [ ] Verificaste que `https://TU-DOMINIO/api/config.php` **no** muestra el contenido (el `.htaccess` lo bloquea).
- [ ] Si querés rotar la contraseña más adelante: botón "Cambiar contraseña" en el panel (mínimo 8 caracteres).

> **¿Te olvidaste la contraseña?** Vaciá la tabla `users` desde phpMyAdmin
> (`TRUNCATE TABLE users;`) — en el próximo login se vuelve a crear el usuario
> con las credenciales de `config.php`.
