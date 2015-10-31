Ext.define('rewpos.model.Pago', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
        'id',
        'nroatencion',
        'moneda_id',
        'tarjeta_credito_id',
        {name: 'tarjeta_credito_name', persist: false},
        {name: 'valorpago', type: 'float'},
        {name: 'tipocambio', type: 'float'},
        {name: 'caja_id', type: 'int'},
        {name: 'orden', persist: false}
        ],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'pedido/pago',
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