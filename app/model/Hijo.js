Ext.define('rewpos.model.Hijo', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'id','nombre', {name: 'check', type: 'boolean'}
        ],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'producto/hijos',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});