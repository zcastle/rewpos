Ext.define('rewpos.model.Config', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','caja_id','print_server','print_port'],
        validations: [
            {type: 'presence', field: 'caja_id'},
            {type: 'presence', field: 'print_server'},
            {type: 'presence', field: 'print_port'}
        ],
        proxy: {
            type: 'localstorage'
        }
    }
});