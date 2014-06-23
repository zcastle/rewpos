Ext.define('rewpos.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
        'Ext.dataview.List'
    ],
    config: {
        layout: 'vbox',
        items: [{
            xtype: 'toolbarView'
        },{
            id: 'mainCard',
            flex: 1,
            layout: 'card',
            animation:{type:'flip'},
            items: [{
                xtype: 'accesoView'
            },{
                xtype: 'pedidoView'
            },{
                xtype: 'mesasView'
            }]
        }]
    }
});
