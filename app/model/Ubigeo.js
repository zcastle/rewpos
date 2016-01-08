Ext.define('rewpos.model.Ubigeo', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'ubigeo',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});