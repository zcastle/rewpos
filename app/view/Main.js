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
        }/*,{
            xtype: 'panel',
            id: 'chatContainer',
            floating: true,
            width: 280,
            height: 300,
            bottom: 0,
            right: 0,
            items: [{
                xtype  : 'toolbar',
                docked : 'bottom',
                title  : 'Mensajes'
            }]
        }*/]
    }
});
