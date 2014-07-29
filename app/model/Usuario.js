Ext.define('rewpos.model.Usuario', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre','apellido','dni','telefono','direccion','ubigeo_id',
        'usuario','clave','eliminado','rol_id','centrocosto_id', 'sexo'
        ],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'usuario',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});