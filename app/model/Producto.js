Ext.define('rewpos.model.Producto', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre','precio','orden',
        {name: 'categoria_id', type: 'int'}, 'categoria_name', 'codigo'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'producto/pos',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});