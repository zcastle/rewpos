Ext.define('rewpos.model.Cliente', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','ruc','nombre','direccion','ubigeo_id',
        {name: 'ubigeo_name', persist: false},
        {name: 'departamento_id', persist: false},
        {name: 'provincia_id', persist: false}
        ],
        validations: [
            {type: 'presence', field: 'ruc'},
            {type: 'presence', field: 'nombre'}
        ],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'cliente',
            reader: {
                type: 'json',
                rootProperty: 'data'
            },
            writer: {
                type: 'json',
                encode: true,
                rootProperty: 'data'
            }
        }
    }
});