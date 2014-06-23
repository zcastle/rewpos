Ext.define('rewpos.model.Producto', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre','precio','orden'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'producto/pos/categoria/',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});