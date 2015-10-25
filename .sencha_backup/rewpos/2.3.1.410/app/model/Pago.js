Ext.define('rewpos.model.Pago', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
        'id',
        'nroatencion',
        {name: 'caja_id', type: 'int'},
        'tipopago',
        {name: 'valorpago', type: 'float'},
        {name: 'tipocambio', type: 'float'},
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