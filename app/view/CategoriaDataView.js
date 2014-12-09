Ext.define('rewpos.view.CategoriaDataView', {
	extend: 'Ext.dataview.DataView',
    xtype: 'categoriaDataView',
    config: {
        cls: 'dvCategorias',
        store: 'Categoria',
        inline: true,
        itemTpl: new Ext.XTemplate("<div class='boton'>{nombre}</div>")
    }
});