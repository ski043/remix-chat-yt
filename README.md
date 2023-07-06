# Soo you want Create a Full Stack Realtime Chat Messaging App with Remix.run

[![Create a Full Stack Realtime Chat Messaging App with Remix.run](https://img.youtube.com/vi/WUoXCSYiNKk/0.jpg)](https://www.youtube.com/watch?v=WUoXCSYiNKk)

-------------



- [Remix.run](https://remix.run/)
- [Tailwind.css](https://tailwindcss.com/)
- [Remix-Auth Docs](https://remix-docs-flame.vercel.app/)

### Commands you will need
```sh
npm i remix-utils remix-auth-socials remix-auth @prisma/client
```

```sh
npm i -D prisma
```




## Fly Setup

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch
```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.
