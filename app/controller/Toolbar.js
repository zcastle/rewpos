Ext.define('rewpos.controller.Toolbar', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            'toolbarView button': {
                tap: 'ontap'
            }
        } 
    },
    ontap: function(btn) {
        switch(btn.getItemId()) {
            case 'backToPedido':
                btn.setHidden(true);
                rewpos.Util.showPanel('mainCard', 'pedidoView', 'right');
                break;
            case 'usuarioLogin':
                //rewpos.Util.showPanel('mainCard', 'chatView', 'left');
                break;
            case 'showMenu':
                Ext.Viewport.toggleMenu('right');
                break;
        }
    }
});