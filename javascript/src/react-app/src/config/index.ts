/**
 * @description
 * Get your openweathermap.org api key and paste it into the .env file.
 * If you don't see an .env file, then rename sample.env to .env
 * and follow the instructions there.
 * @link https://home.openweathermap.org/api_keys
 */
const BACKEND_ORIGIN =
  process.env.REACT_APP_BACKEND_ORIGIN ?? window.location.origin;

const config = {
  BACKEND_ORIGIN,
};

export { config };
