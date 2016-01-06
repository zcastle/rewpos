Ext.define('rewpos.model.Descuento_Tipo', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre','nombre_largo','datos','tipo'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'descuento_tipo',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});