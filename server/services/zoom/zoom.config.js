import { hasZoomCredentials, serverEnv } from "../../config/app-env.js";

export function hasZoomConfig() {
  return hasZoomCredentials;
}

export function getZoomConfig() {
  return {
    accountId: serverEnv.zoomAccountId,
    clientId: serverEnv.zoomClientId,
    clientSecret: serverEnv.zoomClientSecret,
  };
}

export function isZoomEnabled() {
  return hasZoomConfig();
}

export function getZoomCredentials() {
  return getZoomConfig();
}
