Ext.define('rewpos.view.ToolbarView', {
	extend: 'Ext.Toolbar',
    xtype: 'toolbarView',
    id: 'toolbarView',
    config: {
    	layout: 'hbox',
        //ui: 'dark',
        //cls: 'background_titulo',
        //docked: 'top',
        items: [{
            name: 'backToPedido',
            itemId: 'backToPedido',
            hidden: true,
            text: 'PEDIDO',
            ui: 'back'
        },{
            text: rewpos.AppGlobals.CIA,
            style: 'background: transparent; border: 0px;'
        },{
            flex: 1,
            name: 'empresaLogin',
            text: '',
            style: 'background: transparent; border: 0px;'
        },{
            name: 'usuarioLogin',
            itemId: 'usuarioLogin',
            text: '',
            style: 'background: transparent; border: 0px;'
        },{
            name: 'notificationCount',
            hidden: true,
            badgeText: 2,
            style: 'background: transparent; border: 0px;'
        },{
            text: 'MENU',
            itemId: 'showMenu',
            name: 'showmenu',
            style: 'background: transparent; border: 0px;'
        }]
    }
});