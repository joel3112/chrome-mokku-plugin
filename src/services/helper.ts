import { find, groupBy, map } from 'lodash';

export const isJsonValid = (jsonString: string) => {
  let result = true;
  try {
    JSON.parse(jsonString);
  } catch (e) {
    result = false;
  }

  return result;
};

export const getError = (errors: Record<string, string | string[]>) => {
  const keys = Object.keys(errors);
  if (keys.length === 0) {
    return;
  } else {
    return errors[keys[0]];
  }
};

export const getHeaders = (headers: Record<string, string>) => {
  if (typeof headers === 'object') {
    return Object.keys(headers).map((name) => ({
      name,
      value: headers[name]
    }));
  }
  return [];
};

export const uniqueItemsByKeys = <T>(array: T[], keys: (keyof T)[], priorityKey = 'selected') => {
  // Crear un mapa de agrupación usando una clave única basada en las claves especificadas
  const grouped = groupBy(array, (item) => keys.map((key) => item[key]).join('|'));

  // Iterar sobre los grupos y priorizar según el priorityKey
  return map(grouped, (group) => find(group, (item) => item[priorityKey]) || group[0]);
};

export const sortCollectionByName = <T extends { name: string }>(items: T[]) => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
};
