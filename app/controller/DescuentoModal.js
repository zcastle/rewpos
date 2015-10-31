Ext.define('rewpos.controller.DescuentoModal', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido'],
        refs: {
            descuentoModal: 'descuentoModal',
            descuento: 'descuentoModal numberfield'
        },
        control: {
            'descuentoModal': {
                initialize: 'onInitialize',
                activate: 'onActivate'
            },
            'descuentoModal > numberfield': {
                action: 'onTextFieldAction'
            }
        } 
    },
    onInitialize: function(view) {
        //console.log("onInitialize");
        //console.log(this.getDescuento());
        //this.getDescuento().focus();
        //view.down('numberfield').focus();
    },
    onActivate: function(){
        console.log("onActivate");
    },
    onTextFieldAction: function(text){
        var valor = text.getValue();
        if(valor){
            //console.log(valor);
            Ext.getStore('Pedido').each(function(record){
                record.set('dscto', valor);
            });
        }

    }
});