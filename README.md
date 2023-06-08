# Cómo usar MongoDB con Cloudflare, Prisma y Remix.

En esta learning vamos a aprender cómo conectar con una base de datos en la nube utilizando MongoDB Atlas, un proxy de PRisma.io y la vamos a usar con Remix y Cloudflare.
Como siempre, lo único que necesitas es Node.js en tu terminal y una cuenta en `cloudflare.com`
Y vamos a hacerlo todo en 6 sencillos pasos:

## 1. Creando la base de datos en MongoDB Atlas

Vamos al sitio en [este enlace](https://account.mongodb.com/account/login) para iniciar sesión y crear un proyecto nuevo. Para luego crear una nueva base de datos.
![mongo atlas](https://i.imgur.com/lfX5HqK.png)
Puedes generar usuarios en la pestaña `Database Access` para luego dar clic en `conect` y copiar el `string` de conexión. Guardalo en un lugar seguro, o en un archivo `.env`.

## 2. Prisma Proxy

Vamos a crear un proxy para nuestra base de datos, esto para que así podamos consumirla con peticiones HTTP desde Cloudflare.

Ahora, inicia sesión en [Prisma.io](https://cloud.prisma.io/) y crea un proyecto nuevo.

![prisma project](https://i.imgur.com/QV3F0t1.png)
Aquí pegaremos el link de nuestra base de datos Mongo para luego generar este link. No olvides agregar el nombre de la base de datos al final del enlace, antes de los `searchParams`.
![Prisma http link](https://i.imgur.com/snAGa3r.png)
Ahora guardamos este link en un lugar seguro o también en `.env`.

> 👀 Esta será la única ocación que podremos consultar este string en la consola de Prisma. Guarda bien tu string.

## 3. Remix y variables de entorno

Puedes hacer esto en algún proyecto ya inicializado con Remix, pero si no, recuerda que los pasos para crear un proyecto nuevo, son los siguientes:

```jsx
npx create-remix@latest
```

No olvides seleccionar Cloudflare (pages o workers).
![workers remix](https://i.imgur.com/97zxzFY.png)
Agregamos nuestras variables a un archivo `.env` y también a `wrangler.toml`
![.env](https://i.imgur.com/tOZy3Sz.png)
Colocar las variables en `wrangler.toml` es importante para que se carguen de forma global para que estén disponibles en Cloudflare.

Para terminar la configuración en el proyecto, vamos a iniciar nuestro esquema de Prisma y vamos a crear un par de modelos y una relación uno a muchos, solo como ejemplo.

## 4. Prisma generate --data-proxy

Instalamos prisma como herramienta de desarrollo y también el cliente de prisma.

```jsx
npm i prisma -D
```

```jsx
npm i @prisma/client
```

Ahora vamos a generar el archivo de esquema con el comando:

```jsx
npx prisma init
```

Lo que producirá un archivo `prisma.schema` dentro de una carpeta `prisma`. A este archivo le vamos a agregar nuestras variables de entorno de esta manera:
![prisma mongo config](https://i.imgur.com/k9GvdrC.png)
Toma nota del uso de las dos `URL`.

La primera:`url`, se usará con el cliente para consumir la base de datos programáticamente en tu código.
Mientras que `directUrl` se usará con los comandos de desarrollo de prisma, como: `npx prisma db push/pull/migrate` etc.
Así no perdemos funcionalidad. 🤓 Bueno, pues dale un
`npx prisma db push` para subir tus nuevos modelos a tu DB.

Finalmente, generaremos el cliente de prisma para Cloudflare:

```jsx
npx prisma generate --data-proxy
```

Muy bien, en un momento vamos a utilizar este cliente.

## 5. Usando nuestra DB

Vamos a crear una micro app para probar nuestra base de datos.

Después de iniciar sesión con Google ([aquí esta el repo](repo)), vamos a dejar un comentario en el muro:

Al hacer submit del formulario vamos a recibirlo en un `action` de Remix y vamos a guardarlo en nuestra base de datos con el cliente de Prisma.

> 👀 La conexión a la base de datos es HTTP gracias al Prisma proxy. Así que no hay problema con invocar al cliente en cada conexión, de todas formas Cloudflare administra el ciclo de vida de la función, la conexión siempre es efímera y el cliente se crea cada vez de todas formas. Pero si quieres puedes usar [este formato](https://remix.run/docs/en/1.16.1/1.17.0/tutorials/jokes#connect-to-the-database) para definir tu DB.

¡Genial! Ha sido muy fácil escribir en nuestra DB, ahora vamos a leerla.

```jsx

```

Y así de fácil tenemos una micro app interactiva full stack con base de datos. 🔥🤯🤓

Estamos listos para producción, siempre lo hemos estado con Cloudflare.

## 6. Production ready

Me aseguro de que el comando `"postinstall"` del archivo `package.json` ejecute el comando de Prisma para la generación del cliente:

```jsx
"postinstall":  "npx prisma generate --data-proxy",
```

Esto nos asegura que si existiera algún `build step` en Cloudflare, nuestro cliente de Prisma sería generado correctamente.
¡Y ya, vamos a probar!

```jsx
npm run deploy
```

Con tu cuenta de Cloudflare abierta, esto tomará un par de segundos y tu app estaría lista para producción.

Confirma que todo funciona iniciando sesión y agregando un nuevo comentario.

## Consideraciones

1. Para que el login de Google funcione debes agregar tus propios secret.
2. No olvides indicar el nombre de tu base de datos en tu link de mongo, regularmente no lo incluye.

Y ya está, lo tienes todo para construir aplicaciones web de primer nivel, ¿ya viste que pinche rápido carga tu app en Cloudflare? Tienes mucho poder en tus manos. 👊🏼✊🏼👊🏼 Úsalo sabiamente 🥋

🌀 ¿Ya vez? **Lo lograste.**

Abrazo. bliss.
