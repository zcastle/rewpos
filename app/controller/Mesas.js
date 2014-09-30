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
        rewpos.Util.mask('Cargando...', true);
        //console.log(rewpos.AppGlobals.HOST+'pedido/'+mesa+'/'+rewpos.AppGlobals.CAJA_ID);
        Ext.getStore('Pedido').load({
            url: rewpos.AppGlobals.HOST+'pedido/'+mesa+'/'+rewpos.AppGlobals.CAJA_ID,
            callback: function(records) {
                rewpos.Util.unmask(true);
                if(records.length>0){
                    this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(records[0].get('mozo_id'));
                    this.getSeleccionView().down('selectfield[name=cboPax]').setValue(records[0].get('pax'));
                } else {
                    this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(0);
                    this.getSeleccionView().down('selectfield[name=cboPax]').setValue(1);
                }
                if(rewpos.AppGlobals.PRODUCTO_TOUCH) {
                    rewpos.Util.showPanel('comandoCard', 'productoTouchView', 'left');
                    rewpos.Util.showPanel('productosCard', 'categoriaDataView', 'left');
                } else {
                    rewpos.Util.showPanel('comandoCard', 'productoView', 'left');
                }
                this.getSeleccionView().down('button[name=btnSeleccionMesa]').setText('M: '+mesa);
                this.getToolbarView().down('button[name=backToPedido]').setHidden(true);
                rewpos.Util.showPanel('mainCard', 'pedidoView', 'right');
            },
            scope: this
        });
    }
});