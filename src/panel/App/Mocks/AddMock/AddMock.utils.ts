import { Headers } from '@mokku/types';

/**
 * Transforms a query parameter string into a JSON string.
 * @param queryParams
 * @returns A JSON string representing the query parameters.
 * @example
 * const queryParams = "name=John&age=30";
 * const result = transformQueryParamStringToObjectString(queryParams);
 * console.log(result); // { "name": "John", "age": "30" }
 */
export const transformQueryParamStringToObjectString = (queryParams: string): string => {
  const params = new URLSearchParams(queryParams);
  const result: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return JSON.stringify(result);
};

/**
 * Extracts query parameters from a given URL and returns them as a string.
 * @param url - The URL from which to extract query parameters.
 * @returns A string representing the query parameters, or an empty string if the URL is invalid.
 * @example
 * const url = "https://example.com/page?name=John&age=30";
 * const result = extractQueryParamsFromUrl(url);
 * console.log(result); // "name=John&age=30"
 *
 * const urlPartial = "example.com/page?name=John&age=30";
 * const resultPartial = extractQueryParamsFromUrl(urlPartial);
 * console.log(resultPartial); // "name=John&age=30"
 *
 * const invalidUrl = "not-a-valid-url";
 * const resultInvalid = extractQueryParamsFromUrl(invalidUrl);
 * console.log(resultInvalid); // ""
 */
export const extractQueryParamsFromUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.toString();
  } catch (error) {
    // If the URL is invalid, try to extract query parameters from a partial URL
    const queryParamsMatch = url.match(/\?(.*)/);
    return queryParamsMatch ? queryParamsMatch[1] : '';
  }
};

/**
 * Transforms an array of query parameters into a JSON string.
 * @param queryParams - An array of query parameters, each represented as an object with 'name' and 'value' properties.
 * @returns A JSON string representing the query parameters.
 * @example
 * const queryParamsArray = [
 *   { name: "name", value: "John" },
 *   { name: "age", value: "30" }
 * ];
 * const result = transformArrayQueryParamsToObjectString(queryParamsArray);
 * console.log(result); // { "name": "John", "age": "30" }
 *
 * const emptyQueryParamsArray: Headers = [];
 * const resultEmpty = transformArrayQueryParamsToObjectString(emptyQueryParamsArray);
 * console.log(resultEmpty); // ""
 */
export const transformArrayQueryParamsToObjectString = (queryParams: Headers): string => {
  const result: Record<string, string> = {};

  if (queryParams.length === 0) {
    return '';
  }

  queryParams.forEach(({ name, value }) => {
    result[name] = value;
  });

  return JSON.stringify(result);
};

/**
 * Updates the query parameters of a given URL with the provided query parameters string.
 * @param url - The original URL to be updated.
 * @param queryParamsObjectString - A JSON string representing the new query parameters (e.g., '{"name":"John","age":"30"}').
 * @returns The updated URL with the new query parameters, or the original URL if it's invalid.
 * @example
 * const url = "https://example.com/page?oldParam=oldValue";
 * const newQueryParams = '{"name":"John","age":"30"}';
 * const updatedUrl = updateUrlQueryParams(url, newQueryParams);
 * console.log(updatedUrl); // "https://example.com/page?name=John&age=30"
 *
 * const partialUrl = "example.com/page?oldParam=oldValue";
 * const updatedPartialUrl = updateUrlQueryParams(partialUrl, newQueryParams);
 * console.log(updatedPartialUrl); // "example.com/page?name=John&age=30"
 *
 * const invalidUrl = "not-a-valid-url";
 * const updatedInvalidUrl = updateUrlQueryParams(invalidUrl, newQueryParams);
 * console.log(updatedInvalidUrl); // "not-a-valid-url"
 *
 * const emptyQueryParams = '';
 * const updatedUrlWithEmptyParams = updateUrlQueryParams(url, emptyQueryParams);
 * console.log(updatedUrlWithEmptyParams); // "https://example.com/page"
 */
export const updateUrlQueryParams = (url: string, queryParamsObjectString: string): string => {
  if (!queryParamsObjectString) {
    // No query params, remove any existing query params from the URL
    return url.replace(/(\?.*)$/, '');
  }

  const currentQueryParamsObject = JSON.parse(queryParamsObjectString);
  const currentQueryParamsString = new URLSearchParams(currentQueryParamsObject).toString();

  // take an account partial url, if the url is not valid, return the original url
  try {
    const parsedUrl = new URL(url);
    parsedUrl.search = currentQueryParamsString;
    return parsedUrl.toString();
  } catch (error) {
    // If the URL is invalid, return the original URL with the merged query params appended
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?${currentQueryParamsString}`;
  }
};
