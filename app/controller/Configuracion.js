Ext.define('rewpos.controller.Configuracion', {
    extend: 'Ext.app.Controller',
    config: {
        //models: ['Config'],
        refs: {
            //configuracionCard: '#configuracionCard'
        },
        control: {
            'configuracionView': {
                activate: 'onActivateView'
            },
            'configuracionList': {
                activate: 'onActivateList',
                itemtap: 'onItemtapConfiguracionList'
            }
        } 
    },
    onActivateView: function(view){
        //console.log(view);
        //console.log(this.configuracionCard);
        //console.log(Ext.getCmp('configuracionCard'));
    },
    onActivateList: function(view) {
        view.select(0);
    },
    onItemtapConfiguracionList: function(list, index, target, record){
        switch(index){
            case 0:
                //
                break;
            case 1:
                //
                break;
            case 2:
                //console.log(Ext.getCmp('configuracionCard'));
                rewpos.Util.showPanel('configuracionCard', 'mantenimientoProductoList', 'right');
                break;
        }
    }
});