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
        this.getSeleccionView().down('button[name=btnSeleccionMesa]').setText('M: '+record.get('id'));
        this.getToolbarView().down('button[name=backToPedido]').setHidden(true);
        rewpos.Util.showPanel('comando', 'productoView', 'left');
        rewpos.Util.showPanel('mainCard', 'pedidoView', 'right');
    }
});