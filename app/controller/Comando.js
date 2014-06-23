Ext.define('rewpos.controller.Comando', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            myContainer: 'comandos'
        },
        control: {
            'comandos': {
                activate: 'activate'
            },
            'comandos button': {
                tap: 'ontap'
            }
        } 
    },
    activate: function(view) {
        //console.log(view)
    },
    ontap: function(btn) {
        switch(btn.id) {
            case 'btnComandoBuscar':
                if(rewpos.AppGlobals.ANIMACION) {
                    Ext.getCmp('comando').animateActiveItem('buscarView', {
                            type: 'slide',
                            direction: 'left'
                        }
                    );
                } else {
                    Ext.getCmp('comando').setActiveItem('buscarView');
                }
                break;
            case 'btnComandoMas':
                Ext.Viewport.toggleMenu('right');
                break;
        }
    }
});