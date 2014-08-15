Ext.define('rewpos.view.ProductoList', {
	extend: 'Ext.dataview.List',
    xtype: 'productoList',
    id: 'productoList',
    config: {
        //align: 'center',
        //grouped: true,
        //indexBar: true,
        //hideOnMaskTap: false,
        //plugins: ['listpaging', 'pullrefresh'],
        /*plugins: [{
            xclass: 'Ext.plugin.PullRefresh',
            pullText: 'Recargar',
            releaseText: 'Suelta'
        }],*/
        store: 'Producto',
    	itemTpl: new Ext.XTemplate(
            '<div class="producto-row-list">',
            '<div class="nombre field">{nombre:this.toUpper}</div>'+
            '<div class="precio field">{precio:this.formatNumer}</div>'+
            '</div>',
            {
                toUpper: function(item) {
                    return item.toUpperCase();
                },
                formatNumer: function(item) {
                    return rewpos.Util.toFixed(item, 2);
                }
            }
        )
    }
});