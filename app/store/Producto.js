Ext.define('rewpos.store.Producto', {
    extend: 'Ext.data.Store',
    config: {
        model: 'rewpos.model.Producto',
        grouper: {
			groupFn: function(record) {
				return record.get('nombre')[0];
			}
		},
    }
});