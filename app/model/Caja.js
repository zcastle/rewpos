Ext.define('rewpos.model.Caja', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre','impresora_p','impresora_b','impresora_f',
        {name: 'centrocosto_name', persist: false},
        {name: 'empresa_name', persist: false}],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'caja',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});