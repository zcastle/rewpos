Ext.define('rewpos.model.Venta', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','fecha','documento','cliente','anulado'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'venta',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});