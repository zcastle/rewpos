Ext.define('rewpos.controller.Mesas', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido'],
        models: ['Pedido'],
        refs: {
            seleccion: 'seleccion'
        },
        control: {
            'mesasView': {
                activate: 'activate'
            },
            'mesasView dataview': {
                itemtap: 'onItemTap'
            }
        } 
    },
    activate: function(view) {},
    onItemTap: function(view, index, target, record) {
        Ext.getStore('Pedido').load({
            params: {
                mesa: record.get('id')
            }
        });
        this.getSeleccion().down('button[name=btnSeleccionMesa]').setText('M: '+record.get('id'));
        Ext.getCmp('backToPedido').setHidden(true);
        if(rewpos.AppGlobals.ANIMACION) {
            Ext.getCmp('comando').animateActiveItem('buscarView', {
                    type: 'slide',
                    direction: 'left'
                }
            );
            Ext.getCmp('mainCard').animateActiveItem('pedidoView', {
                    type: 'slide',
                    direction: 'right'
                }
            );
        } else {
            Ext.getCmp('comando').setActiveItem('buscarView');
            Ext.getCmp('mainCard').setActiveItem('pedidoView');
        }
    }
});