Ext.define('rewpos.model.Tarjeta_Credito', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'tarjeta_credito',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});