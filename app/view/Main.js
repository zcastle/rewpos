Ext.define('rewpos.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',
    config: {
        layout: 'vbox',
        items: [{
            xtype: 'toolbarView'
        },{
            id: 'mainCard',
            flex: 1,
            layout: 'card',
            animation:{
                type:'flip'
            },
            items: [{
                xtype: 'accesoView'
            },{
                xtype: 'authView'
            },{
                xtype: 'pedidoView'
            },{
                xtype: 'mesasView'
            },{
                xtype: 'chatView'
            }]
        }]
    }
});
