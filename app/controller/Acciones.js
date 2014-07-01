Ext.define('rewpos.controller.Acciones', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido','Pago'],
        control: {
            'accionesView button': {
                tap: 'ontap'
            }
        } 
    },
    ontap: function(btn) {
        switch(btn.name) {
            case 'lblPrecuenta':
                this.precuenta();
                break
            case 'lblTotalMonto':
                //Ext.data.Types.NUMBER.convert(btn.getText().substr(4))<=0
                if(Ext.getStore('Pedido').getCount()>0) {
                    var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
                    Ext.getStore('Pago').load({
                        url: rewpos.AppGlobals.HOST+'pedido/pago/'+nroatencion,
                        callback: function() {
                            rewpos.Util.showPanel('comando', 'pagosView', 'right');
                        },
                        scope: this
                    });
                }
                break;
        }
    },
    precuenta: function() {
        if(Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            Ext.Viewport.setMasked(true);
            Ext.Ajax.request({
                url: rewpos.AppGlobals.HOST+'pedido/print/precuenta',
                method: 'POST',
                params: {
                    nroatencion: nroatencion
                },
                callback: function(){
                    Ext.Viewport.setMasked(false);
                }
            });
        } else {
            Ext.Msg.alert('', 'No hay un pedido', Ext.emptyFn);
        }
    }
});