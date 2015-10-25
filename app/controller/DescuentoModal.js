Ext.define('rewpos.controller.DescuentoModal', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido'],
        /*refs: {
            autorizacionModal: 'autorizacionModal'
        },*/
        control: {
            'descuentoModal': {
                initialize: 'onInitialize',
            },
            'descuentoModal numberfield': {
                action: 'onTextFieldAction',
            }
        } 
    },
    onInitialize: function(view) {
        //console.log(view)
    },
    onTextFieldAction: function(text){
        var valor = text.getValue();
        if(valor){
            console.log(valor);
            Ext.getStore('Pedido').each(function(record){
                record.set('dscto', nrodestino);
            });
        }

    }
});