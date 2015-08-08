Ext.define('rewpos.model.Corporacion', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'corporacion',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});