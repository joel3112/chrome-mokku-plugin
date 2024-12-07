import { ComponentProps } from 'react';
import { Select } from '@mantine/core';

const STATUS_1XX = '1xx INFORMATIONAL';
const STATUS_2XX = '2xx SUCCESS';
const STATUS_3XX = '3xx REDIRECTION';
const STATUS_4XX = '4xx CLIENT ERROR';
const STATUS_5XX = '5xx SERVER ERROR';

export const statusOptions = [
  { value: 100, label: '100 - Continue', group: STATUS_1XX },
  { value: 101, label: '101 - Switching Protocols', group: STATUS_1XX },
  { value: 102, label: '102 - Processing', group: STATUS_1XX },
  { value: 103, label: '103 - Early Hints', group: STATUS_1XX },

  { value: 200, label: '200 - OK', group: STATUS_2XX },
  { value: 201, label: '201 - Created', group: STATUS_2XX },
  { value: 202, label: '202 - Accepted', group: STATUS_2XX },
  {
    value: 203,
    label: '203 - Non-Authoritative Information',
    group: STATUS_2XX
  },
  { value: 204, label: '204 - No Content', group: STATUS_2XX },
  { value: 205, label: '205 - Reset Content', group: STATUS_2XX },
  { value: 206, label: '206 - Partial Content', group: STATUS_2XX },
  { value: 207, label: '207 - Multi-Status', group: STATUS_2XX },
  { value: 208, label: '208 - Already Reported', group: STATUS_2XX },
  { value: 226, label: '226 - IM Used', group: STATUS_2XX },

  { value: 300, label: '300 - Multiple Choices', group: STATUS_3XX },
  { value: 301, label: '301 - Moved Permanently', group: STATUS_3XX },
  { value: 302, label: '302 - Found', group: STATUS_3XX },
  { value: 303, label: '303 - See Other', group: STATUS_3XX },
  { value: 304, label: '304 - Not Modified', group: STATUS_3XX },
  { value: 305, label: '305 - Use Proxy', group: STATUS_3XX },
  { value: 307, label: '307 - Temporary Redirect', group: STATUS_3XX },
  { value: 308, label: '308 - Permanent Redirect', group: STATUS_3XX },

  { value: 400, label: '400 - Bad Request', group: STATUS_4XX },
  { value: 401, label: '401 - Unauthorized', group: STATUS_4XX },
  { value: 402, label: '402 - Payment Required', group: STATUS_4XX },
  { value: 403, label: '403 - Forbidden', group: STATUS_4XX },
  { value: 404, label: '404 - Not Found', group: STATUS_4XX },
  { value: 405, label: '405 - Method Not Allowed', group: STATUS_4XX },
  { value: 406, label: '406 - Not Acceptable', group: STATUS_4XX },
  {
    value: 407,
    label: '407 - Proxy Authentication Required',
    group: STATUS_4XX
  },
  { value: 408, label: '408 - Request Timeout', group: STATUS_4XX },
  { value: 409, label: '409 - Conflict', group: STATUS_4XX },
  { value: 410, label: '410 - Gone', group: STATUS_4XX },
  { value: 411, label: '411 - Length Required', group: STATUS_4XX },
  { value: 412, label: '412 - Precondition Failed', group: STATUS_4XX },
  { value: 413, label: '413 - Payload Too Large', group: STATUS_4XX },
  { value: 414, label: '414 - URI Too Long', group: STATUS_4XX },
  { value: 415, label: '415 - Unsupported Media Type', group: STATUS_4XX },
  { value: 416, label: '416 - Range Not Satisfiable', group: STATUS_4XX },
  { value: 417, label: '417 - Expectation Failed', group: STATUS_4XX },
  { value: 418, label: "418 - I'm a Teapot", group: STATUS_4XX },
  { value: 419, label: '419 - Page Expired', group: STATUS_4XX },
  { value: 421, label: '421 - Misdirected Request', group: STATUS_4XX },
  { value: 422, label: '422 - Unprocessable Entity', group: STATUS_4XX },
  { value: 423, label: '423 - Locked', group: STATUS_4XX },
  { value: 424, label: '424 - Failed Dependency', group: STATUS_4XX },
  { value: 425, label: '425 - Too Early', group: STATUS_4XX },
  { value: 426, label: '426 - Upgrade Required', group: STATUS_4XX },
  { value: 428, label: '428 - Precondition Required', group: STATUS_4XX },
  { value: 429, label: '429 - Too Many Requests', group: STATUS_4XX },
  {
    value: 431,
    label: '431 - Request Header Fields Too Large',
    group: STATUS_4XX
  },
  { value: 444, label: '444 - No Response', group: STATUS_4XX },
  {
    value: 451,
    label: '451 - Unavailable For Legal Reasons',
    group: STATUS_4XX
  },
  { value: 494, label: '494 - Request header too large', group: STATUS_4XX },
  { value: 495, label: '495 - SSL Certificate Error', group: STATUS_4XX },
  { value: 496, label: '496 - SSL Certificate Required', group: STATUS_4XX },
  {
    value: 497,
    label: '497 - HTTP Request Sent to HTTPS Port',
    group: STATUS_4XX
  },
  { value: 499, label: '499 - Client Closed Request', group: STATUS_4XX },

  { value: 500, label: '500 - Internal Server Error', group: STATUS_5XX },
  { value: 501, label: '501 - Not Implemented', group: STATUS_5XX },
  { value: 502, label: '502 - Bad Gateway', group: STATUS_5XX },
  { value: 503, label: '503 - Service Unavailable', group: STATUS_5XX },
  { value: 504, label: '504- Gateway Timeout', group: STATUS_5XX },
  { value: 505, label: '505 - HTTP Version Not Supported', group: STATUS_5XX },
  { value: 506, label: '506 - Variant Also Negotiates', group: STATUS_5XX },
  { value: 507, label: '507 - Insufficient Storage', group: STATUS_5XX },
  { value: 508, label: '508 - Loop Detected', group: STATUS_5XX },
  { value: 509, label: '509 - Bandwidth Limit Exceeded', group: STATUS_5XX },
  { value: 510, label: '510- Not Extended', group: STATUS_5XX },
  {
    value: 511,
    label: '511 - Network Authentication Required',
    group: STATUS_5XX
  },
  {
    value: 520,
    label: '520 - Web Server Returned an Unknown Error',
    group: STATUS_5XX
  },
  { value: 521, label: '521- Web Server Is Down', group: STATUS_5XX },
  { value: 522, label: '522 - Connection Timed Out', group: STATUS_5XX },
  { value: 523, label: '523 - Origin Is Unreachable', group: STATUS_5XX },
  { value: 524, label: '524 - A Timeout Occurred', group: STATUS_5XX },
  { value: 525, label: '525 - SSL Handshake Failed', group: STATUS_5XX },
  { value: 526, label: '526 - Invalid SSL Certificate', group: STATUS_5XX },
  { value: 527, label: '527 - Railgun Error', group: STATUS_5XX }
] as unknown as ComponentProps<typeof Select>['data'];
