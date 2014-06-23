Ext.define('rewpos.controller.Toolbar', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            //myContainer: 'comandos'
        },
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
                if(rewpos.AppGlobals.ANIMACION) {
                    Ext.getCmp('mainCard').animateActiveItem('pedidoView', {
                            type: 'slide',
                            direction: 'right'
                        }
                    );
                } else {
                    Ext.getCmp('mainCard').setActiveItem('pedidoView');
                }
            break;
        }
    }
});