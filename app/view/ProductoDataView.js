Ext.define('rewpos.view.ProductoDataView', {
	extend: 'Ext.dataview.DataView',
    xtype: 'productoDataView',
    config: {
        cls: 'dvProductos',
        store: 'Producto',
        inline: true,
        itemTpl: new Ext.XTemplate("<div class='boton'>{nombre}</div>")
    }
});