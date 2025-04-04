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
import { Route as DashboardYieldsImport } from './routes/dashboard/yields'
import { Route as DashboardSendImport } from './routes/dashboard/send'

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

const DashboardYieldsRoute = DashboardYieldsImport.update({
  id: '/yields',
  path: '/yields',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardSendRoute = DashboardSendImport.update({
  id: '/send',
  path: '/send',
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
    '/dashboard/yields': {
      id: '/dashboard/yields'
      path: '/yields'
      fullPath: '/dashboard/yields'
      preLoaderRoute: typeof DashboardYieldsImport
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
  }
}

// Create and export the route tree

interface DashboardRouteChildren {
  DashboardSendRoute: typeof DashboardSendRoute
  DashboardYieldsRoute: typeof DashboardYieldsRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardSendRoute: DashboardSendRoute,
  DashboardYieldsRoute: DashboardYieldsRoute,
  DashboardIndexRoute: DashboardIndexRoute,
}

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/dashboard/send': typeof DashboardSendRoute
  '/dashboard/yields': typeof DashboardYieldsRoute
  '/chains': typeof ChainsIndexRoute
  '/dashboard/': typeof DashboardIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/dashboard/send': typeof DashboardSendRoute
  '/dashboard/yields': typeof DashboardYieldsRoute
  '/chains': typeof ChainsIndexRoute
  '/dashboard': typeof DashboardIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/dashboard/send': typeof DashboardSendRoute
  '/dashboard/yields': typeof DashboardYieldsRoute
  '/chains/': typeof ChainsIndexRoute
  '/dashboard/': typeof DashboardIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/dashboard'
    | '/dashboard/send'
    | '/dashboard/yields'
    | '/chains'
    | '/dashboard/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/dashboard/send'
    | '/dashboard/yields'
    | '/chains'
    | '/dashboard'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/dashboard'
    | '/dashboard/send'
    | '/dashboard/yields'
    | '/chains/'
    | '/dashboard/'
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
        "/dashboard/yields",
        "/dashboard/"
      ]
    },
    "/dashboard/send": {
      "filePath": "dashboard/send.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/yields": {
      "filePath": "dashboard/yields.tsx",
      "parent": "/dashboard"
    },
    "/chains/": {
      "filePath": "chains/index.tsx"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx",
      "parent": "/dashboard"
    }
  }
}
ROUTE_MANIFEST_END */
