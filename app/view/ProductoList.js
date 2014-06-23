Ext.define('rewpos.view.ProductoList', {
	extend: 'Ext.dataview.List',
    xtype: 'productoList',
    config: {
        align: 'center',
        //plugins: ['listpaging', 'pullrefresh'],
        /*plugins: [{
            xclass: 'Ext.plugin.PullRefresh',
            pullText: 'Recargar',
            releaseText: 'Suelta'
        }],*/
        store: 'Producto',
    	itemTpl: '<div id="producto"><div class="nombre field">{nombre}</div><div class="precio field">{precio}</div></div>'
    }
});