Ext.define('rewpos.model.Pedido', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
        'id',
        'nroatencion','cajero_id','mozo_id','producto_id',
        'producto_name',
        {name: 'cantidad', type: 'int'},
        'precio',
        {name: 'dscto', type: 'float', defaultValue: '0'},
        'cliente_id','tipo_documento_id', 'caja_id', 'pax',
        'mensaje',
        {name: 'dividir_cta', defaultValue: '0'},
        {name: 'enviado', defaultValue: 'N'},
        {name: 'numero_cta', defaultValue: '0'},
        {name: 'agrupar', defaultValue: 'N'},
        {name: 'mover', defaultValue: 'N'}
        ],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'pedido',
            reader: {
                type: 'json',
                rootProperty: 'data'
            },
            writer: {
                type: 'json',
                encode: true,
                rootProperty: 'data'
            }
        }
    }
});