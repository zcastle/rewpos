Ext.define('rewpos.model.Mesa', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','estado'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'mesa',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});