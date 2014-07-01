Ext.define('rewpos.controller.Toolbar', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            'toolbarView': {
                activate: 'activate'
            },
            'toolbarView button': {
                tap: 'ontap'
            }
        } 
    },
    activate: function(view) {},
    ontap: function(btn) {
        switch(btn.id) {
            case 'backToPedido':
                Ext.getCmp('backToPedido').setHidden(true);
                rewpos.Util.showPanel('mainCard', 'pedidoView', 'right');
                break;
            case 'usuarioLogin':
                //Ext.getCmp('backToPedido').setHidden(false);
                //rewpos.Util.showPanel('mainCard', 'chatView', 'left');
                break;
        }
    }
});