Ext.define('rewpos.controller.Mesas', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido'],
        models: ['Pedido'],
        refs: {
            seleccionView: 'seleccionView',
            toolbarView: 'toolbarView'
        },
        control: {
            'mesasView dataview': {
                itemtap: 'onItemTap'
            }
        } 
    },
    onItemTap: function(view, index, target, record) {
        this.loadPedido(record.get('id'));
    },
    loadPedido: function(mesa) {
        Ext.getStore('Pedido').load({
            params: {
                mesa: mesa
            },
            callback: function(records) {
                if(records.length>0){
                    this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(records[0].get('mozo_id'));
                    this.getSeleccionView().down('selectfield[name=cboPax]').setValue(records[0].get('pax'));
                } else {
                    this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(0);
                    this.getSeleccionView().down('selectfield[name=cboPax]').setValue(1);
                }
            },
            scope: this
        });
        this.getSeleccionView().down('button[name=btnSeleccionMesa]').setText('M: '+mesa);
        this.getToolbarView().down('button[name=backToPedido]').setHidden(true);
        rewpos.Util.showPanel('comandoCard', 'productoView', 'left');
        rewpos.Util.showPanel('mainCard', 'pedidoView', 'right');
    }
});