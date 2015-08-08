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
            '<div class="-row-list">',
            '<div class="field codigo">{codigo}</div>'+
            '<div class="field flex">{nombre:this.toUpper}</div>'+
            '<div class="field precio">{precio:this.formatNumer}</div>'+
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