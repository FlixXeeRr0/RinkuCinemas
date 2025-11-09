// export const MODULOS = '/modulos';

const endpoints = {
  base: {
    url: (uri, id = '') => `${uri}/${id}`,
  },
};

export default endpoints;
