import { find, groupBy, map } from "lodash";

export const uniqueItemsByKeys = <T>(
  array: T[],
  keys: (keyof T)[],
  priorityKey = "selected"
) => {
  // Crear un mapa de agrupación usando una clave única basada en las claves especificadas
  const grouped = groupBy(array, (item) =>
    keys.map((key) => item[key]).join("|")
  );

  // Iterar sobre los grupos y priorizar según el priorityKey
  return map(
    grouped,
    (group) => find(group, (item) => item[priorityKey]) || group[0]
  );
};
