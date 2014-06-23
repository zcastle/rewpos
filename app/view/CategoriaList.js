Ext.define('rewpos.view.CategoriaList', {
	extend: 'Ext.dataview.List',
    xtype: 'categoriaList',
    config: {
        align: 'center',
        store: 'Categoria',
    	itemTpl: '<div class="center">{nombre}</div>'
    }
});