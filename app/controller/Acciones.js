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
            case 'lblTotalMonto':
                //Ext.data.Types.NUMBER.convert(btn.getText().substr(4))<=0
                //console.log(Ext.getStore('Pedido').getCount());
                if(Ext.getStore('Pedido').getCount()>0) {
                    var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
                    Ext.getStore('Pago').load({
                        url: rewpos.AppGlobals.HOST+'pedido/pago/'+nroatencion,
                        callback: function() {
                            if(rewpos.AppGlobals.ANIMACION) {
                                Ext.getCmp('comando').animateActiveItem('pagosView', {
                                        type: 'slide',
                                        direction: 'right'
                                    }
                                );
                            } else {
                                Ext.getCmp('comando').setActiveItem('pagosView');
                            }
                        },
                        scope: this
                    });
                }
                break;
        }
    }
});