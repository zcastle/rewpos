Ext.define('rewpos.view.MesasView', {
	extend: 'Ext.Container',
    xtype: 'mesasView',
    config: {
    	layout: 'fit',
        items: [{
            xtype: 'dataview',
            id: 'dataViewMesas',
            plugins: [{
                xclass: 'Ext.plugin.PullRefresh',
                pullText: 'Recargar Mesas',
                releaseText: 'Suelta para Recargar',
                autoSnapBack: false,
                fetchLatest: function() {
                    var store = this.getList().getStore(),
                        proxy = store.getProxy(),
                        operation;

                    operation = Ext.create('Ext.data.Operation', {
                        page: 1,
                        start: 0,
                        model: store.getModel(),
                        limit: store.getPageSize(),
                        action: 'read',
                        sorters: store.getSorters(),
                        filters: store.getRemoteFilter() ? store.getFilters() : []
                    });
                    store.removeAll();
                    //console.log(this.getList());
                    proxy.read(operation, this.onLatestFetched, this);
                }
            }],
            store: 'Mesa',
            inline: true,
            itemTpl: new Ext.XTemplate(
                '<tpl if="this.isOcupada(estado)">',
                    '<div class="mesa ocupada">',
                '<tpl else>',
                    '<div class="mesa libre">',
                '</tpl>',
                '{id}</div>',
                {
                    // XTemplate configuration:
                    disableFormats: true,
                    // member functions:
                    isOcupada: function(estado){
                       return estado == 'O';
                    }
                }
            )
        }]
    }
});