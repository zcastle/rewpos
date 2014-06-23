Ext.define('rewpos.view.AccesoView', {
	extend: 'Ext.Container',
    xtype: 'accesoView',
    config: {
        layout: 'hbox',
        items: [{
            width: 300
        },{
            xtype: 'dataview',
            flex: 1,
            id: 'dataViewUsuarios',
            store: 'Usuario',
            inline: true,
            itemTpl: new Ext.XTemplate(
                '<div class="usuario">',
                '<tpl if="this.isXY(sexo)">',
                    '<img src="resources/images/usuario_m.png">',
                '<tpl else>',
                    '<img src="resources/images/usuario_f.png">',
                '</tpl>',
                '<div class="nombre">{nombre} {apellido}</div>',
                '</div>',
                {
                    isXY: function(sexo){
                       return sexo == 'M';
                    }
                }
            )
        }]
    }
});