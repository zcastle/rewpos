Ext.define('rewpos.model.Config', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','caja_id','host_service'],
        validations: [
            {type: 'presence', field: 'caja_id'}
        ],
        proxy: {
            type: 'localstorage'
        }
    }
});