import { AppRoutePath, AppRouteName } from "../types/enums/routes";


export interface AppRoute {

  name: AppRouteName;

  path: AppRoutePath;

  label: string;

  permission?: string;

}

export const routerList: AppRoute[] = [

  {

    name: AppRouteName.HOME,

    path: AppRoutePath.HOME,

    label: "Home",

    permission: "public"

  },

  {

    name: AppRouteName.DASHBOARD,

    path: AppRoutePath.DASHBOARD,

    label: "Dashboard",

    permission: "authenticated"

  },
];

export function getRoutePathByName(name: AppRouteName): AppRoutePath {

  const found = routerList.find(route => route.name === name);

  return found?.path || AppRoutePath.HOME;

}
