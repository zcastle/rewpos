Ext.define('rewpos.model.Imprimir', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'success','error','message'
        ],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'imprimir',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});