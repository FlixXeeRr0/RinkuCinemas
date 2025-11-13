// GENERAL MESSAGES
export const SUCCESS = 'Operación realizada exitosamente';
export const ERROR = 'Ocurrió un error al procesar la solicitud';
export const FOUND_VALUES = (total, objectName) => `Se encontraron ${total} ${objectName}`;
export const NO_FOUND_VALUES = 'No se encontraron resultados';

// FORM MESSAGES
export const IS_REQUIRED = 'Este campo es requerido';
export const SUCCESS_INSERT = (objectName) => `${objectName} creado exitosamente`;
export const SUCCESS_UPDATE = (objectName) => `${objectName} actualizado exitosamente`;
export const ERROR_SAVE = 'Ocurrió un error al guardar';
export const SUCCESS_DELETE = (objectName) => `${objectName} eliminado exitosamente`;
export const ERROR_DELETE = (objectName) => `Error al eliminar el ${objectName}`;

// EMPLOYEES MESSAGES
export const CATALOG_ERROR = 'Error al cargar los catálogos';

// DIALOG MESASGES
export const DELETE_DIALOG_TITLE = 'Confirmar eliminación';
export const DELETE_DIALOG_TEXT = (objectName, value) => `¿Está seguro que desea eliminar al ${objectName} ${value}?`;