Ext.define('rewpos.view.ToolbarView', {
	extend: 'Ext.Toolbar',
    xtype: 'toolbarView',
    config: {
    	layout: 'hbox',
        //ui: 'dark',
        //cls: 'background_titulo',
        //docked: 'top',
        items: [{
            id: 'backToPedido',
            hidden: true,
            text: 'PEDIDO',
            ui: 'back'
        },{
            text: rewpos.AppGlobals.CIA,
            style: 'background: transparent; border: 0px;'
        },{
            flex: 1,
            id: 'empresaLogin',
            text: '',
            style: 'background: transparent; border: 0px;'
        },{
            id: 'usuarioLogin',
            text: '',
            style: 'background: transparent; border: 0px;'
        },{
            id: 'notificationCount',
            hidden: true,
            badgeText: 2,
            style: 'background: transparent; border: 0px;'
        }]
    }
});