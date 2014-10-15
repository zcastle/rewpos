Ext.define('rewpos.model.Usuario', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre','apellido','usuario','clave','rol_id','centrocosto_id', 'sexo'
        ],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'usuario/pos/rol',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});