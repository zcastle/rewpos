Ext.define('rewpos.model.Pedido', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
        'id',
        'nroatencion','cajero_id','mozo_id','producto_id',
        'producto_name',
        {name: 'cantidad', type: 'int'},
        'precio', 'descuento_tipo_id', {name: 'descuento_tipo_name', persist: false},
        {name: 'dscto_m', type: 'float', defaultValue: '0'},
        {name: 'dscto_p', type: 'float', defaultValue: '0'},
        'cliente_id', {name: 'cliente_name', persist: false},
        'tipo_documento_id', 'caja_id', 'pax',
        'mensaje',
        {name: 'dividir_cta', defaultValue: '0'},
        {name: 'enviado', defaultValue: 'N'},
        {name: 'numero_cta', defaultValue: '0'},
        {name: 'agrupar', defaultValue: 'N'},
        {name: 'mover', defaultValue: 'N'},
        {name: 'hijos', defaultValue: ''}
        ],
        validations: [
            {type: 'presence', field: 'producto_name'},
            {type: 'presence', field: 'cantidad'},
            {type: 'presence', field: 'precio'}
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