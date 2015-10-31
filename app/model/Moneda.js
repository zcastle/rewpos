Ext.define('rewpos.model.Moneda', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'moneda',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});