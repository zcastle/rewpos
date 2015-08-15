/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/
/*Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false
});*/
Ext.application({
    name: 'rewpos',
    //,'rewpos.Print',
    requires: [
        'rewpos.AppGlobals','rewpos.Util', 'rewpos.Menu',
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.Label',
        'Ext.field.Text',
        'Ext.field.Spinner',
        'Ext.field.Radio',
        'Ext.field.Select',
        'Ext.field.Hidden',
        'Ext.field.Password',
        'Ext.field.Search',
        'Ext.field.TextArea',
        'Ext.Button',
        'Ext.Menu',
        'Ext.plugin.PullRefresh',
        'Ext.MessageBox',
        'Ext.SegmentedButton',
        'Ext.Img'
    ],
    controllers: [
        'Main','Toolbar','Comando','Pedido','Mesas','Editar','Pagos',
        'Acceso','Auth','AutorizacionModal','Producto','ClienteModal',
        'CambiarMesaModal','TecladoPrecioModal','AnularDocumentoModal',
        'ConfigModal','TecladoFull'
    ],
    //'Acciones',
    views: [
        'Main','PedidoView','MesasView','ToolbarView','SeleccionView',
        'Totales','PedidoList','ComandosView','CategoriaList','ProductoList','ProductoView',
        'EditarForm','TecladoMoneda','PagosView','AccesoView','AuthView','TecladoNumerico',
        'ChatView','AutorizacionModal','ClienteModal','CambiarMesaModal','TecladoPrecioModal',
        'AnularDocumentoModal','ProductoTouchView','CategoriaDataView','ProductoDataView',
        'ConfigModal','TecladoFull','ClienteBuscarModal'
    ],

    icon: {
        '57': 'resources/icons/57.jpg',
        '72': 'resources/icons/72.jpg',
        '114': 'resources/icons/114.jpg',
        '144': 'resources/icons/144.jpg'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.jpg',
        '768x1004': 'resources/startup/768x1004.jpg',
        '748x1024': 'resources/startup/748x1024.jpg',
        '1536x2008': 'resources/startup/1536x2008.jpg',
        '1496x2048': 'resources/startup/1496x2048.jpg'
    },

    launch: function() {
        //Destroy the #appLoadingIndicator element
        //Ext.fly('appLoadingIndicator').destroy();
        Ext.fly('canvasloader-container').destroy();
        // Initialize the main view
        Ext.Viewport.add(Ext.create('rewpos.view.Main'));
    },
    onUpdated: function() {
        Ext.Msg.confirm(
            "Actualización de la aplicación", //Application Update
            "Esta aplicación ha sido actualizada con éxito a la última versión. Actualizar ahora?",//"This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
