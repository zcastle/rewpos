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
                releaseText: 'Suelta para Recargar'
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
                    disableFormats: true,
                    isOcupada: function(estado){
                       return estado == 'O';
                    }
                }
            )
        }]
    }
});