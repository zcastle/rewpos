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
                
                break
            case 'lblTotalMonto':
                //Ext.data.Types.NUMBER.convert(btn.getText().substr(4))<=0
                if(Ext.getStore('Pedido').getCount()>0) {
                    var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
                    var cliente = Ext.getStore('Pedido').getAt(0).get('cliente_name');
                    if(cliente=='' || cliente==null) {
                        Ext.getCmp('btnCliente').setText('Cliente');
                    } else {
                        Ext.getCmp('btnCliente').setText(cliente);
                    }
                    Ext.getStore('Pago').load({
                        url: rewpos.AppGlobals.HOST+'pedido/pago/'+nroatencion,
                        callback: function() {
                            rewpos.Util.showPanel('comando', 'pagosView', 'right');
                        }
                    });
                }
                break;
        }
    }
});