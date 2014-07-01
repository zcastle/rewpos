Ext.define('rewpos.controller.Comando', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            myContainer: 'comandos'
        },
        control: {
            'comandos button': {
                tap: 'ontap'
            }
        } 
    },
    ontap: function(btn) {
        switch(btn.id) {
            case 'btnComandoBuscar':
                rewpos.Util.showPanel('comando', 'buscarView', 'left');
                break;
            case 'btnComandoMas':
                Ext.Viewport.toggleMenu('right');
                break;
        }
    }
});