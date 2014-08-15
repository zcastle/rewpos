Ext.define('rewpos.AppGlobals', {
    singleton: true,
    CIA: 'OPENBUSINESS',
    ANIMACION: false,
    DEBUG: true,
    HOST: 'http://localhost:2385/',
    //HOST_PRINT: 'http://192.168.1.5:8084/REWPrinterPool/',
    HOST_PRINT: 'http://localhost:8523/',
    HOST_SYNC: '',
    PORT_SYNC: '',
    DB_SYNC: '',
    USER_SYNC: '',
    PASS_SYC: '',
    CABECERA: null,
    DETALLE: null,
    ROL_ID_MOZO: 6,
    ROL_ID_VENTA: 2,
    ROL_ID_VENTA_JEFE: 4,
    ROL_ID_ADMINISTRADOR: 1,
    MONEDA_SIMBOLO: 'S/.&nbsp;',
    USUARIO: null,
    CAJA: null,
    TIPO_CAMBIO: 2.8,
    DEFAULT_CORPORACION: 1,
    CORPORACION: null,
    MAX_MESAS: 100,
    MASK: false,
    LIST_SELECTED: null,
    DB: null,
    MSG_PRINTER_ERROR: 'Error al imprimir, verificar estado de impresora.',
    PRODUCTO_TOUCH: true
});