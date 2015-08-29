Ext.define('rewpos.AppGlobals', {
    alternateClassName: 'appGlobals',
    singleton: true,
    CIA: 'OPENBUSINESS',
    ANIMACION: false,
    DEBUG: false,
    DEV: true,
    //HOST: 'http://192.168.1.6:2385/',
    //HOST: 'http://192.168.0.11/rewservices/',
    //HOST: 'http://pos.openbusiness.pe/services/',
    //HOST: 'http://10.10.10.20:2385/index.php/',
    //HOST: 'http://192.168.0.12/rewservices/',
    HOST: 'http://10.10.10.2:8080/rewservices/',
    //HOST: 'http://localhost:3000/api/',
    //HOST_PRINT: 'http://192.168.1.5:8084/REWPrinterPool/',
    //HOST_PRINT: 'http://192.168.1.6:8523/',
    HOST_PRINT: '',
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
    ROL_ID_ADMIN: 1,
    MONEDA_SIMBOLO: 'S/.&nbsp;',
    USUARIO: null,
    CAJA: null,
    CAJA_ID: null,
    TIPO_CAMBIO: 2.8,
    //DEFAULT_CORPORACION: 1,
    CORPORACION: null,
    MAX_MESAS: 100,
    MASK: false,
    LIST_SELECTED: null,
    DB: null,
    MSG_PRINTER_ERROR: 'Error al imprimir, verificar estado de impresora.',
    PRODUCTO_TOUCH: true
});
