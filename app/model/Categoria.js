Ext.define('rewpos.model.Categoria', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'categoria',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});