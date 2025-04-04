/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardImport } from './routes/dashboard'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'
import { Route as ChainsIndexImport } from './routes/chains/index'
import { Route as DashboardSendImport } from './routes/dashboard/send'
import { Route as DashboardChainTokenImport } from './routes/dashboard/$chain/$token'

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardRoute,
} as any)

const ChainsIndexRoute = ChainsIndexImport.update({
  id: '/chains/',
  path: '/chains/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardSendRoute = DashboardSendImport.update({
  id: '/send',
  path: '/send',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardChainTokenRoute = DashboardChainTokenImport.update({
  id: '/$chain/$token',
  path: '/$chain/$token',
  getParentRoute: () => DashboardRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/send': {
      id: '/dashboard/send'
      path: '/send'
      fullPath: '/dashboard/send'
      preLoaderRoute: typeof DashboardSendImport
      parentRoute: typeof DashboardImport
    }
    '/chains/': {
      id: '/chains/'
      path: '/chains'
      fullPath: '/chains'
      preLoaderRoute: typeof ChainsIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/$chain/$token': {
      id: '/dashboard/$chain/$token'
      path: '/$chain/$token'
      fullPath: '/dashboard/$chain/$token'
      preLoaderRoute: typeof DashboardChainTokenImport
      parentRoute: typeof DashboardImport
    }
  }
}

// Create and export the route tree

interface DashboardRouteChildren {
  DashboardSendRoute: typeof DashboardSendRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
  DashboardChainTokenRoute: typeof DashboardChainTokenRoute
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardSendRoute: DashboardSendRoute,
  DashboardIndexRoute: DashboardIndexRoute,
  DashboardChainTokenRoute: DashboardChainTokenRoute,
}

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/dashboard/send': typeof DashboardSendRoute
  '/chains': typeof ChainsIndexRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/dashboard/$chain/$token': typeof DashboardChainTokenRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/dashboard/send': typeof DashboardSendRoute
  '/chains': typeof ChainsIndexRoute
  '/dashboard': typeof DashboardIndexRoute
  '/dashboard/$chain/$token': typeof DashboardChainTokenRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/dashboard/send': typeof DashboardSendRoute
  '/chains/': typeof ChainsIndexRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/dashboard/$chain/$token': typeof DashboardChainTokenRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/dashboard'
    | '/dashboard/send'
    | '/chains'
    | '/dashboard/'
    | '/dashboard/$chain/$token'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/dashboard/send'
    | '/chains'
    | '/dashboard'
    | '/dashboard/$chain/$token'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/dashboard'
    | '/dashboard/send'
    | '/chains/'
    | '/dashboard/'
    | '/dashboard/$chain/$token'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  DashboardRoute: typeof DashboardRouteWithChildren
  ChainsIndexRoute: typeof ChainsIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  DashboardRoute: DashboardRouteWithChildren,
  ChainsIndexRoute: ChainsIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/dashboard",
        "/chains/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard.tsx",
      "children": [
        "/dashboard/send",
        "/dashboard/",
        "/dashboard/$chain/$token"
      ]
    },
    "/dashboard/send": {
      "filePath": "dashboard/send.tsx",
      "parent": "/dashboard"
    },
    "/chains/": {
      "filePath": "chains/index.tsx"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/$chain/$token": {
      "filePath": "dashboard/$chain/$token.tsx",
      "parent": "/dashboard"
    }
  }
}
ROUTE_MANIFEST_END */
